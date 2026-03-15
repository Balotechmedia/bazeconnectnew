import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/groups - Get all groups
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')

    const groups = await db.group.findMany({
      take: limit,
      orderBy: { membersCount: 'desc' },
      include: {
        creator: {
          include: { profile: true },
        },
      },
    })

    return NextResponse.json({ success: true, groups })
  } catch (error) {
    console.error('Fetch groups error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch groups' }, { status: 500 })
  }
}

// POST /api/groups - Create a new group
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { name, description, visibility } = data

    // Get first user for demo
    const user = await db.user.findFirst()
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 401 })
    }

    const group = await db.group.create({
      data: {
        creatorId: user.id,
        name,
        description,
        visibility: visibility || 'PUBLIC',
        membersCount: 1,
      },
      include: {
        creator: {
          include: { profile: true },
        },
      },
    })

    // Add creator as admin member
    await db.groupMember.create({
      data: {
        groupId: group.id,
        userId: user.id,
        role: 'ADMIN',
      },
    })

    return NextResponse.json({ success: true, group })
  } catch (error) {
    console.error('Create group error:', error)
    return NextResponse.json({ success: false, error: 'Failed to create group' }, { status: 500 })
  }
}
