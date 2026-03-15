import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/events - Get all events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')

    const events = await db.event.findMany({
      take: limit,
      orderBy: { eventDate: 'asc' },
      include: {
        creator: {
          include: { profile: true },
        },
      },
    })

    return NextResponse.json({ success: true, events })
  } catch (error) {
    console.error('Fetch events error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch events' }, { status: 500 })
  }
}

// POST /api/events - Create a new event
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { title, description, location, eventDate, eventTime, isPublic, capacity } = data

    // Get first user for demo
    const user = await db.user.findFirst()
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 401 })
    }

    const event = await db.event.create({
      data: {
        creatorId: user.id,
        title,
        description,
        location,
        eventDate: new Date(eventDate),
        eventTime,
        isPublic: isPublic ?? true,
        capacity: capacity ? parseInt(capacity) : null,
        attendeesCount: 1,
      },
      include: {
        creator: {
          include: { profile: true },
        },
      },
    })

    return NextResponse.json({ success: true, event })
  } catch (error) {
    console.error('Create event error:', error)
    return NextResponse.json({ success: false, error: 'Failed to create event' }, { status: 500 })
  }
}
