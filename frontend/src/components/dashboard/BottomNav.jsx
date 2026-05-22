import { Users, User } from 'lucide-react'
import { cn } from '../../lib/cn'

const tabs = [
  { id: 'groups', label: 'Groups', icon: Users },
  { id: 'profile', label: 'Profile', icon: User },
]

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav
      id="bottom-nav"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#0f1010] border-t border-white/[0.06]"
    >
      <div className="max-w-3xl mx-auto flex items-center justify-around px-6 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex flex-col items-center gap-1 px-6 py-2 transition-colors duration-150',
                isActive
                  ? 'text-white'
                  : 'text-[#4b5563] hover:text-[#6b7280]'
              )}
            >
              <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
              <span className={cn(
                'text-[11px] tracking-wide',
                isActive ? 'font-medium' : 'font-normal'
              )}>
                {tab.label}
              </span>
              {/* Active dot indicator */}
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-white mt-0.5" />
              )}
            </button>
          )
        })}
      </div>

      {/* Safe area bottom spacer for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  )
}
