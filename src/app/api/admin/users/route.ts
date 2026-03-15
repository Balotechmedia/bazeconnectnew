import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/users - Get all users for admin
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')

    const users = await db.user.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { profile: true },
    })

    return NextResponse.json({ success: true, users })
  } catch (error) {
    console.error('Fetch users error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch users' }, { status: 500 })
  }
}
