import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/messages - Get conversations
export async function GET(request: NextRequest) {
  try {
    // Get first user for demo
    const user = await db.user.findFirst()
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 401 })
    }

    // Get unique conversations
    const sentMessages = await db.message.findMany({
      where: { senderId: user.id },
      include: {
        receiver: { include: { profile: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    const receivedMessages = await db.message.findMany({
      where: { receiverId: user.id },
      include: {
        sender: { include: { profile: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Build conversations map
    const conversationsMap = new Map()
    
    for (const msg of sentMessages) {
      const otherUser = msg.receiver
      if (!otherUser) continue
      const existing = conversationsMap.get(otherUser.id)
      
      if (!existing || new Date(msg.createdAt) > new Date(existing.lastMessage.createdAt)) {
        conversationsMap.set(otherUser.id, {
          user: otherUser,
          lastMessage: msg,
          unreadCount: 0,
        })
      }
    }
    
    for (const msg of receivedMessages) {
      const otherUser = msg.sender
      if (!otherUser) continue
      const existing = conversationsMap.get(otherUser.id)
      
      if (!existing || new Date(msg.createdAt) > new Date(existing.lastMessage.createdAt)) {
        conversationsMap.set(otherUser.id, {
          user: otherUser,
          lastMessage: msg,
          unreadCount: !msg.isRead ? 1 : 0,
        })
      } else if (!msg.isRead) {
        existing.unreadCount++
      }
    }

    const conversations = Array.from(conversationsMap.values())

    return NextResponse.json({ success: true, conversations })
  } catch (error) {
    console.error('Fetch messages error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch messages' }, { status: 500 })
  }
}

// POST /api/messages - Send a message
export async function POST(request: NextRequest) {
  try {
    const { receiverId, content, mediaUrl } = await request.json()

    // Get first user for demo
    const user = await db.user.findFirst()
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 401 })
    }

    const message = await db.message.create({
      data: {
        senderId: user.id,
        receiverId,
        content,
        mediaUrl,
      },
      include: {
        sender: { include: { profile: true } },
        receiver: { include: { profile: true } },
      },
    })

    return NextResponse.json({ success: true, message })
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json({ success: false, error: 'Failed to send message' }, { status: 500 })
  }
}
