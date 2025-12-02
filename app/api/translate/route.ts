import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { auth } from '@/lib/auth';

function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

const SUPPORTED_LANGUAGES = {
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  ru: 'Russian',
  ja: 'Japanese',
  ko: 'Korean',
  zh: 'Chinese (Simplified)',
  ar: 'Arabic',
  hi: 'Hindi',
  bn: 'Bengali',
  ur: 'Urdu',
  tr: 'Turkish',
  vi: 'Vietnamese',
  th: 'Thai',
  nl: 'Dutch',
  pl: 'Polish',
  sv: 'Swedish',
  no: 'Norwegian',
  da: 'Danish',
  fi: 'Finnish',
};

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

    const body = await request.json();
    const { text, targetLanguage, type } = body;

    // Validate input
    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: 'Text and target language are required' },
        { status: 400 }
      );
    }

    if (!SUPPORTED_LANGUAGES[targetLanguage as keyof typeof SUPPORTED_LANGUAGES]) {
      return NextResponse.json(
        { error: 'Unsupported language' },
        { status: 400 }
      );
    }

    const languageName = SUPPORTED_LANGUAGES[targetLanguage as keyof typeof SUPPORTED_LANGUAGES];

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    // Build prompt based on content type
    let systemPrompt = `You are a professional translator. Translate the following text to ${languageName} while maintaining the original meaning, tone, and formatting.`;
    
    let userPrompt = '';
    
    if (type === 'summary') {
      userPrompt = `Translate this video summary to ${languageName}. Maintain paragraph breaks (\\n\\n) and keep the same structure:\n\n${text}`;
    } else if (type === 'bulletPoints') {
      userPrompt = `Translate these key points to ${languageName}. Return as a JSON array of strings:\n\n${JSON.stringify(text)}`;
    } else if (type === 'actionItems') {
      userPrompt = `Translate these action items to ${languageName}. Return as a JSON array of strings:\n\n${JSON.stringify(text)}`;
    } else {
      userPrompt = `Translate the following text to ${languageName}:\n\n${text}`;
    }

    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 2000,
      response_format: type === 'bulletPoints' || type === 'actionItems' 
        ? { type: 'json_object' } 
        : undefined,
    });

    const translatedText = completion.choices[0]?.message?.content;
    
    if (!translatedText) {
      throw new Error('No response from translation service');
    }

    // Parse JSON response for arrays
    if (type === 'bulletPoints' || type === 'actionItems') {
      try {
        const parsed = JSON.parse(translatedText);
        // The response might be wrapped in an object, extract the array
        const translatedArray = Array.isArray(parsed) ? parsed : (parsed.items || parsed.translations || Object.values(parsed)[0]);
        return NextResponse.json({ translatedText: translatedArray });
      } catch (e) {
        // If parsing fails, return as-is
        return NextResponse.json({ translatedText });
      }
    }

    return NextResponse.json({ translatedText });

  } catch (error) {
    console.error('Error in translate API:', error);
    
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
