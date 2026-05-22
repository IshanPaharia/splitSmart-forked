import { useState, useCallback, useEffect } from 'react'
import { Plus, Users, UserPlus, Lock } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { cn } from '../../lib/cn'

export default function FloatingActionButton({ onOpenCreate, onOpenJoin }) {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)

  const isGuest = user?.isGuest === true

  const handleToggle = useCallback(() => {
    if (isOpen) {
      setIsAnimatingOut(true)
      setTimeout(() => {
        setIsOpen(false)
        setIsAnimatingOut(false)
      }, 150)
    } else {
      setIsOpen(true)
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && isOpen) handleToggle()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, handleToggle])

  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div
          className={cn(
            'fixed inset-0 z-40 bg-black/50',
            isAnimatingOut ? 'animate-overlay-out' : 'animate-overlay-in'
          )}
          onClick={handleToggle}
        />
      )}

      {/* FAB container — positioned above the bottom nav */}
      <div className="fixed bottom-[72px] left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
        {/* Expanded menu items */}
        {isOpen && (
          <div
            className={cn(
              'flex flex-col gap-2 mb-4 w-72',
              isAnimatingOut ? 'animate-fab-menu-out' : 'animate-fab-menu-in'
            )}
          >
            {/* Option 1: Start a New Expense Group */}
            <button
              id="fab-new-group"
              disabled={isGuest}
              onClick={() => {
                if (!isGuest) {
                  handleToggle()
                  onOpenCreate()
                }
              }}
              className={cn(
                'flex items-center gap-3 w-full px-5 py-4 rounded-2xl transition-colors duration-150',
                'bg-[#252525]',
                isGuest
                  ? 'cursor-not-allowed'
                  : 'hover:bg-[#2e2e2e] active:bg-[#333]'
              )}
            >
              <div className="w-9 h-9 rounded-xl bg-[#1a1a1a] flex items-center justify-center flex-shrink-0">
                {isGuest ? (
                  <Lock size={16} className="text-[#4b5563]" />
                ) : (
                  <Users size={16} className="text-white" />
                )}
              </div>
              <div className="flex flex-col items-start">
                <span className={cn(
                  'text-sm font-medium',
                  isGuest ? 'text-[#4b5563]' : 'text-white'
                )}>
                  Start a New Expense Group
                </span>
                {isGuest && (
                  <span className="text-[11px] text-[#6b7280] mt-0.5">
                    Register to create an expense group
                  </span>
                )}
              </div>
            </button>

            {/* Option 2: Join an Existing Group */}
            <button
              id="fab-join-group"
              onClick={() => {
                handleToggle()
                onOpenJoin()
              }}
              className={cn(
                'flex items-center gap-3 w-full px-5 py-4 rounded-2xl transition-colors duration-150',
                'bg-[#252525] hover:bg-[#2e2e2e] active:bg-[#333]'
              )}
            >
              <div className="w-9 h-9 rounded-xl bg-[#1a1a1a] flex items-center justify-center flex-shrink-0">
                <UserPlus size={16} className="text-white" />
              </div>
              <span className="text-sm font-medium text-white">
                Join an Existing Group
              </span>
            </button>
          </div>
        )}

        {/* FAB Button */}
        <button
          id="fab-toggle"
          onClick={handleToggle}
          className={cn(
            'w-14 h-14 rounded-full flex items-center justify-center',
            'transition-all duration-200',
            'active:scale-95',
            isOpen
              ? 'bg-[#333]'
              : 'bg-accent-green'
          )}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          <div className={cn(
            'transition-transform duration-200',
            isOpen ? 'rotate-45' : 'rotate-0'
          )}>
            <Plus size={24} className={isOpen ? 'text-white' : 'text-white'} strokeWidth={2.5} />
          </div>
        </button>
      </div>
    </>
  )
}
