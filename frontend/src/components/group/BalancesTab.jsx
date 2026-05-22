import { useState, useEffect } from 'react'
import { expenseService } from '../../services/expense.service'
import { groupService } from '../../services/group.service'
import LoadingSpinner from '../shared/LoadingSpinner'
import { cn } from '../../lib/cn'
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'

import { formatUsername, getInitials } from '../../utils/format'

function formatAmount(val) {
  return Math.abs(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function BalancesTab({ groupId, user }) {
  const [balances, setBalances] = useState(null)
  const [settlement, setSettlement] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([
      expenseService.getGroupBalances(groupId),
      groupService.getSettlement(groupId),
    ])
      .then(([balRes, setRes]) => {
        setBalances(balRes.data)
        setSettlement(setRes.data)
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load balances'))
      .finally(() => setLoading(false))
  }, [groupId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-sm text-danger">{error}</p>
      </div>
    )
  }

  const currentUserId = user?._id
  const myBalance = balances?.balances?.find(
    (b) => b.user?._id === currentUserId
  )
  const myNet = myBalance?.netBalance ?? 0

  // Transactions where current user owes someone
  const youOwe = (settlement?.transactions || []).filter(
    (t) => t.from?._id === currentUserId
  )

  // All other members' balances
  const otherBalances = (balances?.balances || []).filter(
    (b) => b.user?._id !== currentUserId
  )

  return (
    <div className="space-y-6">
      {/* Section 1: Your net balance */}
      <div className="bg-[#252525] rounded-2xl px-5 py-4">
        <p className="text-[13px] font-medium text-[#6b7280] uppercase tracking-[0.08em] mb-2">
          Your balance
        </p>
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center',
            myNet >= 0 ? 'bg-accent-green/10' : 'bg-danger/10'
          )}>
            {myNet >= 0 ? (
              <TrendingUp size={18} className="text-accent-green" />
            ) : (
              <TrendingDown size={18} className="text-danger" />
            )}
          </div>
          <div>
            <span className={cn(
              'text-xl font-medium',
              myNet >= 0 ? 'text-accent-green' : 'text-danger'
            )}>
              {myNet >= 0 ? '+' : '-'}₹{formatAmount(myNet)}
            </span>
            <p className="text-[12px] text-[#6b7280] mt-0.5">
              {myNet > 0 ? 'you are owed' : myNet < 0 ? 'you owe' : 'settled up'}
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: You owe */}
      {youOwe.length > 0 && (
        <div>
          <h3 className="text-[13px] font-medium text-[#6b7280] uppercase tracking-[0.08em] mb-2">
            You owe
          </h3>
          <div className="flex flex-col gap-2">
            {youOwe.map((t, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-[#252525] rounded-2xl px-4 py-3.5"
              >
                <div className="w-9 h-9 rounded-xl bg-[#1a1a1a] flex items-center justify-center flex-shrink-0">
                  <span className="text-[11px] font-medium text-[#6b7280]">
                    {getInitials(formatUsername(t.to))}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-white truncate">
                    {formatUsername(t.to)}
                  </p>
                  <p className="text-[12px] text-danger mt-0.5">
                    ₹{formatAmount(t.amount)}
                  </p>
                </div>
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-green text-white text-[12px] font-medium hover:bg-accent-green-dark transition-colors"
                >
                  Settle up
                  <ArrowRight size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 3: Group balances */}
      {otherBalances.length > 0 && (
        <div>
          <h3 className="text-[13px] font-medium text-[#6b7280] uppercase tracking-[0.08em] mb-2">
            Group balances
          </h3>
          <div className="flex flex-col gap-2">
            {otherBalances.map((b) => (
              <div
                key={b.user?._id}
                className="flex items-center gap-3 bg-[#252525] rounded-2xl px-4 py-3.5"
              >
                <div className="w-9 h-9 rounded-xl bg-[#1a1a1a] flex items-center justify-center flex-shrink-0">
                  <span className="text-[11px] font-medium text-[#6b7280]">
                    {getInitials(formatUsername(b.user))}
                  </span>
                </div>
                <p className="text-[14px] font-medium text-white truncate flex-1">
                  {formatUsername(b.user)}
                </p>
                <span className={cn(
                  'text-[14px] font-medium flex-shrink-0',
                  b.netBalance >= 0 ? 'text-accent-green' : 'text-danger'
                )}>
                  {b.netBalance >= 0 ? '+' : '-'}₹{formatAmount(b.netBalance)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
