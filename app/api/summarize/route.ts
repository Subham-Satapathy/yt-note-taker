import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Innertube } from 'youtubei.js';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Extract video ID from YouTube URL
function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { youtubeUrl, wordCount, includeNotes } = body;

    // Validate input
    if (!youtubeUrl) {
      return NextResponse.json(
        { error: 'YouTube URL is required' },
        { status: 400 }
      );
    }

    // Extract video ID
    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }

    // Fetch transcript
    let transcriptText: string;
    try {
      const youtube = await Innertube.create();
      const info = await youtube.getInfo(videoId);
      
      const transcriptData = await info.getTranscript();
      
      if (!transcriptData || !transcriptData.transcript) {
        throw new Error('No transcript available');
      }
      
      const segments = transcriptData.transcript.content?.body?.initial_segments;
      
      if (!segments || segments.length === 0) {
        throw new Error('Transcript segments are empty');
      }
      
      transcriptText = segments
        .map((segment: any) => segment.snippet?.text?.toString() || '')
        .filter((text: string) => text.length > 0)
        .join(' ')
        .trim();
      
      if (!transcriptText || transcriptText.length === 0) {
        throw new Error('Transcript text is empty');
      }
      
      console.log('Transcript fetched successfully, length:', transcriptText.length);
      
      // Truncate transcript based on model
      // GPT-4o-mini: 128k context (use more)
      // GPT-3.5-turbo: 16k context (use less)
      const maxChars = 30000; // ~7500 tokens for GPT-4o-mini
      if (transcriptText.length > maxChars) {
        transcriptText = transcriptText.substring(0, maxChars) + '... [transcript truncated due to length]';
        console.log('Transcript truncated to:', transcriptText.length, 'characters');
      }
    } catch (error) {
      console.error('Transcript error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return NextResponse.json(
        { error: `Could not fetch transcript: ${errorMessage}. The video may not have captions available or may be restricted.` },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    // Build prompt for OpenAI
    const systemPrompt = `You are an expert at creating well-structured, readable summaries. Your writing style features consistent sentence lengths and proper formatting for optimal readability.`;

    const userPrompt = `Analyze this YouTube video transcript and create a summary.

REQUIREMENTS:
- Target length: ${wordCount} words
- Write ONLY in short sentences (12-18 words maximum per sentence)
- Each sentence should be roughly the same length
- Use periods frequently to break up long thoughts
- Never write run-on sentences
- Add a line break after every 3-4 sentences for paragraph separation
${includeNotes ? '- Include 5-8 key bullet points (each 8-15 words)' : ''}
${includeNotes ? '- Include 2-4 action items (each 8-12 words)' : ''}

WRITING STYLE EXAMPLE:
"James explains how to add Google AdSense ads manually. He recommends avoiding automatic ad placement. This prevents layout disruption on websites. Users can create custom ad units instead."

NOT this style:
"In this video, James from Seeker Host provides a detailed guide on how to add Google AdSense ads to your website manually, avoiding the automatic ad placement that can disrupt the layout."

Transcript:
${transcriptText}

Return JSON format:
{
  "title": "Short descriptive title (max 8 words)",
  "summary": "Summary text with short, uniform sentences and paragraph breaks",
  "bulletPoints": ["Short point 1", "Short point 2", ...],
  "actionItems": ["Short action 1", "Short action 2", ...]
}

${!includeNotes ? 'Note: Provide empty arrays for bulletPoints and actionItems.' : ''}`;

    // Call OpenAI API with GPT-4o-mini for best cost/performance balance
    // Cost: $0.150/1M input tokens, $0.600/1M output tokens
    // Context: 128k tokens, excellent quality
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const responseText = completion.choices[0]?.message?.content;
    
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    const result = JSON.parse(responseText);

    // Ensure the response has the expected structure
    const formattedResult = {
      title: result.title || null,
      summary: result.summary || '',
      bulletPoints: Array.isArray(result.bulletPoints) ? result.bulletPoints : [],
      actionItems: Array.isArray(result.actionItems) && result.actionItems.length > 0 
        ? result.actionItems 
        : undefined,
    };

    return NextResponse.json(formattedResult);

  } catch (error) {
    console.error('Error in summarize API:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
