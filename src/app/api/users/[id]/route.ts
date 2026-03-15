import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/users/[id] - Get user profile
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const user = await db.user.findUnique({
      where: { id },
      include: { profile: true },
    })

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    // Get follower counts
    const followersCount = await db.follow.count({
      where: { followingId: id },
    })

    const followingCount = await db.follow.count({
      where: { followerId: id },
    })

    return NextResponse.json({
      success: true,
      user,
      followersCount,
      followingCount,
      isFollowing: false,
    })
  } catch (error) {
    console.error('Fetch user error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch user' }, { status: 500 })
  }
}
