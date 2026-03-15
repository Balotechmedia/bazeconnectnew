import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PUT /api/profile - Update current user's profile
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()

    // Get first user for demo
    const user = await db.user.findFirst()
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 401 })
    }

    // Update or create profile
    const profile = await db.profile.upsert({
      where: { userId: user.id },
      update: {
        fullName: data.fullName,
        bio: data.bio,
        department: data.department,
        faculty: data.faculty,
        level: data.level,
        interests: data.interests,
        phone: data.phone,
        website: data.website,
        profilePic: data.profilePic,
        coverPhoto: data.coverPhoto,
      },
      create: {
        userId: user.id,
        fullName: data.fullName || user.email.split('@')[0],
        bio: data.bio,
        department: data.department,
        faculty: data.faculty,
        level: data.level,
        interests: data.interests,
        phone: data.phone,
        website: data.website,
        profilePic: data.profilePic,
        coverPhoto: data.coverPhoto,
      },
    })

    return NextResponse.json({ success: true, profile })
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json({ success: false, error: 'Failed to update profile' }, { status: 500 })
  }
}
