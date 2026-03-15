import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/marketplace - Get all listings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category')

    const where = {
      status: 'ACTIVE' as const,
      ...(category && { category: category as never }),
    }

    const listings = await db.marketplaceListing.findMany({
      take: limit,
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        seller: {
          include: { profile: true },
        },
      },
    })

    return NextResponse.json({ success: true, listings })
  } catch (error) {
    console.error('Fetch listings error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch listings' }, { status: 500 })
  }
}

// POST /api/marketplace - Create a new listing
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { title, description, price, category, condition, location, contactInfo } = data

    // Get first user for demo
    const user = await db.user.findFirst()
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 401 })
    }

    const listing = await db.marketplaceListing.create({
      data: {
        sellerId: user.id,
        title,
        description,
        price: parseFloat(price),
        category: category || 'OTHER',
        condition,
        location,
        contactInfo,
        status: 'ACTIVE',
      },
      include: {
        seller: {
          include: { profile: true },
        },
      },
    })

    return NextResponse.json({ success: true, listing })
  } catch (error) {
    console.error('Create listing error:', error)
    return NextResponse.json({ success: false, error: 'Failed to create listing' }, { status: 500 })
  }
}
