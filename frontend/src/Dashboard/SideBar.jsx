import { Sidebar } from 'flowbite-react';
import { HiArrowSmRight, HiChartPie, HiInbox, HiOutlineCloudUpload } from 'react-icons/hi';
import img from '../assets/profile.jpg'
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthProvider';
import MobileDashboard from './MobileDashboard';

const SideBar = () => {
  const {user} = useContext(AuthContext)
  return (
    <div className=''>
      <Sidebar aria-label="Admin sidebar" className='hidden md:block'>
        <Sidebar.Logo
          href="/"
          img={ img}
          className='w-10 h-10 rounded-full'
          imgAlt="Profile"
        >
          <p className="truncate max-w-[140px]">
            {user?.fullName || user?.email || "Admin"}
          </p>
        </Sidebar.Logo>
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Sidebar.Item
              href="/admin/dashboard"
              icon={HiChartPie}
            >
              Dashboard
            </Sidebar.Item>
            <Sidebar.Item
              href="/admin/dashboard/upload"
              icon={HiOutlineCloudUpload}
            >
              Upload Book
            </Sidebar.Item>
            <Sidebar.Item
              href="/admin/dashboard/manage"
              icon={HiInbox}
            >
              Manage Books
            </Sidebar.Item>
            <Sidebar.Item
              href="/shop"
              icon={HiArrowSmRight}
            >
              View Shop
            </Sidebar.Item>
          </Sidebar.ItemGroup>
          <Sidebar.ItemGroup>
            <Sidebar.Item
              href="/logout"
              icon={HiArrowSmRight}
            >
              Sign Out
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
      <div className='md:hidden'>
          <MobileDashboard/>
      </div>
    </div>
  )
}

export default SideBar