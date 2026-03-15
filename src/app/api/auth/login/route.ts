import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

// GET /api/auth/login - Get current user (me)
export async function GET(request: NextRequest) {
  try {
    // For demo, return the most recent user
    const user = await db.user.findFirst({
      orderBy: { createdAt: 'desc' },
      include: { profile: true },
    })

    if (!user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json({ success: true, user: userWithoutPassword })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ success: false, error: 'Authentication failed' }, { status: 401 })
  }
}

// POST /api/auth/login
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password required' }, { status: 400 })
    }

    const user = await db.user.findUnique({
      where: { email },
      include: { profile: true },
    })

    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 })
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 })
    }

    // Update last active
    await db.user.update({
      where: { id: user.id },
      data: { lastActive: new Date() },
    })

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json({ success: true, user: userWithoutPassword })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ success: false, error: 'Login failed' }, { status: 500 })
  }
}
