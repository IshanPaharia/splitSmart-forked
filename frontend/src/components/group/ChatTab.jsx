import { MessageCircle } from 'lucide-react'

export default function ChatTab() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6">
      <div className="w-14 h-14 rounded-2xl bg-[#252525] flex items-center justify-center mb-4">
        <MessageCircle size={24} className="text-[#4b5563]" />
      </div>
      <h3 className="text-base font-medium text-white mb-1.5">
        Group Chat
      </h3>
      <p className="text-sm text-[#6b7280] text-center max-w-[240px] leading-relaxed">
        Coming soon
      </p>
    </div>
  )
}
