'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast, Toaster } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Home, Users, Video, ShoppingBag, Bell, Menu as MenuIcon, Search, MessageCircle,
  ThumbsUp, Share2, MoreHorizontal, Image as ImageIcon, Video as VideoIcon,
  Clock, ChevronRight, User, Settings, Calendar, Bookmark, LogOut,
  Mail, Lock, Loader2, Heart, Send, Play, Plus, Sparkles, UserPlus,
  ArrowLeft, Edit2, Save, X as XIcon, Camera, MapPin, Phone, Globe
} from 'lucide-react'

// Types
interface UserProfile {
  id: string
  fullName: string
  profilePic?: string | null
  coverPhoto?: string | null
  department?: string | null
  faculty?: string | null
  level?: number | null
  bio?: string | null
  interests?: string | null
  phone?: string | null
  website?: string | null
}

interface UserType {
  id: string
  email: string
  role: 'STUDENT' | 'LECTURER' | 'CLUB_ADMIN' | 'SYSTEM_ADMIN'
  profile: UserProfile | null
}

interface Post {
  id: string
  authorId: string
  author: UserType
  content: string
  postType: 'TEXT' | 'ANNOUNCEMENT'
  mediaUrl: string | null
  likesCount: number
  commentsCount: number
  isPinned: boolean
  createdAt: string
  isSaved?: boolean
}

// Demo data
const demoPosts: Post[] = [
  {
    id: '1',
    authorId: 'd1',
    author: {
      id: 'd1', email: 'john@baze.edu', role: 'STUDENT',
      profile: { id: 'p1', fullName: 'John Adebayo', department: 'Computer Science', faculty: 'Engineering', level: 300 }
    },
    content: "Just finished my final project for Software Engineering! 🎉 Can't believe how much I've learned this semester. Thanks to everyone who helped along the way!",
    postType: 'TEXT', mediaUrl: null, likesCount: 124, commentsCount: 18, isPinned: false,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: '2',
    authorId: 'd2',
    author: {
      id: 'd2', email: 'sarah@baze.edu', role: 'LECTURER',
      profile: { id: 'p2', fullName: 'Dr. Sarah Okonkwo', department: 'Computer Science', faculty: 'Engineering', level: null }
    },
    content: '📢 Important Notice: All CSC 301 assignments are due this Friday by 11:59 PM. Late submissions will not be accepted. Please ensure you follow the submission guidelines.',
    postType: 'ANNOUNCEMENT', mediaUrl: null, likesCount: 256, commentsCount: 32, isPinned: true,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: '3',
    authorId: 'd3',
    author: {
      id: 'd3', email: 'amina@baze.edu', role: 'STUDENT',
      profile: { id: 'p3', fullName: 'Amina Mohammed', department: 'Mass Communication', faculty: 'Arts', level: 200 }
    },
    content: 'Looking for study partners for MCM 202 exam! 📚 Anyone interested? Drop a comment if you want to form a study group.',
    postType: 'TEXT', mediaUrl: null, likesCount: 45, commentsCount: 12, isPinned: false,
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
]

const stories = [
  { id: 's1', name: 'John', hasStory: true },
  { id: 's2', name: 'Amina', hasStory: true },
  { id: 's3', name: 'Dr. Sarah', hasStory: true },
  { id: 's4', name: 'Chinedu', hasStory: true },
  { id: 's5', name: 'Fatima', hasStory: true },
]

const demoGroups = [
  { id: 'g1', name: 'CSC 301 Study Group', members: 245, icon: '📚' },
  { id: 'g2', name: 'Baze Football Fans', members: 1200, icon: '⚽' },
  { id: 'g3', name: 'Tech Enthusiasts', members: 89, icon: '💻' },
  { id: 'g4', name: 'Campus News', members: 3500, icon: '📰' },
]

const demoEvents = [
  { id: 'e1', title: 'Tech Talk 2024', date: 'Tomorrow', time: '2:00 PM', location: 'Main Auditorium', attendees: 150, icon: '🎤' },
  { id: 'e2', title: 'Career Fair', date: 'Mar 20', time: '10:00 AM', location: 'Conference Hall', attendees: 300, icon: '💼' },
  { id: 'e3', title: 'Sports Week', date: 'Mar 25-30', time: 'All Day', location: 'Sports Complex', attendees: 500, icon: '🏃' },
]

function formatTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

// Main App Component
export default function BazeConnect() {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<UserType | null>(null)
  const [activeTab, setActiveTab] = useState('feed')
  const [subPage, setSubPage] = useState<string | null>(null)
  const [chatUser, setChatUser] = useState<{id: string; name: string} | null>(null)

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/login')
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.user) {
            setUser(data.user)
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [])

  const handleLogin = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      if (data.success && data.user) {
        setUser(data.user)
        toast.success('Welcome back!')
        return true
      } else {
        toast.error(data.error || 'Login failed')
        return false
      }
    } catch {
      toast.error('An error occurred. Please try again.')
      return false
    }
  }, [])

  const handleRegister = useCallback(async (
    email: string, 
    password: string, 
    fullName: string, 
    role: 'STUDENT' | 'LECTURER',
    department: string
  ): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password, 
          role,
          profile: { 
            fullName, 
            department: department || null 
          }
        }),
      })
      const data = await response.json()
      if (data.success && data.user) {
        setUser(data.user)
        toast.success('Account created successfully! Welcome to BazeConnect!')
        return true
      } else {
        toast.error(data.error || 'Registration failed')
        return false
      }
    } catch {
      toast.error('An error occurred. Please try again.')
      return false
    }
  }, [])

  const handleLogout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      setActiveTab('feed')
      setSubPage(null)
      toast.success('Logged out successfully')
    } catch {
      toast.error('Failed to logout')
    }
  }, [])

  const handleUpdateProfile = useCallback(async (profileData: Partial<UserProfile>): Promise<boolean> => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      })
      const data = await response.json()
      if (data.success) {
        setUser(prev => prev ? { ...prev, profile: { ...prev.profile, ...profileData } as UserProfile } : null)
        toast.success('Profile updated successfully!')
        return true
      } else {
        toast.error(data.error || 'Failed to update profile')
        return false
      }
    } catch {
      toast.error('An error occurred')
      return false
    }
  }, [])

  // Navigate to sub-page
  const navigateTo = (page: string) => {
    setSubPage(page)
  }

  const goBack = () => {
    setSubPage(null)
    setChatUser(null)
  }

  // Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-white shadow-xl flex items-center justify-center mb-4">
            <span className="text-3xl font-black bg-gradient-to-br from-emerald-600 to-teal-600 bg-clip-text text-transparent">B</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">BazeConnect</h1>
          <p className="text-white/70 text-sm mb-4">Baze University Abuja</p>
          <div className="flex items-center justify-center gap-2 text-white/80">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  // Auth Screen (if not logged in)
  if (!user) {
    return <AuthPage onLogin={handleLogin} onRegister={handleRegister} />
  }

  // Main App
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Toaster position="top-center" richColors />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-lg mx-auto flex items-center justify-between px-4 py-3">
          {subPage ? (
            <>
              <Button variant="ghost" size="icon" onClick={goBack} className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="font-bold text-gray-900 text-base capitalize">{subPage}</h1>
              <div className="w-9" />
            </>
          ) : (
            <>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <div>
                  <h1 className="font-bold text-gray-900 text-base leading-tight">BazeConnect</h1>
                  <p className="text-[10px] text-gray-500 -mt-0.5">Baze University Abuja</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => navigateTo('search')} className="rounded-full h-9 w-9 hover:bg-gray-100">
                  <Search className="w-5 h-5 text-gray-600" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => navigateTo('messages')} className="rounded-full h-9 w-9 relative hover:bg-gray-100">
                  <MessageCircle className="w-5 h-5 text-gray-600" />
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold shadow-sm">3</span>
                </Button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="max-w-lg mx-auto w-full">
          {/* Sub-pages */}
          {subPage === 'profile' && <ProfilePage user={user} onUpdate={handleUpdateProfile} />}
          {subPage === 'settings' && <SettingsPage user={user} onLogout={handleLogout} />}
          {subPage === 'groups' && <GroupsPage />}
          {subPage === 'events' && <EventsPage />}
          {subPage === 'saved' && <SavedPage />}
          {subPage === 'search' && <SearchPage navigateTo={navigateTo} />}
          {subPage === 'messages' && <MessagesPage navigateTo={navigateTo} setChatUser={setChatUser} />}
          {subPage === 'chat' && <ChatPage chatUser={chatUser} />}
          
          {/* Main tabs */}
          {!subPage && (
            <>
              {activeTab === 'feed' && <FeedPage user={user} />}
              {activeTab === 'friends' && <FriendsPage />}
              {activeTab === 'video' && <VideoPage />}
              {activeTab === 'shop' && <MarketplacePage />}
              {activeTab === 'notifications' && <NotificationsPage />}
              {activeTab === 'menu' && <MenuPage user={user} onLogout={handleLogout} navigateTo={navigateTo} />}
            </>
          )}
        </div>
      </main>

      {/* Bottom Navigation - only show on main tabs */}
      {!subPage && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50">
          <div className="max-w-lg mx-auto flex items-center justify-around py-1.5 px-2">
            {[
              { id: 'feed', icon: Home, label: 'Home' },
              { id: 'friends', icon: Users, label: 'Friends' },
              { id: 'video', icon: Video, label: 'Video' },
              { id: 'shop', icon: ShoppingBag, label: 'Shop' },
              { id: 'notifications', icon: Bell, label: 'Alerts' },
              { id: 'menu', icon: MenuIcon, label: 'Menu' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center py-2 px-3 min-w-[52px] rounded-xl transition-all ${
                  activeTab === tab.id 
                    ? 'text-emerald-600' 
                    : 'text-gray-400 hover:text-gray-500'
                }`}
              >
                <tab.icon className={`w-6 h-6 ${activeTab === tab.id ? 'stroke-[2.5]' : ''}`} />
                <span className="text-[10px] mt-0.5 font-medium">{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="w-1 h-1 rounded-full bg-emerald-500 mt-0.5" />
                )}
              </button>
            ))}
          </div>
        </nav>
      )}
    </div>
  )
}

// Auth Page Component
function AuthPage({ 
  onLogin, 
  onRegister 
}: { 
  onLogin: (email: string, password: string) => Promise<boolean>
  onRegister: (email: string, password: string, fullName: string, role: 'STUDENT' | 'LECTURER', department: string) => Promise<boolean>
}) {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '', 
    password: '', 
    confirmPassword: '', 
    fullName: '', 
    department: '',
    role: 'STUDENT' as 'STUDENT' | 'LECTURER'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      if (isLogin) {
        await onLogin(formData.email, formData.password)
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match')
          setIsLoading(false)
          return
        }
        if (!formData.fullName.trim()) {
          toast.error('Please enter your full name')
          setIsLoading(false)
          return
        }
        await onRegister(formData.email, formData.password, formData.fullName, formData.role, formData.department)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700">
      <Toaster position="top-center" richColors />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-20 h-20 rounded-2xl bg-white shadow-xl flex items-center justify-center mb-4">
          <span className="text-3xl font-black bg-gradient-to-br from-emerald-600 to-teal-600 bg-clip-text text-transparent">B</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">BazeConnect</h1>
        <p className="text-white/70 text-sm">Baze University, Abuja</p>
      </div>

      <div className="bg-white rounded-t-3xl p-6 pb-8 shadow-xl">
        <div className="flex mb-5 bg-gray-100 rounded-xl p-1">
          <button 
            onClick={() => setIsLogin(true)} 
            className={`flex-1 py-2.5 text-center font-semibold rounded-lg transition-all text-sm flex items-center justify-center gap-2 ${
              isLogin ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            <Mail className="w-4 h-4" />
            Log In
          </button>
          <button 
            onClick={() => setIsLogin(false)} 
            className={`flex-1 py-2.5 text-center font-semibold rounded-lg transition-all text-sm flex items-center justify-center gap-2 ${
              !isLogin ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input 
              type="email" 
              required 
              value={formData.email} 
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
              className="pl-10 h-11 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-emerald-500" 
              placeholder="Email address" 
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input 
              type="password" 
              required 
              value={formData.password} 
              onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
              className="pl-10 h-11 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-emerald-500" 
              placeholder="Password" 
            />
          </div>

          {!isLogin && (
            <div className="space-y-3 pt-1">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input 
                  type="password" 
                  required 
                  value={formData.confirmPassword} 
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} 
                  className="pl-10 h-11 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-emerald-500" 
                  placeholder="Confirm password" 
                />
              </div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input 
                  type="text" 
                  required 
                  value={formData.fullName} 
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} 
                  className="pl-10 h-11 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-emerald-500" 
                  placeholder="Full name" 
                />
              </div>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input 
                  type="text" 
                  value={formData.department} 
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })} 
                  className="pl-10 h-11 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-emerald-500" 
                  placeholder="Department (e.g., Computer Science)" 
                />
              </div>
              <select 
                value={formData.role} 
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'STUDENT' | 'LECTURER' })} 
                className="w-full h-11 px-4 bg-gray-50 rounded-xl border-0 text-gray-900 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="STUDENT">👨‍🎓 Student</option>
                <option value="LECTURER">👨‍🏫 Lecturer</option>
              </select>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={isLoading} 
            className="w-full h-11 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg mt-2"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isLogin ? (
              'Log In'
            ) : (
              'Create Account'
            )}
          </Button>
        </form>
        
        <p className="text-center text-gray-400 text-xs mt-5">
          {isLogin ? (
            <>
              Don&apos;t have an account?{' '}
              <button onClick={() => setIsLogin(false)} className="text-emerald-600 font-medium hover:underline">
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button onClick={() => setIsLogin(true)} className="text-emerald-600 font-medium hover:underline">
                Log in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}

// Profile Page Component
function ProfilePage({ user, onUpdate }: { user: UserType; onUpdate: (data: Partial<UserProfile>) => Promise<boolean> }) {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadingPic, setUploadingPic] = useState(false)
  const [profilePic, setProfilePic] = useState<string | null>(user.profile?.profilePic || null)
  const [formData, setFormData] = useState({
    fullName: user.profile?.fullName || '',
    department: user.profile?.department || '',
    faculty: user.profile?.faculty || '',
    level: user.profile?.level?.toString() || '',
    bio: user.profile?.bio || '',
    interests: user.profile?.interests || '',
    phone: user.profile?.phone || '',
    website: user.profile?.website || '',
  })

  const handleProfilePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    setUploadingPic(true)
    try {
      // Convert to base64
      const reader = new FileReader()
      reader.onload = async () => {
        const base64 = reader.result as string
        setProfilePic(base64)
        
        // Save to server
        const success = await onUpdate({ profilePic: base64 })
        if (success) {
          toast.success('Profile picture updated!')
        }
        setUploadingPic(false)
      }
      reader.readAsDataURL(file)
    } catch {
      toast.error('Failed to upload image')
      setUploadingPic(false)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    const success = await onUpdate({
      fullName: formData.fullName,
      department: formData.department || null,
      faculty: formData.faculty || null,
      level: formData.level ? parseInt(formData.level) : null,
      bio: formData.bio || null,
      interests: formData.interests || null,
      phone: formData.phone || null,
      website: formData.website || null,
    })
    setIsLoading(false)
    if (success) {
      setIsEditing(false)
    }
  }

  return (
    <div className="bg-gray-50 min-h-full pb-4">
      {/* Cover Photo */}
      <div className="h-32 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 relative">
        <button className="absolute bottom-2 right-2 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors">
          <Camera className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Profile Info */}
      <div className="px-4 -mt-12 relative">
        <div className="flex items-end gap-4">
          <div className="relative">
            <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
              {profilePic ? (
                <AvatarImage src={profilePic} alt={user.profile?.fullName || 'User'} />
              ) : null}
              <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold text-2xl">
                {user.profile?.fullName ? getInitials(user.profile.fullName) : 'U'}
              </AvatarFallback>
            </Avatar>
            {/* Profile Picture Upload Button */}
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 hover:bg-emerald-600 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-colors">
              {uploadingPic ? (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              ) : (
                <Camera className="w-4 h-4 text-white" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                className="hidden"
                disabled={uploadingPic}
              />
            </label>
          </div>
          <div className="flex-1 pb-2">
            <h2 className="font-bold text-xl text-gray-900">{user.profile?.fullName || 'User'}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        {/* Edit Button */}
        <div className="mt-4">
          {isEditing ? (
            <div className="flex gap-2">
              <Button 
                onClick={handleSave} 
                disabled={isLoading}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                <XIcon className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          ) : (
            <Button 
              onClick={() => setIsEditing(true)} 
              variant="outline" 
              className="w-full"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        {/* Profile Details */}
        <Card className="mt-4 rounded-xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input 
                    value={formData.fullName} 
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Input 
                    value={formData.department} 
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g., Computer Science"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Faculty</Label>
                  <Input 
                    value={formData.faculty} 
                    onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                    placeholder="e.g., Engineering"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Level</Label>
                  <Input 
                    type="number" 
                    value={formData.level} 
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    placeholder="e.g., 300"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea 
                    value={formData.bio} 
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Interests</Label>
                  <Input 
                    value={formData.interests} 
                    onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                    placeholder="e.g., coding, music, sports"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input 
                    value={formData.phone} 
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g., +234 800 123 4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input 
                    value={formData.website} 
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="e.g., https://yourwebsite.com"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 text-sm">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{user.profile?.department || 'No department set'}</span>
                </div>
                {user.profile?.faculty && (
                  <div className="flex items-center gap-3 text-sm">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{user.profile.faculty}</span>
                  </div>
                )}
                {user.profile?.level && (
                  <div className="flex items-center gap-3 text-sm">
                    <Bookmark className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{user.profile.level} Level</span>
                  </div>
                )}
                {user.profile?.bio && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-gray-600">{user.profile.bio}</p>
                  </div>
                )}
                {user.profile?.interests && (
                  <div className="flex items-center gap-3 text-sm">
                    <Sparkles className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{user.profile.interests}</span>
                  </div>
                )}
                {user.profile?.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{user.profile.phone}</span>
                  </div>
                )}
                {user.profile?.website && (
                  <div className="flex items-center gap-3 text-sm">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <a href={user.profile.website} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                      {user.profile.website}
                    </a>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Role Badge */}
        <div className="mt-4 flex items-center justify-center gap-2 py-2">
          <Badge className={`${user.role === 'LECTURER' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'} px-4 py-1`}>
            {user.role === 'LECTURER' ? '👨‍🏫 Lecturer' : '👨‍🎓 Student'}
          </Badge>
        </div>
      </div>
    </div>
  )
}

// Settings Page Component
function SettingsPage({ user, onLogout }: { user: UserType; onLogout: () => void }) {
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    darkMode: false,
    privateAccount: false,
    showOnlineStatus: true,
    allowMessages: true,
  })

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
    toast.success('Setting updated')
  }

  return (
    <div className="bg-gray-50 min-h-full p-4 space-y-4">
      {/* Account Settings */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Email</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <Button variant="ghost" size="sm">Change</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Password</p>
              <p className="text-xs text-gray-500">••••••••</p>
            </div>
            <Button variant="ghost" size="sm">Change</Button>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Privacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Private Account</p>
              <p className="text-xs text-gray-500">Only approved followers can see your posts</p>
            </div>
            <Switch 
              checked={settings.privateAccount} 
              onCheckedChange={() => handleToggle('privateAccount')} 
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Show Online Status</p>
              <p className="text-xs text-gray-500">Let others see when you're online</p>
            </div>
            <Switch 
              checked={settings.showOnlineStatus} 
              onCheckedChange={() => handleToggle('showOnlineStatus')} 
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Allow Messages</p>
              <p className="text-xs text-gray-500">Let anyone send you messages</p>
            </div>
            <Switch 
              checked={settings.allowMessages} 
              onCheckedChange={() => handleToggle('allowMessages')} 
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Push Notifications</p>
              <p className="text-xs text-gray-500">Receive notifications on your device</p>
            </div>
            <Switch 
              checked={settings.notifications} 
              onCheckedChange={() => handleToggle('notifications')} 
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Email Alerts</p>
              <p className="text-xs text-gray-500">Receive notifications via email</p>
            </div>
            <Switch 
              checked={settings.emailAlerts} 
              onCheckedChange={() => handleToggle('emailAlerts')} 
            />
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Dark Mode</p>
              <p className="text-xs text-gray-500">Switch to dark theme</p>
            </div>
            <Switch 
              checked={settings.darkMode} 
              onCheckedChange={() => handleToggle('darkMode')} 
            />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="rounded-xl shadow-sm border-red-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-red-600">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full text-red-500 border-red-200 hover:bg-red-50">
            Deactivate Account
          </Button>
          <Button 
            onClick={onLogout}
            variant="outline" 
            className="w-full text-red-500 border-red-200 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

// Groups Page Component
function GroupsPage() {
  const [joinedGroups, setJoinedGroups] = useState<string[]>(['g1'])

  const toggleJoin = (groupId: string) => {
    setJoinedGroups(prev => {
      if (prev.includes(groupId)) {
        toast.success('Left group')
        return prev.filter(id => id !== groupId)
      } else {
        toast.success('Joined group')
        return [...prev, groupId]
      }
    })
  }

  return (
    <div className="bg-gray-50 min-h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg">Groups</h2>
        <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">
          <Plus className="w-4 h-4 mr-1" /> Create
        </Button>
      </div>

      <div className="space-y-3">
        {demoGroups.map((group) => (
          <Card key={group.id} className="rounded-xl shadow-sm">
            <div className="p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl">
                {group.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm">{group.name}</p>
                <p className="text-xs text-gray-500">{group.members.toLocaleString()} members</p>
              </div>
              <Button 
                size="sm"
                variant={joinedGroups.includes(group.id) ? 'outline' : 'default'}
                className={joinedGroups.includes(group.id) ? '' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}
                onClick={() => toggleJoin(group.id)}
              >
                {joinedGroups.includes(group.id) ? 'Joined' : 'Join'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Events Page Component
function EventsPage() {
  const [rsvpEvents, setRsvpEvents] = useState<string[]>([])

  const toggleRsvp = (eventId: string) => {
    setRsvpEvents(prev => {
      if (prev.includes(eventId)) {
        toast.success('Removed from your events')
        return prev.filter(id => id !== eventId)
      } else {
        toast.success('RSVP\'d! See you there!')
        return [...prev, eventId]
      }
    })
  }

  return (
    <div className="bg-gray-50 min-h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg">Events</h2>
        <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">
          <Plus className="w-4 h-4 mr-1" /> Create
        </Button>
      </div>

      <div className="space-y-3">
        {demoEvents.map((event) => (
          <Card key={event.id} className="rounded-xl shadow-sm overflow-hidden">
            <div className="h-24 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-4xl">
              {event.icon}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900">{event.title}</h3>
              <div className="mt-2 space-y-1 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{event.date} at {event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{event.attendees} attending</span>
                </div>
              </div>
              <Button 
                size="sm"
                className={`w-full mt-3 ${rsvpEvents.includes(event.id) ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}`}
                onClick={() => toggleRsvp(event.id)}
              >
                {rsvpEvents.includes(event.id) ? '✓ Going' : 'RSVP'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Saved Posts Page Component
function SavedPage() {
  const [savedPosts, setSavedPosts] = useState<Post[]>(demoPosts.slice(0, 2).map(p => ({ ...p, isSaved: true })))

  const handleUnsave = (postId: string) => {
    setSavedPosts(prev => prev.filter(p => p.id !== postId))
    toast.success('Post removed from saved')
  }

  return (
    <div className="bg-gray-50 min-h-full p-4">
      <h2 className="font-bold text-lg mb-4">Saved Posts</h2>

      {savedPosts.length === 0 ? (
        <div className="text-center py-12">
          <Bookmark className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No saved posts yet</p>
          <p className="text-sm text-gray-400 mt-1">Posts you save will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {savedPosts.map((post) => (
            <Card key={post.id} className="rounded-xl shadow-sm p-4">
              <div className="flex items-start gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-500 text-white font-semibold text-sm">
                    {getInitials(post.author.profile?.fullName || 'U')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{post.author.profile?.fullName}</p>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">{post.content}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-400">{formatTime(post.createdAt)}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs text-red-500 h-auto py-1 px-2"
                      onClick={() => handleUnsave(post.id)}
                    >
                      Unsave
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// Chat Page Component
function ChatPage({ chatUser }: { chatUser: {id: string; name: string} | null }) {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    { id: '1', sender: 'other', text: 'Hey! Are you coming to the study group today?', time: '2:30 PM' },
    { id: '2', sender: 'me', text: 'Yes! I\'ll be there at 4 PM', time: '2:32 PM' },
    { id: '3', sender: 'other', text: 'Great! See you then 👍', time: '2:33 PM' },
  ])

  const handleSend = () => {
    if (!message.trim()) return
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender: 'me',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }])
    setMessage('')
    toast.success('Message sent!')
  }

  const userName = chatUser?.name || 'John Adebayo'
  const userInitials = getInitials(userName)

  return (
    <div className="flex flex-col h-[calc(100vh-60px)]">
      {/* Chat Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3">
        <Avatar className="w-10 h-10">
          <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white font-bold">
            {userInitials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold text-sm">{userName}</p>
          <p className="text-xs text-emerald-500">Online</p>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <MoreHorizontal className="w-5 h-5 text-gray-500" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] px-4 py-2 rounded-2xl ${
              msg.sender === 'me' 
                ? 'bg-emerald-500 text-white rounded-br-md' 
                : 'bg-white shadow-sm rounded-bl-md'
            }`}>
              <p className="text-sm">{msg.text}</p>
              <p className={`text-[10px] mt-1 ${msg.sender === 'me' ? 'text-emerald-100' : 'text-gray-400'}`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="bg-white border-t p-3 flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full flex-shrink-0">
          <ImageIcon className="w-5 h-5 text-gray-400" />
        </Button>
        <Input 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Message ${userName.split(' ')[0]}...`}
          className="flex-1 rounded-full"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button 
          onClick={handleSend}
          size="icon" 
          className="rounded-full bg-emerald-500 hover:bg-emerald-600 flex-shrink-0"
          disabled={!message.trim()}
        >
          <Send className="w-5 h-5 text-white" />
        </Button>
      </div>
    </div>
  )
}

// Feed Page Component
function FeedPage({ user }: { user: UserType }) {
  const [posts, setPosts] = useState<Post[]>(demoPosts)
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set())
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [newPostContent, setNewPostContent] = useState('')

  const toggleLike = (postId: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
        setPosts(posts.map(p => p.id === postId ? { ...p, likesCount: Math.max(0, p.likesCount - 1) } : p))
      } else {
        newSet.add(postId)
        setPosts(posts.map(p => p.id === postId ? { ...p, likesCount: p.likesCount + 1 } : p))
      }
      return newSet
    })
  }

  const toggleSave = (postId: string) => {
    setSavedPosts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
        toast.success('Post unsaved')
      } else {
        newSet.add(postId)
        toast.success('Post saved')
      }
      return newSet
    })
  }

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return
    const newPost: Post = {
      id: Date.now().toString(), 
      authorId: user.id, 
      author: user,
      content: newPostContent, 
      postType: 'TEXT', 
      mediaUrl: null, 
      likesCount: 0, 
      commentsCount: 0, 
      isPinned: false, 
      createdAt: new Date().toISOString(),
    }
    setPosts([newPost, ...posts])
    setNewPostContent('')
    setShowCreatePost(false)
    toast.success('Post created!')
  }

  return (
    <div className="bg-gray-50">
      {/* Create Post Card */}
      <div className="bg-white px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            {user.profile?.profilePic && <AvatarImage src={user.profile.profilePic} alt={user.profile.fullName || 'User'} />}
            <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-semibold text-sm">
              {user.profile?.fullName ? getInitials(user.profile.fullName) : 'U'}
            </AvatarFallback>
          </Avatar>
          <button
            onClick={() => setShowCreatePost(true)}
            className="flex-1 py-2.5 px-4 bg-gray-100 rounded-full text-left text-gray-500 text-sm hover:bg-gray-200 transition-colors"
          >
            What&apos;s on your mind, {user.profile?.fullName?.split(' ')[0]}?
          </button>
        </div>
        <div className="flex items-center gap-1 mt-2.5 pt-2.5 border-t border-gray-100">
          <button className="flex items-center gap-2 py-1.5 px-3 hover:bg-gray-100 rounded-lg transition-colors flex-1 justify-center">
            <VideoIcon className="w-5 h-5 text-rose-500" />
            <span className="text-sm text-gray-600 font-medium">Live</span>
          </button>
          <button className="flex items-center gap-2 py-1.5 px-3 hover:bg-gray-100 rounded-lg transition-colors flex-1 justify-center">
            <ImageIcon className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-600 font-medium">Photo</span>
          </button>
        </div>
      </div>

      {/* Stories Section */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 overflow-x-auto">
        <div className="flex gap-3">
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-dashed border-emerald-400 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
              <Plus className="w-6 h-6 text-emerald-500" />
            </div>
            <span className="text-[11px] text-gray-600 mt-1 font-medium">Add Story</span>
          </div>
          {stories.map((story) => (
            <div key={story.id} className="flex flex-col items-center flex-shrink-0 cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 p-0.5">
                <div className="w-full h-full rounded-full bg-white p-0.5">
                  <Avatar className="w-full h-full">
                    <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white font-bold text-sm">
                      {story.name[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <span className="text-[11px] text-gray-600 mt-1 font-medium">{story.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Posts Feed */}
      <div className="divide-y divide-gray-100">
        {posts.map((post) => (
          <div key={post.id} className="bg-white">
            {post.isPinned && (
              <div className="px-4 py-2 bg-amber-50 border-b border-amber-100">
                <span className="text-xs text-amber-700 font-medium flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Pinned Post
                </span>
              </div>
            )}
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className={`font-semibold text-white text-sm ${
                    post.author.role === 'LECTURER' 
                      ? 'bg-gradient-to-br from-blue-500 to-indigo-600' 
                      : 'bg-gradient-to-br from-purple-400 to-pink-500'
                  }`}>
                    {post.author.profile?.fullName ? getInitials(post.author.profile.fullName) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 text-sm truncate">
                      {post.author.profile?.fullName}
                    </span>
                    {post.author.role === 'LECTURER' && (
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-[10px] px-1.5 py-0 h-4">
                        ✓ Lecturer
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(post.createdAt)}</span>
                    <span className="mx-1">·</span>
                    <span>{post.author.profile?.department}</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-gray-100">
                  <MoreHorizontal className="w-5 h-5 text-gray-400" />
                </Button>
              </div>
              
              <p className="text-gray-800 text-[15px] leading-relaxed whitespace-pre-wrap mb-3">
                {post.content}
              </p>
              
              <div className="flex items-center justify-between py-2 border-y border-gray-100 mb-2">
                <div className="flex items-center gap-1.5">
                  <div className="flex -space-x-1">
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <ThumbsUp className="w-3 h-3 text-white fill-white" />
                    </div>
                    <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                      <Heart className="w-3 h-3 text-white fill-white" />
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    {post.likesCount + (likedPosts.has(post.id) ? 1 : 0)}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{post.commentsCount} comments</span>
              </div>
              
              <div className="flex items-center justify-around">
                <button 
                  onClick={() => toggleLike(post.id)} 
                  className={`flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors flex-1 justify-center ${
                    likedPosts.has(post.id) ? 'text-emerald-600' : 'text-gray-500'
                  }`}
                >
                  <ThumbsUp className={`w-5 h-5 ${likedPosts.has(post.id) ? 'fill-emerald-500 text-emerald-500' : ''}`} />
                  <span className="text-sm font-medium">{likedPosts.has(post.id) ? 'Liked' : 'Like'}</span>
                </button>
                <button className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors flex-1 justify-center text-gray-500">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Comment</span>
                </button>
                <button 
                  onClick={() => toggleSave(post.id)}
                  className={`flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors flex-1 justify-center ${
                    savedPosts.has(post.id) ? 'text-emerald-600' : 'text-gray-500'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${savedPosts.has(post.id) ? 'fill-emerald-500 text-emerald-500' : ''}`} />
                  <span className="text-sm font-medium">{savedPosts.has(post.id) ? 'Saved' : 'Save'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-white rounded-t-3xl w-full max-w-lg p-4 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" onClick={() => setShowCreatePost(false)} className="text-gray-500">
                Cancel
              </Button>
              <h2 className="font-bold text-lg">Create Post</h2>
              <Button 
                onClick={handleCreatePost} 
                disabled={!newPostContent.trim()} 
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4"
              >
                Post
              </Button>
            </div>
            <div className="flex items-start gap-3">
              <Avatar className="w-10 h-10">
                {user.profile?.profilePic && <AvatarImage src={user.profile.profilePic} alt={user.profile.fullName || 'User'} />}
                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-semibold text-sm">
                  {user.profile?.fullName ? getInitials(user.profile.fullName) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-sm">{user.profile?.fullName}</p>
                <Textarea 
                  value={newPostContent} 
                  onChange={(e) => setNewPostContent(e.target.value)} 
                  placeholder="What's on your mind?" 
                  className="border-0 resize-none focus-visible:ring-0 p-0 min-h-[120px] text-[15px]" 
                  autoFocus 
                />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
                <ImageIcon className="w-5 h-5 text-green-500" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
                <VideoIcon className="w-5 h-5 text-red-500" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Friends Page Component
function FriendsPage() {
  const [friendRequests, setFriendRequests] = useState([
    { id: '1', name: 'Emeka Okafor', mutualFriends: 5, department: 'Engineering' },
    { id: '2', name: 'Fatima Ibrahim', mutualFriends: 3, department: 'Medicine' },
    { id: '3', name: 'David Adeyemi', mutualFriends: 8, department: 'Law' },
  ])

  const [suggestions, setSuggestions] = useState([
    { id: '4', name: 'Grace Okoro', department: 'Computer Science', added: false },
    { id: '5', name: 'Ibrahim Yusuf', department: 'Business Admin', added: false },
    { id: '6', name: 'Chioma Nwankwo', department: 'Medicine', added: false },
  ])

  const handleConfirm = (id: string) => {
    setFriendRequests(prev => prev.filter(f => f.id !== id))
    toast.success('Friend request accepted!')
  }

  const handleDelete = (id: string) => {
    setFriendRequests(prev => prev.filter(f => f.id !== id))
    toast.success('Friend request deleted')
  }

  const handleAddFriend = (id: string) => {
    setSuggestions(prev => prev.map(s => s.id === id ? { ...s, added: true } : s))
    toast.success('Friend request sent!')
  }

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="bg-white p-4 border-b border-gray-100 sticky top-0">
        <h2 className="text-xl font-bold text-gray-900">Friends</h2>
      </div>
      
      {/* Friend Requests */}
      {friendRequests.length > 0 && (
        <div className="p-4">
          <Card className="rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
              <h3 className="font-bold text-gray-900">Friend Requests</h3>
              <Badge className="bg-emerald-500 text-white text-xs">{friendRequests.length}</Badge>
            </div>
            {friendRequests.map((friend, idx) => (
              <div key={friend.id} className={`p-4 bg-white ${idx !== friendRequests.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-500 text-white font-bold">
                      {getInitials(friend.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{friend.name}</p>
                    <p className="text-xs text-gray-500">{friend.mutualFriends} mutual friends • {friend.department}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button 
                    onClick={() => handleConfirm(friend.id)}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg h-9 text-sm"
                  >
                    Confirm
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleDelete(friend.id)}
                    className="flex-1 rounded-lg h-9 text-sm"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* People You May Know */}
      <div className="px-4 pb-4">
        <h3 className="font-bold text-gray-900 mb-3">People You May Know</h3>
        <div className="space-y-3">
          {suggestions.map((person) => (
            <Card key={person.id} className="rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 bg-white flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white font-bold">
                    {getInitials(person.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{person.name}</p>
                  <p className="text-xs text-gray-500">{person.department}</p>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => handleAddFriend(person.id)}
                  disabled={person.added}
                  className={person.added ? 'bg-gray-100 text-gray-500' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}
                >
                  {person.added ? 'Sent' : 'Add'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

// Video Page Component
function VideoPage() {
  const videos = [
    { id: 1, title: 'Campus Life at Baze University', views: '12K', time: '5:23', author: 'Student Council', thumbnail: '🎓' },
    { id: 2, title: 'How to Ace Your Exams', views: '8.5K', time: '12:45', author: 'Academic Office', thumbnail: '📚' },
    { id: 3, title: 'Sports Week Highlights', views: '5.2K', time: '8:30', author: 'Sports Department', thumbnail: '⚽' },
  ]

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="bg-white p-4 border-b border-gray-100 sticky top-0">
        <h2 className="text-xl font-bold text-gray-900">Video</h2>
      </div>
      <div className="p-4 space-y-4">
        {videos.map((video) => (
          <Card key={video.id} className="rounded-xl overflow-hidden shadow-sm">
            <div className="relative h-44 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <span className="text-5xl">{video.thumbnail}</span>
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-xl cursor-pointer hover:bg-white transition-colors">
                  <Play className="w-6 h-6 text-emerald-600 fill-emerald-600 ml-0.5" />
                </div>
              </div>
              <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded font-medium">
                {video.time}
              </span>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 text-sm">{video.title}</h3>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gray-500">{video.author}</p>
                <p className="text-xs text-gray-400">{video.views} views</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Marketplace Page Component
function MarketplacePage() {
  const listings = [
    { id: 1, title: 'CSC 301 Textbook', price: '₦5,000', condition: 'Good', emoji: '📚' },
    { id: 2, title: 'Scientific Calculator', price: '₦3,500', condition: 'Like New', emoji: '🧮' },
    { id: 3, title: 'Laptop Stand', price: '₦2,000', condition: 'Good', emoji: '💻' },
    { id: 4, title: 'Study Desk Lamp', price: '₦1,500', condition: 'Fair', emoji: '💡' },
    { id: 5, title: 'USB Flash Drive 64GB', price: '₦2,500', condition: 'New', emoji: '💾' },
    { id: 6, title: 'Headphones', price: '₦4,000', condition: 'Good', emoji: '🎧' },
  ]

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="bg-white p-4 border-b border-gray-100 sticky top-0">
        <h2 className="text-xl font-bold text-gray-900">Marketplace</h2>
      </div>
      <div className="p-3 grid grid-cols-2 gap-3">
        {listings.map((item) => (
          <Card key={item.id} className="rounded-xl overflow-hidden shadow-sm">
            <div className="h-28 bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
              <span className="text-4xl">{item.emoji}</span>
            </div>
            <CardContent className="p-3">
              <h3 className="font-semibold text-gray-900 text-sm truncate">{item.title}</h3>
              <p className="text-base font-bold text-emerald-600 mt-0.5">{item.price}</p>
              <Badge variant="secondary" className="text-[10px] mt-1 bg-gray-100 text-gray-600">
                {item.condition}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Notifications Page Component
function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    { id: '1', text: 'John Adebayo liked your post', time: '2m ago', icon: ThumbsUp, color: 'bg-blue-500', read: false },
    { id: '2', text: 'Amina Mohammed commented on your photo', time: '15m ago', icon: MessageCircle, color: 'bg-emerald-500', read: false },
    { id: '3', text: 'Dr. Sarah Okonkwo accepted your friend request', time: '1h ago', icon: Users, color: 'bg-purple-500', read: false },
    { id: '4', text: 'Campus Tech Talk starts tomorrow', time: '3h ago', icon: Calendar, color: 'bg-orange-500', read: true },
    { id: '5', text: 'Your post is trending!', time: '5h ago', icon: Sparkles, color: 'bg-amber-500', read: true },
  ])

  const handleMarkRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="bg-white p-4 border-b border-gray-100 sticky top-0 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => {
            setNotifications(prev => prev.map(n => ({ ...n, read: true })))
            toast.success('All notifications marked as read')
          }}
        >
          Mark all read
        </Button>
      </div>
      <div className="bg-white divide-y divide-gray-50">
        {notifications.map((notif) => (
          <button 
            key={notif.id} 
            className={`w-full flex items-center gap-4 p-4 hover:bg-gray-50 text-left transition-colors ${!notif.read ? 'bg-emerald-50/50' : ''}`}
            onClick={() => handleMarkRead(notif.id)}
          >
            <div className={`w-10 h-10 rounded-full ${notif.color} flex items-center justify-center shadow-sm`}>
              <notif.icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${!notif.read ? 'font-medium text-gray-900' : 'text-gray-700'}`}>{notif.text}</p>
              <p className="text-xs text-gray-500 mt-0.5">{notif.time}</p>
            </div>
            {!notif.read && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
          </button>
        ))}
      </div>
    </div>
  )
}

// Menu Page Component
function MenuPage({ user, onLogout, navigateTo }: { user: UserType; onLogout: () => void; navigateTo: (page: string) => void }) {
  const menuItems = [
    { icon: User, label: 'Your Profile', desc: 'See and edit your profile', color: 'text-blue-500 bg-blue-50', page: 'profile' },
    { icon: Users, label: 'Groups', desc: 'Connect with people who share your interests', color: 'text-emerald-500 bg-emerald-50', page: 'groups' },
    { icon: Calendar, label: 'Events', desc: 'Discover campus events', color: 'text-purple-500 bg-purple-50', page: 'events' },
    { icon: Bookmark, label: 'Saved', desc: 'Find posts you saved for later', color: 'text-orange-500 bg-orange-50', page: 'saved' },
    { icon: Settings, label: 'Settings', desc: 'Account preferences', color: 'text-gray-500 bg-gray-100', page: 'settings' },
  ]

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="bg-white p-4 border-b border-gray-100 sticky top-0">
        <h2 className="text-xl font-bold text-gray-900">Menu</h2>
      </div>
      
      {/* User Card */}
      <div className="p-4">
        <Card
          className="rounded-xl p-4 flex items-center gap-3 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigateTo('profile')}
        >
          <Avatar className="w-14 h-14">
            {user.profile?.profilePic && <AvatarImage src={user.profile.profilePic} alt={user.profile.fullName || 'User'} />}
            <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold text-lg">
              {user.profile?.fullName ? getInitials(user.profile.fullName) : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 truncate">{user.profile?.fullName || 'User'}</p>
            <p className="text-xs text-gray-500">{user.profile?.department} • {user.role.toLowerCase()}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300" />
        </Card>
      </div>

      {/* Menu Items */}
      <div className="px-4">
        <Card className="rounded-xl overflow-hidden shadow-sm">
          {menuItems.map((item, idx) => (
            <button 
              key={idx} 
              onClick={() => navigateTo(item.page)}
              className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 text-left transition-colors ${
                idx !== menuItems.length - 1 ? 'border-b border-gray-50' : ''
              }`}
            >
              <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center`}>
                <item.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm">{item.label}</p>
                <p className="text-xs text-gray-500 truncate">{item.desc}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </button>
          ))}
        </Card>
      </div>

      {/* Logout Button */}
      <div className="p-4">
        <Button 
          onClick={onLogout}
          variant="outline" 
          className="w-full py-3 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>
      </div>
    </div>
  )
}

// Search Page Component
function SearchPage({ navigateTo }: { navigateTo: (page: string) => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{type: string; name: string; desc: string; page?: string}[]>([])

  const handleSearch = (q: string) => {
    setQuery(q)
    if (q.length > 1) {
      setResults([
        { type: 'user', name: 'John Adebayo', desc: 'Computer Science • 300 Level', page: 'profile' },
        { type: 'user', name: 'Dr. Sarah Okonkwo', desc: 'Computer Science • Lecturer', page: 'profile' },
        { type: 'group', name: 'CSC 301 Study Group', desc: '245 members', page: 'groups' },
        { type: 'event', name: 'Tech Talk 2024', desc: 'Tomorrow at 2:00 PM', page: 'events' },
      ])
    } else {
      setResults([])
    }
  }

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="bg-white p-4 border-b border-gray-100 sticky top-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search students, groups, events..."
            className="pl-10 h-11 bg-gray-100 border-0 rounded-xl"
            autoFocus
          />
        </div>
      </div>
      <div className="bg-white divide-y divide-gray-50">
        {results.map((result, idx) => (
          <button 
            key={idx} 
            className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 text-left"
            onClick={() => result.page && navigateTo(result.page)}
          >
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white font-bold">
                {result.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm">{result.name}</p>
              <p className="text-xs text-gray-500">{result.desc}</p>
            </div>
          </button>
        ))}
        {query.length > 1 && results.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No results found</p>
          </div>
        )}
        {query.length <= 1 && (
          <div className="p-8 text-center text-gray-500">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Start typing to search</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Messages Page Component
function MessagesPage({ navigateTo, setChatUser }: { navigateTo: (page: string) => void; setChatUser: (user: {id: string; name: string} | null) => void }) {
  const conversations = [
    { id: '1', name: 'John Adebayo', lastMessage: 'Hey, are you coming to the study group?', time: '2m', unread: 2, online: true },
    { id: '2', name: 'Dr. Sarah Okonkwo', lastMessage: 'Your assignment has been graded', time: '1h', unread: 0, online: false },
    { id: '3', name: 'Amina Mohammed', lastMessage: 'Thanks for the notes!', time: '3h', unread: 1, online: true },
    { id: '4', name: 'CSC 301 Group', lastMessage: 'Chinedu: See you all tomorrow', time: '5h', unread: 5, online: false },
  ]

  const openChat = (conv: {id: string; name: string}) => {
    setChatUser(conv)
    navigateTo('chat')
  }

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="bg-white p-4 border-b border-gray-100 sticky top-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-gray-900">Messages</h2>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input placeholder="Search messages..." className="pl-10 h-10 bg-gray-100 border-0 rounded-xl" />
        </div>
      </div>
      <div className="bg-white divide-y divide-gray-50">
        {conversations.map((conv) => (
          <button 
            key={conv.id} 
            className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 text-left active:bg-gray-100 transition-colors"
            onClick={() => openChat(conv)}
          >
            <div className="relative">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white font-bold">
                  {getInitials(conv.name)}
                </AvatarFallback>
              </Avatar>
              {conv.unread > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                  {conv.unread}
                </span>
              )}
              {conv.online && (
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-gray-900 text-sm">{conv.name}</p>
                <span className="text-xs text-gray-400">{conv.time}</span>
              </div>
              <p className="text-xs text-gray-500 truncate">{conv.lastMessage}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
