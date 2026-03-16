import { NextResponse } from 'next/server';
import { callBedrockMultimodal } from '@/lib/bedrock';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString('base64');
    const mimeType = file.type;

    const prompt = "Analyze this file and extract key concepts that would help someone studying this topic.";

    const responseText = await callBedrockMultimodal(prompt, base64Data, mimeType);

    if (!responseText) {
      throw new Error("Failed to generate analysis from file");
    }

    return NextResponse.json({ extractedText: responseText });
  } catch (error: any) {
    console.error("Upload API error:", error);
    return NextResponse.json({ error: error.message || 'Failed to process file upload' }, { status: 500 });
  }
}
