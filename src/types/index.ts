// BazeConnect Types

export type UserRole = 'STUDENT' | 'LECTURER' | 'CLUB_ADMIN' | 'SYSTEM_ADMIN'

export type PostType = 'TEXT' | 'IMAGE' | 'LINK' | 'DOCUMENT' | 'ANNOUNCEMENT'

export type GroupVisibility = 'PUBLIC' | 'PRIVATE' | 'SECRET'

export type GroupMemberRole = 'MEMBER' | 'ADMIN' | 'MODERATOR'

export type RsvpStatus = 'GOING' | 'INTERESTED' | 'NOT_GOING'

export type ListingStatus = 'ACTIVE' | 'SOLD' | 'EXPIRED'

export type ListingCategory = 'BOOKS' | 'ELECTRONICS' | 'FURNITURE' | 'CLOTHING' | 'SERVICES' | 'OTHER'

export type NotificationType = 
  | 'LIKE_POST' 
  | 'LIKE_COMMENT' 
  | 'COMMENT' 
  | 'FOLLOW' 
  | 'MESSAGE' 
  | 'GROUP_INVITE' 
  | 'EVENT_REMINDER' 
  | 'POST_MENTION' 
  | 'SYSTEM'

export type ReportStatus = 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED'

export type ReportReason = 'SPAM' | 'HARASSMENT' | 'INAPPROPRIATE' | 'MISINFORMATION' | 'OTHER'

// User types
export interface User {
  id: string
  email: string
  role: UserRole
  emailVerified: boolean
  createdAt: string
  lastActive: string
  profile?: Profile | null
}

export interface Profile {
  id: string
  userId: string
  fullName: string
  profilePic: string | null
  coverPhoto: string | null
  department: string | null
  faculty: string | null
  level: number | null
  bio: string | null
  interests: string | null
  phone: string | null
  website: string | null
}

// Post types
export interface Post {
  id: string
  authorId: string
  author: User & { profile: Profile | null }
  groupId: string | null
  group?: Group
  content: string
  postType: PostType
  mediaUrl: string | null
  documentUrl: string | null
  linkUrl: string | null
  linkTitle: string | null
  linkDescription: string | null
  likesCount: number
  commentsCount: number
  isPinned: boolean
  createdAt: string
  updatedAt: string
  isLiked?: boolean
}

export interface Comment {
  id: string
  postId: string
  authorId: string
  author: User & { profile: Profile | null }
  parentId: string | null
  content: string
  likesCount: number
  createdAt: string
  replies?: Comment[]
  isLiked?: boolean
}

export interface Like {
  id: string
  userId: string
  postId: string | null
  commentId: string | null
  createdAt: string
}

// Follow types
export interface Follow {
  id: string
  followerId: string
  followingId: string
  follower?: User & { profile: Profile | null }
  following?: User & { profile: Profile | null }
  createdAt: string
}

// Message types
export interface Message {
  id: string
  senderId: string
  sender: User & { profile: Profile | null }
  receiverId: string
  receiver: User & { profile: Profile | null }
  content: string
  mediaUrl: string | null
  isRead: boolean
  readAt: string | null
  createdAt: string
}

export interface Conversation {
  user: User & { profile: Profile | null }
  lastMessage: Message
  unreadCount: number
}

// Group types
export interface Group {
  id: string
  creatorId: string
  creator?: User & { profile: Profile | null }
  name: string
  description: string | null
  coverPhoto: string | null
  visibility: GroupVisibility
  membersCount: number
  createdAt: string
  isMember?: boolean
  memberRole?: GroupMemberRole
}

export interface GroupMember {
  id: string
  groupId: string
  userId: string
  user: User & { profile: Profile | null }
  role: GroupMemberRole
  joinedAt: string
}

// Event types
export interface Event {
  id: string
  creatorId: string
  creator: User & { profile: Profile | null }
  groupId: string | null
  title: string
  description: string | null
  posterUrl: string | null
  location: string
  eventDate: string
  eventTime: string | null
  endDate: string | null
  isPublic: boolean
  capacity: number | null
  attendeesCount: number
  createdAt: string
  rsvpStatus?: RsvpStatus
}

export interface EventRsvp {
  id: string
  eventId: string
  userId: string
  user: User & { profile: Profile | null }
  status: RsvpStatus
  createdAt: string
}

// Marketplace types
export interface MarketplaceListing {
  id: string
  sellerId: string
  seller: User & { profile: Profile | null }
  title: string
  description: string | null
  price: number
  category: ListingCategory
  images: string | null
  condition: string | null
  location: string | null
  contactInfo: string | null
  status: ListingStatus
  viewsCount: number
  createdAt: string
}

// Notification types
export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  data: string | null
  isRead: boolean
  readAt: string | null
  createdAt: string
}

// Report types
export interface Report {
  id: string
  reporterId: string
  reporter: User & { profile: Profile | null }
  reportedUserId: string | null
  reportedUser?: User & { profile: Profile | null }
  postId: string | null
  post?: Post
  reason: ReportReason
  description: string | null
  status: ReportStatus
  reviewedBy: string | null
  reviewNotes: string | null
  createdAt: string
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Stats types for admin dashboard
export interface AdminStats {
  totalUsers: number
  totalStudents: number
  totalLecturers: number
  totalPosts: number
  totalGroups: number
  totalEvents: number
  totalListings: number
  pendingReports: number
  newUsersToday: number
  newPostsToday: number
}
