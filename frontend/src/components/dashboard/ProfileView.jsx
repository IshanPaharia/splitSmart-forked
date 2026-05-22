import { User, Mail, KeyRound, ArrowUpCircle, LogOut, Shield } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import GlassButton from '../shared/GlassButton'
import GlassInput from '../shared/GlassInput'
import { cn } from '../../lib/cn'

function SectionCard({ title, children }) {
  return (
    <div className="bg-[#252525] rounded-2xl p-5">
      <h3 className="text-[13px] font-medium text-[#6b7280] uppercase tracking-[0.08em] mb-4">
        {title}
      </h3>
      {children}
    </div>
  )
}

export default function ProfileView() {
  const { user } = useAuth()
  const isGuest = user?.isGuest === true

  // Generate initials for avatar
  const initials = (user?.username || 'U')
    .split(/[\s_]+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <section id="profile-view" className="space-y-4">
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-2">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-2xl bg-[#252525] flex items-center justify-center flex-shrink-0">
          <span className="text-lg font-medium text-[#6b7280]">{initials}</span>
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-medium text-white truncate">
            {user?.username || 'User'}
          </h2>
          <div className="flex items-center gap-2 mt-0.5">
            {user?.email && (
              <span className="text-[13px] text-[#6b7280] truncate">
                {user.email}
              </span>
            )}
            <span className={cn(
              'text-[11px] font-medium px-2 py-0.5 rounded-full',
              isGuest
                ? 'bg-[#252525] text-[#6b7280]'
                : 'bg-[#252525] text-white'
            )}>
              {isGuest ? 'Guest' : 'Member'}
            </span>
          </div>
        </div>
      </div>

      {/* Upgrade Account — visible only for guests */}
      {isGuest && (
        <div className="bg-[#252525] rounded-2xl p-5">
          <div className="flex items-center gap-2.5 mb-2">
            <ArrowUpCircle size={16} className="text-white" />
            <h3 className="text-sm font-medium text-white">
              Upgrade Account
            </h3>
          </div>
          <p className="text-[13px] text-[#6b7280] mb-4 leading-relaxed">
            Unlock full features — create expense groups, manage members, and more.
          </p>
          <GlassButton
            id="btn-upgrade-account"
            onClick={() => {
              // TODO: Navigate to upgrade flow or open modal
            }}
          >
            Upgrade to Full Account
          </GlassButton>
        </div>
      )}

      {/* Account Management */}
      <SectionCard title="Account">
        <div className="space-y-4">
          <GlassInput
            id="input-display-name"
            label="Display Name"
            placeholder={user?.username || 'Your name'}
            disabled
          />
          <GlassInput
            id="input-email"
            label="Email Address"
            type="email"
            placeholder={user?.email || 'Add an email'}
            disabled
          />
          <GlassButton
            id="btn-reset-password"
            variant="ghost"
            disabled
          >
            <span className="flex items-center justify-center gap-2">
              <KeyRound size={14} />
              Reset Password
            </span>
          </GlassButton>
          <p className="text-[11px] text-[#4b5563] text-center">
            Account management coming soon
          </p>
        </div>
      </SectionCard>

      {/* Group Management */}
      <SectionCard title="Groups">
        <div className="space-y-3">
          <GlassButton
            id="btn-leave-group"
            variant="danger"
            disabled
          >
            <span className="flex items-center justify-center gap-2">
              <LogOut size={14} />
              Leave Group
            </span>
          </GlassButton>
          <p className="text-[11px] text-[#4b5563] text-center">
            Select a group from the Groups tab to manage membership
          </p>
        </div>
      </SectionCard>
    </section>
  )
}
