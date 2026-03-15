'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    if (isStandalone) {
      setIsInstalled(true)
      return
    }

    try {
      const lastDismissed = localStorage.getItem('pwa-install-dismissed')
      if (lastDismissed) {
        const daysSinceDismissed = (Date.now() - parseInt(lastDismissed)) / (1000 * 60 * 60 * 24)
        if (daysSinceDismissed < 7) return
      }
    } catch {
      // localStorage might be blocked
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      const timer = setTimeout(() => setShowPrompt(true), 3000)
      return () => clearTimeout(timer)
    }

    window.addEventListener('beforeinstallprompt', handler)

    const handleInstalled = () => {
      setIsInstalled(true)
      setShowPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('appinstalled', handleInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('appinstalled', handleInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') setIsInstalled(true)
      setDeferredPrompt(null)
      setShowPrompt(false)
    } catch (error) {
      console.error('Install prompt error:', error)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    try {
      localStorage.setItem('pwa-install-dismissed', Date.now().toString())
    } catch {
      // localStorage might be blocked
    }
  }

  if (isInstalled) return null

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-50"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-white font-bold text-2xl">B</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-base">Install BazeConnect</h3>
                  <p className="text-gray-500 text-sm mt-0.5">
                    Add to your home screen for quick access
                  </p>
                </div>
                <button
                  onClick={handleDismiss}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center flex-shrink-0 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex border-t border-gray-200">
              <button
                onClick={handleDismiss}
                className="flex-1 py-3 text-gray-500 font-semibold text-sm hover:bg-gray-50 transition-colors"
              >
                Not Now
              </button>
              <button
                onClick={handleInstall}
                className="flex-1 py-3 bg-blue-500 text-white font-semibold text-sm hover:bg-blue-600 transition-colors"
              >
                Install App
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function IOSInstallInstructions() {
  const [showInstructions, setShowInstructions] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches
    
    if (isIOS && !isInStandaloneMode) {
      try {
        const lastDismissed = localStorage.getItem('ios-install-dismissed')
        if (lastDismissed) {
          const daysSinceDismissed = (Date.now() - parseInt(lastDismissed)) / (1000 * 60 * 60 * 24)
          if (daysSinceDismissed < 7) return
        }
      } catch {
        // localStorage might be blocked
      }

      const timer = setTimeout(() => setShowInstructions(true), 5000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleDismiss = () => {
    setShowInstructions(false)
    try {
      localStorage.setItem('ios-install-dismissed', Date.now().toString())
    } catch {
      // localStorage might be blocked
    }
  }

  if (!showInstructions) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
      onClick={handleDismiss}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-white rounded-t-3xl w-full max-w-md p-6 pb-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center mb-4 shadow-xl">
            <span className="text-white font-bold text-3xl">B</span>
          </div>
          <h3 className="font-bold text-xl text-gray-900">Install BazeConnect</h3>
          <p className="text-gray-500 mt-2">Add to your home screen for the best experience</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Step 1</p>
              <p className="text-sm text-gray-500">Tap the Share button below</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Step 2</p>
              <p className="text-sm text-gray-500">Scroll down and tap &quot;Add to Home Screen&quot;</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Step 3</p>
              <p className="text-sm text-gray-500">Tap &quot;Add&quot; in the top right corner</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="w-full mt-6 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors"
        >
          Got it!
        </button>
      </motion.div>
    </motion.div>
  )
}
