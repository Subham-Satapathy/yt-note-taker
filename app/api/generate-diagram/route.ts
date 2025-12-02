import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { summary, bulletPoints, actionItems } = await req.json();

    if (!summary) {
      return NextResponse.json(
        { error: 'Summary is required' },
        { status: 400 }
      );
    }

    // Generate Mermaid flowchart diagram code using OpenAI
    const prompt = `Based on the following content, create a Mermaid flowchart diagram that visualizes the main process, concepts, or workflow.

Content:
Summary: ${summary}
Key Points: ${bulletPoints?.join(', ')}
Action Items: ${actionItems?.join(', ')}

Generate ONLY the Mermaid code for a flowchart. Use proper Mermaid flowchart syntax (graph TD/LR). Include the main concepts as nodes and show relationships with arrows. Keep it clear and logical.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at creating visual diagrams using Mermaid syntax. Generate clean, well-structured Mermaid diagram code. Return ONLY the Mermaid code without any markdown code blocks or explanations.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    let mermaidCode = completion.choices[0]?.message?.content || '';
    
    // Clean up the response - remove markdown code blocks if present
    mermaidCode = mermaidCode.replace(/```mermaid\n?/g, '').replace(/```\n?/g, '').trim();

    return NextResponse.json({ 
      mermaidCode,
      success: true 
    });

  } catch (error: any) {
    console.error('Diagram generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate diagram' },
      { status: 500 }
    );
  }
}
