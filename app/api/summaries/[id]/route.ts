import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to view this summary.' },
        { status: 401 }
      );
    }

    const userId = session.user.id!;
    const summaryId = params.id;

    // Fetch the summary and verify it belongs to the user
    const summary = await prisma.summary.findFirst({
      where: {
        id: summaryId,
        userId: userId,
      },
      select: {
        id: true,
        videoId: true,
        videoUrl: true,
        videoTitle: true,
        thumbnail: true,
        summary: true,
        bulletPoints: true,
        actionItems: true,
        wordCount: true,
        createdAt: true,
      },
    });

    if (!summary) {
      return NextResponse.json(
        { error: 'Summary not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(summary);

  } catch (error) {
    console.error('Error fetching summary:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch summary' },
      { status: 500 }
    );
  }
}
