import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

// POST /api/auth/register
export async function POST(request: NextRequest) {
  try {
    const { email, password, role, profile } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password required' }, { status: 400 })
    }

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 400 })
    }

    // Create user
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role || 'STUDENT',
        emailVerified: true,
        profile: {
          create: {
            fullName: profile?.fullName || email.split('@')[0],
            department: profile?.department || null,
            faculty: profile?.faculty || null,
            level: profile?.level || null,
            bio: null,
            interests: null,
            phone: null,
            website: null,
          },
        },
      },
      include: { profile: true },
    })

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ success: false, error: 'Registration failed' }, { status: 500 })
  }
}
