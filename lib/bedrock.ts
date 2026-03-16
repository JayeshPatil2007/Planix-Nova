export async function callBedrock(prompt: string) {
  if (!process.env.BEDROCK_API_KEY) {
    throw new Error("BEDROCK_API_KEY environment variable missing");
  }

  const response = await fetch(
    "https://bedrock-runtime.us-east-1.amazonaws.com/model/amazon.nova-lite-v1:0/invoke",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.BEDROCK_API_KEY}`,
        "x-api-key": process.env.BEDROCK_API_KEY
      },
      // Using standard Nova payload structure, falling back to inputText if needed by a specific endpoint wrapper
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: [{ text: prompt }]
          }
        ]
      })
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Bedrock API Error: ${response.status} ${errorText}`);
  }

  const data = await response.json();

  if (!data) {
    throw new Error("Empty Bedrock response");
  }

  // Extract text from Nova response format
  if (data.output && data.output.message && data.output.message.content && data.output.message.content[0]) {
    return data.output.message.content[0].text;
  }
  
  // Fallback for other potential response formats
  if (data.results && data.results[0] && data.results[0].outputText) {
    return data.results[0].outputText;
  }

  return JSON.stringify(data);
}

export async function callBedrockMultimodal(prompt: string, fileBytes: string, mimeType: string) {
  if (!process.env.BEDROCK_API_KEY) {
    throw new Error("BEDROCK_API_KEY environment variable missing");
  }

  let contentBlock: any;

  if (mimeType.startsWith('image/')) {
    const format = mimeType.split('/')[1]; // e.g. png, jpeg, webp
    contentBlock = {
      image: {
        format: format === 'jpg' ? 'jpeg' : format,
        source: {
          bytes: fileBytes
        }
      }
    };
  } else {
    // Assume document (pdf, text, etc)
    let format = 'txt';
    if (mimeType === 'application/pdf') format = 'pdf';
    else if (mimeType === 'text/csv') format = 'csv';
    else if (mimeType === 'application/msword' || mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') format = 'doc';
    else if (mimeType === 'text/html') format = 'html';
    
    contentBlock = {
      document: {
        name: "uploaded_file",
        format: format,
        source: {
          bytes: fileBytes
        }
      }
    };
  }

  const response = await fetch(
    "https://bedrock-runtime.us-east-1.amazonaws.com/model/amazon.nova-lite-v1:0/invoke",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.BEDROCK_API_KEY}`,
        "x-api-key": process.env.BEDROCK_API_KEY
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: [
              contentBlock,
              { text: prompt }
            ]
          }
        ]
      })
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Bedrock API Error: ${response.status} ${errorText}`);
  }

  const data = await response.json();

  if (!data) {
    throw new Error("Empty Bedrock response");
  }

  if (data.output && data.output.message && data.output.message.content && data.output.message.content[0]) {
    return data.output.message.content[0].text;
  }
  
  if (data.results && data.results[0] && data.results[0].outputText) {
    return data.results[0].outputText;
  }

  return JSON.stringify(data);
}

export async function generateRoadmap(goal: string, timeline: string, hours: string) {
  const prompt = `Create a learning roadmap for: ${goal}. Timeline: ${timeline}. Time commitment: ${hours} hours per day.
Return ONLY valid JSON with the following structure:
{
  "title": "Roadmap Title",
  "totalDuration": "Total Duration",
  "phases": [
    {
      "title": "Phase Title",
      "duration": "Phase Duration",
      "objectives": ["Objective 1", "Objective 2"],
      "explanation": "Detailed explanation",
      "resources": ["Resource 1", "Resource 2"]
    }
  ]
}`;

  const responseText = await callBedrock(prompt);
  
  try {
    // Extract JSON if it's wrapped in markdown code blocks
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1] : responseText;
    return JSON.parse(jsonString);
  } catch (e) {
    console.error("Failed to parse roadmap JSON:", responseText);
    throw new Error("Invalid JSON response from AI");
  }
}

export async function refineRoadmap(currentRoadmap: any, prompt: string, uploadedContext?: string) {
  const contextStr = uploadedContext ? `\n\nUploaded File Context:\n${uploadedContext}\n\n` : '';
  const fullPrompt = `Current Roadmap: ${JSON.stringify(currentRoadmap)}. 
User request to refine: ${prompt}.${contextStr}

Return ONLY valid JSON with the updated roadmap using the exact same structure:
{
  "title": "Roadmap Title",
  "totalDuration": "Total Duration",
  "phases": [
    {
      "title": "Phase Title",
      "duration": "Phase Duration",
      "objectives": ["Objective 1", "Objective 2"],
      "explanation": "Detailed explanation",
      "resources": ["Resource 1", "Resource 2"]
    }
  ]
}`;

  const responseText = await callBedrock(fullPrompt);
  
  try {
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1] : responseText;
    return JSON.parse(jsonString);
  } catch (e) {
    console.error("Failed to parse refined roadmap JSON:", responseText);
    throw new Error("Invalid JSON response from AI");
  }
}

export async function teachingExplain(concept: string, context: string, uploadedContext?: string) {
  const contextStr = uploadedContext ? `\n\nUploaded File Context:\n${uploadedContext}\n\n` : '';
  const prompt = `SYSTEM
You are an AI learning mentor helping the user follow their roadmap.
Rules:
- Respond conversationally.
- Use short paragraphs (2-4 lines max).
- Use bullet points only when helpful.
- Do NOT narrate roadmap structure.
- Do NOT include external resources.
- Do NOT include course suggestions.
- Do NOT include animations or UI references.
- Do NOT mention phases unless explicitly asked.
- Do NOT include code unless user asks.
- Keep responses clear, tight, and readable.
- Default length: 300-600 words max.

Responses must follow format:
# Topic

## Concept
Explanation

## Example
Example explanation

## Practice Task
Small challenge.

CONTEXT
Context: ${context}${contextStr}

USER
Explain the concept: "${concept}"`;

  return await callBedrock(prompt);
}

export async function generateNotes(topic: string, context: string, uploadedContext?: string) {
  const contextStr = uploadedContext ? `\n\nUploaded File Context:\n${uploadedContext}\n\n` : '';
  const prompt = `SYSTEM
You are an AI learning mentor helping the user follow their roadmap.
Rules:
- Return concise study notes.
- Use headings + bullets.
- No essays.
- No storytelling.
- No roadmap narration.
- No external links.
- No allocated resources.
- Keep each section short.
- Maximum response length: 500 words unless user asks for detailed notes.

Format:
# Topic

## Definition
## Key Concepts
## Examples
## Summary

CONTEXT
Context: ${context}${contextStr}

USER
Generate notes for the topic: "${topic}"`;

  return await callBedrock(prompt);
}
