import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Profile, Notification, Message } from '@/types'

// Auth Store
interface AuthState {
  user: (User & { profile: Profile | null }) | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: (User & { profile: Profile | null }) | null) => void
  setToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'bazeconnect-auth',
      partialize: (state) => ({ token: state.token }),
    }
  )
)

// Notification Store
interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  setNotifications: (notifications: Notification[]) => void
  addNotification: (notification: Notification) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  setUnreadCount: (count: number) => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  setNotifications: (notifications) => {
    const unreadCount = notifications.filter((n) => !n.isRead).length
    set({ notifications, unreadCount })
  },
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + (notification.isRead ? 0 : 1),
    })),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),
  setUnreadCount: (count) => set({ unreadCount: count }),
}))

// Message Store
interface MessageState {
  conversations: Map<string, Message[]>
  activeConversation: string | null
  setConversation: (userId: string, messages: Message[]) => void
  addMessage: (userId: string, message: Message) => void
  setActiveConversation: (userId: string | null) => void
  clearConversations: () => void
}

export const useMessageStore = create<MessageState>((set) => ({
  conversations: new Map(),
  activeConversation: null,
  setConversation: (userId, messages) =>
    set((state) => {
      const newConversations = new Map(state.conversations)
      newConversations.set(userId, messages)
      return { conversations: newConversations }
    }),
  addMessage: (userId, message) =>
    set((state) => {
      const newConversations = new Map(state.conversations)
      const existing = newConversations.get(userId) || []
      newConversations.set(userId, [...existing, message])
      return { conversations: newConversations }
    }),
  setActiveConversation: (userId) => set({ activeConversation: userId }),
  clearConversations: () => set({ conversations: new Map() }),
}))

// UI Store
interface UIState {
  sidebarOpen: boolean
  activeTab: string
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setActiveTab: (tab: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  activeTab: 'feed',
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}))

// Search Store
interface SearchState {
  query: string
  results: {
    users: unknown[]
    groups: unknown[]
    events: unknown[]
    posts: unknown[]
  }
  isSearching: boolean
  setQuery: (query: string) => void
  setResults: (results: SearchState['results']) => void
  setSearching: (searching: boolean) => void
  clearResults: () => void
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  results: {
    users: [],
    groups: [],
    events: [],
    posts: [],
  },
  isSearching: false,
  setQuery: (query) => set({ query }),
  setResults: (results) => set({ results }),
  setSearching: (isSearching) => set({ isSearching }),
  clearResults: () =>
    set({
      query: '',
      results: { users: [], groups: [], events: [], posts: [] },
    }),
}))
