import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Innertube } from 'youtubei.js';
import { auth } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';
import { prisma } from '@/lib/prisma';

// Lazy initialize OpenAI client to avoid build-time errors
function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

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
    // Check authentication
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to use this service.' },
        { status: 401 }
      );
    }

    // Check rate limit
    const userId = session.user.id!;
    const rateLimit = await checkRateLimit(userId, '/api/summarize');
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please try again later.',
          resetTime: rateLimit.resetTime.toISOString(),
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.resetTime.toISOString(),
          },
        }
      );
    }

    const body = await request.json();
    const { youtubeUrl, wordCount, includeNotes, generateDiagram } = body;

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

    // Fetch transcript and video metadata
    let transcriptText: string;
    let videoMetadata: {
      title: string;
      description: string;
      duration: number;
      viewCount: string;
      publishDate: string;
      author: string;
      category: string;
    } | undefined;
    
    try {
      const youtube = await Innertube.create();
      const info = await youtube.getInfo(videoId);
      
      // Extract video metadata for enhanced context
      videoMetadata = {
        title: info.basic_info.title || 'Unknown Title',
        description: info.basic_info.short_description || '',
        duration: info.basic_info.duration || 0,
        viewCount: info.basic_info.view_count?.toString() || '0',
        publishDate: info.primary_info?.published?.toString() || '',
        author: info.basic_info.author || 'Unknown',
        category: info.basic_info.category || '',
      };
      
      console.log('Video metadata extracted:', {
        title: videoMetadata.title,
        duration: videoMetadata.duration,
        author: videoMetadata.author,
      });
      
      const transcriptData = await info.getTranscript();
      
      if (!transcriptData || !transcriptData.transcript) {
        throw new Error('NO_TRANSCRIPT');
      }
      
      const segments = transcriptData.transcript.content?.body?.initial_segments;
      
      if (!segments || segments.length === 0) {
        throw new Error('NO_TRANSCRIPT');
      }
      
      // Build transcript with timestamps for better context
      const transcriptWithTimestamps = segments
        .map((segment: any) => {
          const text = segment.snippet?.text?.toString() || '';
          const startMs = segment.start_ms || 0;
          const startTime = Math.floor(startMs / 1000);
          const minutes = Math.floor(startTime / 60);
          const seconds = startTime % 60;
          const timestamp = `[${minutes}:${seconds.toString().padStart(2, '0')}]`;
          return text.length > 0 ? `${timestamp} ${text}` : '';
        })
        .filter((text: string) => text.length > 0)
        .join(' ')
        .trim();
      
      transcriptText = transcriptWithTimestamps;
      
      if (!transcriptText || transcriptText.length === 0) {
        throw new Error('Transcript text is empty');
      }
      
      console.log('Transcript fetched successfully, length:', transcriptText.length);
      
      // Increased context window for better quality
      // GPT-4o-mini: 128k context window (~32k words)
      // Using 60k chars (~15k tokens) for comprehensive analysis
      const maxChars = 60000;
      if (transcriptText.length > maxChars) {
        transcriptText = transcriptText.substring(0, maxChars) + '... [transcript truncated due to length]';
        console.log('Transcript truncated to:', transcriptText.length, 'characters');
      }
    } catch (error) {
      console.error('Transcript error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Provide helpful, specific error messages
      if (errorMessage === 'NO_TRANSCRIPT') {
        return NextResponse.json(
          { 
            error: 'This video does not have captions or transcripts available.',
            details: 'Transcripts are required to generate summaries. Please try a video that has:',
            suggestions: [
              'Auto-generated captions enabled by the creator',
              'Manual captions/subtitles uploaded',
              'Community-contributed subtitles (if available)',
            ],
            videoInfo: videoMetadata ? {
              title: videoMetadata.title,
              author: videoMetadata.author,
            } : null,
          },
          { status: 400 }
        );
      }
      
      // Handle other transcript-related errors
      return NextResponse.json(
        { 
          error: `Unable to fetch video transcript: ${errorMessage}`,
          details: 'This could be due to:',
          suggestions: [
            'The video is age-restricted or private',
            'The video has disabled captions',
            'Geographic restrictions on the content',
            'The video was recently uploaded and captions are still processing',
          ],
        },
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

    // Build enhanced prompt for OpenAI with video context
    const systemPrompt = `You are an expert content analyst and technical writer specializing in creating comprehensive, well-structured summaries from video transcripts. Your summaries are known for their clarity, accuracy, and actionable insights. You pay attention to the video's context, purpose, and key messages to deliver maximum value to readers.`;

    // Format duration for better context
    const durationMinutes = Math.floor(videoMetadata.duration / 60);
    const durationSeconds = videoMetadata.duration % 60;
    const formattedDuration = `${durationMinutes}:${durationSeconds.toString().padStart(2, '0')}`;

    const userPrompt = `Analyze this YouTube video and create a comprehensive, accurate summary.

VIDEO INFORMATION:
- Title: ${videoMetadata.title}
- Author/Channel: ${videoMetadata.author}
- Duration: ${formattedDuration}
- Category: ${videoMetadata.category || 'General'}
${videoMetadata.description ? `- Description: ${videoMetadata.description.substring(0, 500)}${videoMetadata.description.length > 500 ? '...' : ''}` : ''}

SUMMARY REQUIREMENTS:
- Target length: ${wordCount} words (±10% is acceptable for completeness)
- Write ONLY in short, clear sentences (12-18 words maximum per sentence)
- Each sentence should be roughly the same length for better readability
- Use periods frequently to break up complex thoughts into digestible chunks
- Never write run-on sentences or overly complex structures
- Separate the summary into 3-5 distinct, well-organized paragraphs using double line breaks
- Each paragraph should focus on one main idea, theme, or topic from the video
- Maintain the logical flow and structure of the original content
- Preserve important details, examples, and explanations that add value
- If the video includes timestamps or sections, respect that structure
${includeNotes ? '- Include 5-10 key bullet points (each 8-15 words) capturing the most important takeaways' : ''}
${includeNotes ? '- Include 2-5 actionable items (each 8-12 words) that viewers can implement' : ''}

CONTENT ANALYSIS GUIDELINES:
1. Identify the main purpose and thesis of the video
2. Extract key concepts, explanations, and examples
3. Preserve technical terms, proper nouns, and specific recommendations
4. Maintain the author's intended message and tone
5. Focus on substance over filler content
6. If steps or processes are explained, maintain their sequential order
7. Highlight unique insights or lesser-known information

WRITING STYLE (Short, Punchy Sentences):
GOOD EXAMPLE:
"The video explains manual Google AdSense implementation. James recommends avoiding automatic ad placement features. This prevents unwanted layout disruptions on websites. Users gain better control over ad positioning.

Three main ad types are covered in detail. Display ads work well for most websites. Text ads blend naturally with written content. Link ads provide supplementary monetization options.

Strategic ad placement improves overall user experience. Proper positioning can increase click-through rates significantly. Testing different layouts helps optimize ad performance. Regular monitoring ensures sustained revenue growth."

BAD EXAMPLE (Avoid this):
"In this comprehensive video tutorial, James from Seeker Host provides viewers with a detailed, step-by-step guide on how to effectively add Google AdSense ads to your website using the manual placement method, while also explaining why you should avoid the automatic ad placement feature that can sometimes disrupt the layout and user experience of your site."

TRANSCRIPT WITH TIMESTAMPS:
${transcriptText}

OUTPUT FORMAT (Valid JSON):
{
  "title": "Concise, descriptive title capturing the video's main topic (max 10 words)",
  "summary": "Paragraph 1 with short sentences here.\\n\\nParagraph 2 with short sentences here.\\n\\nParagraph 3 with short sentences here.",
  "bulletPoints": ["Specific key point 1", "Specific key point 2", ...],
  "actionItems": ["Concrete action step 1", "Concrete action step 2", ...]
}

CRITICAL: 
- Use \\n\\n (double newline) to separate paragraphs in the summary field
- Ensure all JSON is valid and properly escaped
- Focus on accuracy and completeness over strict word count
- Make the summary valuable and actionable for readers
${!includeNotes ? '- Provide empty arrays for bulletPoints and actionItems since notes are not requested' : ''}`;


    // Call OpenAI API with GPT-4o-mini for optimal cost/performance/quality balance
    // Cost: $0.150/1M input tokens, $0.600/1M output tokens
    // Context: 128k tokens, excellent quality and reasoning
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.5, // Lower temperature for more focused, accurate summaries
      max_tokens: 2000, // Explicit token limit for controlled output length
      response_format: { type: 'json_object' },
      presence_penalty: 0.1, // Slight penalty to reduce repetition
      frequency_penalty: 0.1, // Slight penalty for varied vocabulary
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

    // Generate diagram if requested
    let mermaidCode: string | undefined;
    if (generateDiagram) {
      try {
        const openai = getOpenAIClient();
        const diagramPrompt = `Based on the following content, create a Mermaid flowchart diagram that visualizes the main process, concepts, or workflow.

Content:
Summary: ${formattedResult.summary}
Key Points: ${formattedResult.bulletPoints?.join(', ')}
Action Items: ${formattedResult.actionItems?.join(', ')}

Generate ONLY the Mermaid code for a flowchart. Use proper Mermaid flowchart syntax (graph TD/LR). Include the main concepts as nodes and show relationships with arrows. Keep it clear and logical.`;

        const diagramCompletion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an expert at creating visual diagrams using Mermaid syntax. Generate clean, well-structured Mermaid diagram code. Return ONLY the Mermaid code without any markdown code blocks or explanations.',
            },
            {
              role: 'user',
              content: diagramPrompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 1000,
        });

        mermaidCode = diagramCompletion.choices[0]?.message?.content || '';
        // Clean up the response - remove markdown code blocks if present
        mermaidCode = mermaidCode.replace(/```mermaid\n?/g, '').replace(/```\n?/g, '').trim();
      } catch (diagramError) {
        console.error('Failed to generate diagram:', diagramError);
        // Continue without diagram if generation fails
      }
    }

    // Save summary to database
    try {
      await prisma.summary.create({
        data: {
          userId: userId,
          videoId: videoId,
          videoUrl: youtubeUrl,
          videoTitle: videoMetadata.title,
          thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          summary: formattedResult.summary,
          bulletPoints: formattedResult.bulletPoints,
          actionItems: formattedResult.actionItems || [],
          wordCount: wordCount || 300,
          mermaidCode: mermaidCode,
        },
      });
      console.log('Summary saved to database for user:', userId);
    } catch (dbError) {
      console.error('Failed to save summary to database:', dbError);
      // Continue even if saving fails - return the summary to the user
    }

    return NextResponse.json({
      ...formattedResult,
      mermaidCode,
    });

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
