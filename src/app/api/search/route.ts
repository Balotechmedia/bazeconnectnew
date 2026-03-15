import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/search - Search users, groups, events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''

    if (!q.trim()) {
      return NextResponse.json({
        success: true,
        results: { users: [], groups: [], events: [], posts: [] },
      })
    }

    const [users, groups, events] = await Promise.all([
      // Search users
      db.user.findMany({
        where: {
          OR: [
            { email: { contains: q } },
            { profile: { fullName: { contains: q } } },
            { profile: { department: { contains: q } } },
          ],
        },
        take: 10,
        include: { profile: true },
      }),
      // Search groups
      db.group.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { description: { contains: q } },
          ],
        },
        take: 10,
      }),
      // Search events
      db.event.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { description: { contains: q } },
            { location: { contains: q } },
          ],
        },
        take: 10,
        include: {
          creator: { include: { profile: true } },
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      results: { users, groups, events, posts: [] },
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ success: false, error: 'Search failed' }, { status: 500 })
  }
}
