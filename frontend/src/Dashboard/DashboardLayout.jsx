import SideBar from './SideBar'
import { Outlet } from 'react-router-dom'

export const DashboardLayout = () => {
  return (
    <div className='flex min-h-screen bg-paper'>
      <SideBar/>
      <main className='min-w-0 flex-1 overflow-auto'>
        <Outlet/>
      </main>
    </div>
  )
}
