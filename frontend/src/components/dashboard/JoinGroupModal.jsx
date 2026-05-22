import { useState } from 'react'
import Modal from '../shared/Modal'
import { groupService } from '../../services/group.service'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { cn } from '../../lib/cn'

export default function JoinGroupModal({ isOpen, onClose }) {
  const navigate = useNavigate()
  const [link, setLink] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!link.trim()) return

    // Extract token from link. Link might be http://localhost:5173/join/abcd123
    let token = link.trim()
    try {
      if (token.includes('http')) {
        const url = new URL(token)
        const parts = url.pathname.split('/')
        token = parts[parts.length - 1]
      } else if (token.includes('/join/')) {
        token = token.split('/join/')[1]
      }
    } catch (e) {
      // If URL parsing fails, assume token is the raw string
    }

    if (!token) {
      toast.error('Invalid link format')
      return
    }

    setSubmitting(true)
    try {
      const res = await groupService.joinGroup(token)
      toast.success('Joined group successfully!')
      onClose()
      navigate(`/groups/${res.data._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to join group')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Join a Group">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-[13px] font-medium text-[#6b7280] uppercase tracking-[0.08em] block mb-2">
            Invite Link
          </label>
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Paste the invite link here..."
            autoFocus
            className="w-full px-4 py-3 rounded-xl text-sm text-white bg-[#252525] border border-white/[0.06] placeholder:text-[#4b5563] focus:outline-none focus:border-[#6b7280] transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={submitting || !link.trim()}
          className={cn(
            'w-full py-3.5 rounded-xl text-sm font-medium transition-colors',
            link.trim() && !submitting
              ? 'bg-accent-green text-white hover:bg-accent-green-dark'
              : 'bg-[#252525] text-[#4b5563] cursor-not-allowed'
          )}
        >
          {submitting ? 'Joining...' : 'Join Group'}
        </button>
      </form>
    </Modal>
  )
}
