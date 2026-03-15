import { NextResponse } from 'next/server'

// POST /api/auth/logout
export async function POST() {
  // In a real app, clear session/token here
  return NextResponse.json({ success: true, message: 'Logged out successfully' })
}
