import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/posts - Get all posts for feed
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const posts = await db.post.findMany({
      take: limit,
      skip: offset,
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' },
      ],
      include: {
        author: {
          include: { profile: true },
        },
        group: true,
        likes: true,
        comments: {
          take: 3,
          orderBy: { createdAt: 'desc' },
          include: {
            author: { include: { profile: true } },
          },
        },
        _count: {
          select: { likes: true, comments: true },
        },
      },
    })

    const postsWithLikes = posts.map(post => ({
      ...post,
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      isLiked: false, // TODO: Check if current user liked
    }))

    return NextResponse.json({ success: true, posts: postsWithLikes })
  } catch (error) {
    console.error('Fetch posts error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch posts' }, { status: 500 })
  }
}

// POST /api/posts - Create a new post
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { content, postType, mediaUrl, documentUrl, linkUrl, linkTitle, linkDescription, groupId } = data

    // Get first user for demo
    const user = await db.user.findFirst()
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 401 })
    }

    const post = await db.post.create({
      data: {
        authorId: user.id,
        content,
        postType: postType || 'TEXT',
        mediaUrl,
        documentUrl,
        linkUrl,
        linkTitle,
        linkDescription,
        groupId,
      },
      include: {
        author: {
          include: { profile: true },
        },
        group: true,
      },
    })

    return NextResponse.json({ success: true, post })
  } catch (error) {
    console.error('Create post error:', error)
    return NextResponse.json({ success: false, error: 'Failed to create post' }, { status: 500 })
  }
}
