import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/reports - Get all reports for admin
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')

    const reports = await db.report.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        reporter: { include: { profile: true } },
        reportedUser: { include: { profile: true } },
        post: true,
      },
    })

    return NextResponse.json({ success: true, reports })
  } catch (error) {
    console.error('Fetch reports error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch reports' }, { status: 500 })
  }
}
