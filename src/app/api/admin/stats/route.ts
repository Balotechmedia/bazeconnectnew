import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/stats - Get admin statistics
export async function GET() {
  try {
    const [
      totalUsers,
      totalStudents,
      totalLecturers,
      totalPosts,
      totalGroups,
      totalEvents,
      totalListings,
      pendingReports,
      newUsersToday,
      newPostsToday,
    ] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { role: 'STUDENT' } }),
      db.user.count({ where: { role: 'LECTURER' } }),
      db.post.count(),
      db.group.count(),
      db.event.count(),
      db.marketplaceListing.count(),
      db.report.count({ where: { status: 'PENDING' } }),
      db.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      db.post.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalStudents,
        totalLecturers,
        totalPosts,
        totalGroups,
        totalEvents,
        totalListings,
        pendingReports,
        newUsersToday,
        newPostsToday,
      },
    })
  } catch (error) {
    console.error('Fetch stats error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch statistics' }, { status: 500 })
  }
}
