import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { expenseService } from '../services/expense.service'
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import { cn } from '../lib/cn'

import { formatUsername, getInitials } from '../utils/format'

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatAmount(val) {
  return Math.abs(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function getSplitType(expense) {
  if (expense.items && expense.items.length > 1) return 'Item-based'
  if (expense.splits.length > 0) {
    const amounts = expense.splits.map((s) => s.amount)
    const allEqual = amounts.every((a) => Math.abs(a - amounts[0]) < 0.02)
    return allEqual ? 'Equal' : 'Custom'
  }
  return 'Equal'
}

export default function ExpenseDetail() {
  const { id, expenseId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [expense, setExpense] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Fetch all expenses for the group and find the specific one
    expenseService.getGroupExpenses(id)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : (res.data.expenses || [])
        const found = data.find((e) => e._id === expenseId)
        if (found) {
          setExpense(found)
        } else {
          setError('Expense not found')
        }
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load expense'))
      .finally(() => setLoading(false))
  }, [id, expenseId])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1010] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !expense) {
    return (
      <div className="min-h-screen bg-[#0f1010] flex flex-col items-center justify-center px-6">
        <p className="text-sm text-danger mb-2">{error || 'Expense not found'}</p>
        <button
          onClick={() => navigate(`/groups/${id}`)}
          className="text-sm text-[#6b7280] hover:text-white transition-colors"
        >
          Back to group
        </button>
      </div>
    )
  }

  const payer = expense.paidBy
  const splitType = getSplitType(expense)

  return (
    <div className="min-h-screen bg-[#0f1010]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0f1010] px-4 pt-4 pb-3">
        <div className="flex items-center gap-3 max-w-3xl mx-auto">
          <button
            id="btn-back"
            onClick={() => navigate(`/groups/${id}`)}
            className="w-9 h-9 rounded-xl bg-[#252525] flex items-center justify-center hover:bg-[#2e2e2e] transition-colors flex-shrink-0"
          >
            <ArrowLeft size={18} className="text-white" />
          </button>
          <h1 className="text-lg font-medium text-white truncate">
            Expense Detail
          </h1>
        </div>
      </header>

      <main className="px-4 pb-12 max-w-3xl mx-auto space-y-6">
        {/* Title + date + split badge */}
        <div className="text-center pt-2">
          <h2 className="text-xl font-medium text-white">
            {expense.description}
          </h2>
          <p className="text-[13px] text-[#6b7280] mt-1">
            {formatDate(expense.createdAt)}
          </p>
          <span className="inline-block mt-2 text-[11px] font-medium text-[#6b7280] bg-[#252525] px-2.5 py-1 rounded-full">
            {splitType}
          </span>
        </div>

        {/* Paid By */}
        <div>
          <h3 className="text-[13px] font-medium text-[#6b7280] uppercase tracking-[0.08em] mb-2">
            Paid by
          </h3>
          <div className="flex items-center gap-3 bg-[#252525] rounded-2xl px-4 py-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-medium text-[#6b7280]">
                {getInitials(formatUsername(payer))}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <p className="text-[15px] font-medium text-white truncate">
                {formatUsername(payer)}
              </p>
              {payer?._id === user?._id && (
                <span className="text-[10px] font-medium text-accent-green bg-accent-green/10 px-1.5 py-0.5 rounded flex-shrink-0">
                  ME
                </span>
              )}
            </div>
            <span className="text-[15px] font-medium text-white flex-shrink-0">
              ₹{formatAmount(expense.totalAmount)}
            </span>
          </div>
        </div>

        {/* Participants / Split breakdown */}
        {expense.splits && expense.splits.length > 0 && (
          <div>
            <h3 className="text-[13px] font-medium text-[#6b7280] uppercase tracking-[0.08em] mb-2">
              Participants
            </h3>
            <div className="bg-[#252525] rounded-2xl overflow-hidden">
              {expense.splits.map((split, i) => (
                <div
                  key={split.user?._id || i}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3.5',
                    i < expense.splits.length - 1 && 'border-b border-white/[0.04]'
                  )}
                >
                  <div className="w-9 h-9 rounded-xl bg-[#1a1a1a] flex items-center justify-center flex-shrink-0">
                    <span className="text-[11px] font-medium text-[#6b7280]">
                      {getInitials(formatUsername(split.user))}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-white truncate">
                      {formatUsername(split.user)}
                    </p>
                    {split.user?._id === user?._id && (
                      <span className="text-[10px] font-medium text-accent-green bg-accent-green/10 px-1.5 py-0.5 rounded flex-shrink-0">
                        ME
                      </span>
                    )}
                  </div>
                  <span className="text-[14px] font-medium text-white flex-shrink-0">
                    ₹{formatAmount(split.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Items (if multiple items exist) */}
        {expense.items && expense.items.length > 1 && (
          <div>
            <h3 className="text-[13px] font-medium text-[#6b7280] uppercase tracking-[0.08em] mb-2">
              Items
            </h3>
            <div className="bg-[#252525] rounded-2xl overflow-hidden">
              {expense.items.map((item, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex items-center justify-between px-4 py-3',
                    i < expense.items.length - 1 && 'border-b border-white/[0.04]'
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] text-white truncate">{item.name}</p>
                    {item.quantity > 1 && (
                      <p className="text-[12px] text-[#6b7280] mt-0.5">
                        × {item.quantity}
                      </p>
                    )}
                  </div>
                  <span className="text-[14px] font-medium text-white flex-shrink-0">
                    ₹{formatAmount(item.price * (item.quantity || 1))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
