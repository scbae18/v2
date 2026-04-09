import Sidebar from '@/components/common/Sidebar'
import { ToastContainer } from '@/components/common/Toast'
import { colors } from '@/styles/tokens/colors'
import UserInitializer from '@/components/common/UserInitializer'
import AttendanceFloatingBar from '@/components/common/AttendanceFloatingBar/AttendanceFloatingBar'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex' }}>
      <UserInitializer />
      <Sidebar />
      <main style={{ marginLeft: '240px', flex: 1, minHeight: '100vh', padding: '48px 48px', paddingBottom: '120px', backgroundColor: colors.background }}>
        {children}
      </main>
      <ToastContainer />
      <AttendanceFloatingBar />
    </div>
  )
}