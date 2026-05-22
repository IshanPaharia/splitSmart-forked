import { useState } from 'react'
import Modal from '../shared/Modal'
import { groupService } from '../../services/group.service'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { AlertTriangle } from 'lucide-react'

export default function DeleteGroupModal({ isOpen, onClose, group }) {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const handleDelete = async () => {
    setSubmitting(true)
    try {
      await groupService.deleteGroup(group._id)
      toast.success('Group deleted')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete group')
      setSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Group">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center mb-2">
          <AlertTriangle size={32} className="text-danger" />
        </div>
        
        <h3 className="text-lg font-medium text-white">
          Delete "{group?.name}"?
        </h3>
        
        <p className="text-[14px] text-[#6b7280] max-w-[280px]">
          This action cannot be undone. All expenses, balances, and chat history will be permanently deleted.
        </p>

        <div className="w-full flex gap-3 pt-4 mt-4">
          <button
            onClick={onClose}
            disabled={submitting}
            className="flex-1 py-3.5 rounded-xl bg-[#252525] text-white text-sm font-medium hover:bg-[#2e2e2e] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={submitting}
            className="flex-1 py-3.5 rounded-xl bg-danger text-white text-sm font-medium hover:bg-danger/80 transition-colors"
          >
            {submitting ? 'Deleting...' : 'Delete Group'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
