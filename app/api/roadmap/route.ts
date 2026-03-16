import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateRoadmap, refineRoadmap } from '@/lib/bedrock';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    // If we have a userId, fetch roadmaps for that user
    // For now, we'll fetch all roadmaps since auth isn't fully implemented
    const roadmaps = await prisma.roadmap.findMany({
      include: {
        phases: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform to match frontend RoadmapData structure
      const formattedRoadmaps = roadmaps.map((r: any) => ({
      id: r.id,
      goal: r.goal,
      date: r.createdAt.toISOString(),
      status: 'Active',
      totalPhases: r.phases.length,
      totalDuration: r.timeline,
      nodes: r.phases.map((p: any, i: number) => {
        const objectives = typeof p.objectives === 'string' ? JSON.parse(p.objectives) : p.objectives;
        const completedCount = objectives.filter((o: any) => o.completed).length;
        const progress = objectives.length > 0 ? Math.round((completedCount / objectives.length) * 100) : 0;
        
        return {
          id: i + 1,
          phaseId: p.id,
          title: p.title,
          duration: p.duration,
          status: p.completed ? 'completed' : (i === 0 || progress > 0 ? 'in-progress' : 'locked'),
          progress: progress,
          objectives: objectives,
          explanation: p.explanation || '',
          resources: p.resources || []
        };
      })
    }));

    return NextResponse.json(formattedRoadmaps);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch roadmaps' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (data.action === 'generate') {
      const roadmapData = await generateRoadmap(data.goal, data.timeline, data.hours);
      return NextResponse.json(roadmapData);
    }

    if (data.action === 'refine') {
      const updatedRoadmap = await refineRoadmap(data.currentRoadmap, data.prompt, data.uploadedContext);
      
      if (data.currentRoadmap && data.currentRoadmap.id) {
        // Delete old phases
        await prisma.roadmapPhase.deleteMany({
          where: { roadmapId: data.currentRoadmap.id }
        });

        // Create new phases
        const updatedDbRoadmap = await prisma.roadmap.update({
          where: { id: data.currentRoadmap.id },
          data: {
            timeline: updatedRoadmap.totalDuration || data.currentRoadmap.totalDuration,
            phases: {
              create: updatedRoadmap.phases.map((node: any) => {
                const existingPhase = data.currentRoadmap.nodes.find((n: any) => n.title === node.title);
                return {
                  title: node.title,
                  duration: node.duration,
                  completed: false,
                  objectives: node.objectives.map((obj: string | { title: string, completed: boolean }) => {
                    const title = typeof obj === 'string' ? obj : obj.title;
                    const existingObj = existingPhase?.objectives.find((eo: any) => eo.title === title);
                    return { title, completed: existingObj ? existingObj.completed : false };
                  }),
                  explanation: node.explanation || '',
                  resources: node.resources || []
                };
              })
            }
          },
          include: {
            phases: true
          }
        });

        // Inject new phase IDs into the response
        updatedRoadmap.phases = updatedRoadmap.phases.map((phase: any) => {
          const dbPhase = updatedDbRoadmap.phases.find((p: any) => p.title === phase.title);
          return {
            ...phase,
            id: dbPhase?.id,
            objectives: dbPhase ? (typeof dbPhase.objectives === 'string' ? JSON.parse(dbPhase.objectives) : dbPhase.objectives) : phase.objectives
          };
        });
      }

      return NextResponse.json(updatedRoadmap);
    }
    
    if (data.action === 'updateProgress') {
      const phase = await prisma.roadmapPhase.findUnique({ where: { id: data.phaseId } });
      if (!phase) return NextResponse.json({ error: 'Phase not found' }, { status: 404 });
      
      const objectives = typeof phase.objectives === 'string' ? JSON.parse(phase.objectives) : phase.objectives;
      if (objectives[data.objIndex]) {
        objectives[data.objIndex].completed = data.completed;
      }
      
      const allCompleted = objectives.every((o: any) => o.completed);
      
      await prisma.roadmapPhase.update({
        where: { id: data.phaseId },
        data: { 
          objectives: objectives,
          completed: allCompleted
        }
      });
      
      return NextResponse.json({ success: true });
    }
    
    const newRoadmap = await prisma.roadmap.create({
      data: {
        goal: data.goal,
        timeline: data.totalDuration,
        hoursPerDay: data.hoursPerDay || '2', // Default if not provided
        phases: {
          create: data.phases.map((node: any) => ({
            title: node.title,
            duration: node.duration,
            completed: false,
            objectives: node.objectives.map((obj: string) => ({ title: obj, completed: false })),
            explanation: node.explanation || '',
            resources: node.resources || []
          }))
        }
      },
      include: {
        phases: true
      }
    });

    return NextResponse.json({ success: true, roadmap: newRoadmap });
  } catch (error: any) {
    console.error("API /api/roadmap POST error:", error);
    return NextResponse.json({ error: error.message || 'Failed to process roadmap request' }, { status: 500 });
  }
}
