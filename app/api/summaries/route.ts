import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to view your summaries.' },
        { status: 401 }
      );
    }

    const userId = session.user.id!;

    // Get query parameters for pagination
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Fetch user's summaries from database, ordered by most recent
    const summaries = await prisma.summary.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
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

    // Get total count for pagination
    const totalCount = await prisma.summary.count({
      where: {
        userId: userId,
      },
    });

    return NextResponse.json({
      summaries,
      totalCount,
      hasMore: offset + limit < totalCount,
    });

  } catch (error) {
    console.error('Error fetching summaries:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch summaries' },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove a specific summary
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id!;
    const { searchParams } = new URL(request.url);
    const summaryId = searchParams.get('id');

    if (!summaryId) {
      return NextResponse.json(
        { error: 'Summary ID is required' },
        { status: 400 }
      );
    }

    // Verify the summary belongs to the user before deleting
    const summary = await prisma.summary.findFirst({
      where: {
        id: summaryId,
        userId: userId,
      },
    });

    if (!summary) {
      return NextResponse.json(
        { error: 'Summary not found or you do not have permission to delete it' },
        { status: 404 }
      );
    }

    // Delete the summary
    await prisma.summary.delete({
      where: {
        id: summaryId,
      },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting summary:', error);
    
    return NextResponse.json(
      { error: 'Failed to delete summary' },
      { status: 500 }
    );
  }
}
