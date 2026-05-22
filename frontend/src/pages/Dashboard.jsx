import { useState } from 'react'
import AppLayout from '../layouts/AppLayout'
import BottomNav from '../components/dashboard/BottomNav'
import FloatingActionButton from '../components/dashboard/FloatingActionButton'
import GroupsView from '../components/dashboard/GroupsView'
import ProfileView from '../components/dashboard/ProfileView'
import CreateGroupModal from '../components/dashboard/CreateGroupModal'
import JoinGroupModal from '../components/dashboard/JoinGroupModal'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('groups')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)

  return (
    <AppLayout>
      {/* Dynamic main content based on active tab */}
      {activeTab === 'groups' ? <GroupsView /> : <ProfileView />}

      {/* Floating Action Button — centered above bottom nav */}
      <FloatingActionButton 
        onOpenCreate={() => setIsCreateModalOpen(true)}
        onOpenJoin={() => setIsJoinModalOpen(true)}
      />

      {/* Bottom Navigation Bar */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      <CreateGroupModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
      <JoinGroupModal 
        isOpen={isJoinModalOpen} 
        onClose={() => setIsJoinModalOpen(false)} 
      />
    </AppLayout>
  )
}
