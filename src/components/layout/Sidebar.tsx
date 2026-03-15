'use client'

import { cn } from '@/lib/helpers'
import type { UserRole } from '@/types'

interface SidebarProps {
  isOpen: boolean
  activeTab: string
  onNavigate: (tab: string) => void
  userRole: UserRole
}

const menuItems = [
  { id: 'feed', label: 'Home Feed', icon: 'home' },
  { id: 'profile', label: 'My Profile', icon: 'user' },
  { id: 'messages', label: 'Messages', icon: 'chat' },
  { id: 'groups', label: 'Groups', icon: 'users' },
  { id: 'events', label: 'Events', icon: 'calendar' },
  { id: 'marketplace', label: 'Marketplace', icon: 'shopping' },
]

const adminItems = [
  { id: 'admin', label: 'Admin Dashboard', icon: 'shield' },
]

const icons: Record<string, React.ReactNode> = {
  home: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  user: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  chat: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  users: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  calendar: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  shopping: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
  shield: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
}

export function Sidebar({ isOpen, activeTab, onNavigate, userRole }: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto transition-transform duration-300 z-40",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <nav className="p-4 space-y-2">
        {/* Main Menu */}
        <div className="mb-4">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Main Menu
          </h3>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left",
                activeTab === item.id
                  ? "bg-emerald-50 text-emerald-700 font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              {icons[item.icon]}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Admin Menu */}
        {userRole === 'SYSTEM_ADMIN' && (
          <div className="pt-4 border-t border-gray-200">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Administration
            </h3>
            {adminItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left",
                  activeTab === item.id
                    ? "bg-emerald-50 text-emerald-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                {icons[item.icon]}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Quick Links */}
      <div className="p-4 border-t border-gray-200">
        <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Quick Links
        </h3>
        <div className="space-y-2">
          <button
            onClick={() => onNavigate('search')}
            className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors"
          >
            🔍 Find Students
          </button>
          <button
            onClick={() => onNavigate('groups')}
            className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors"
          >
            👥 Join Study Groups
          </button>
          <button
            onClick={() => onNavigate('events')}
            className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors"
          >
            📅 Campus Events
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-center text-xs text-gray-500">
          <p>© 2024 BazeConnect</p>
          <p className="mt-1">Baze University, Abuja</p>
        </div>
      </div>
    </aside>
  )
}
