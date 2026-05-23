import { useContext } from 'react'
import { Avatar, Dropdown, Navbar } from 'flowbite-react'
import { FaBlog } from "react-icons/fa6"
import { AuthContext } from '../contexts/AuthProvider'

const MobileDashboard = () => {
  const { user, logOut } = useContext(AuthContext)

  return (
    <div className='px-4'>
      <Navbar fluid rounded>
        <Navbar.Brand href="/">
          <span className="self-center whitespace-nowrap text-3xl font-bold text-blue-700 flex items-center gap-2">
            <FaBlog className="inline-block"/>Books
          </span>
        </Navbar.Brand>
        <div className="flex gap-10">
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded/>}
          >
            <Dropdown.Header>
              <span className="block text-sm">
                {user?.fullName || "User"}
              </span>
              <span className="block truncate text-sm font-medium">
                {user?.email || ""}
              </span>
            </Dropdown.Header>
            <Dropdown.Item as="a" href="/admin/dashboard">
              Dashboard
            </Dropdown.Item>
            <Dropdown.Item as="a" href="/admin/dashboard/upload">
              Upload Book
            </Dropdown.Item>
            <Dropdown.Item as="a" href="/admin/dashboard/manage">
              Manage Books
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={logOut}>
              Sign out
            </Dropdown.Item>
          </Dropdown>
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Navbar.Link active href="/">
            Home
          </Navbar.Link>
          <Navbar.Link href="/admin/dashboard">
            Dashboard
          </Navbar.Link>
          <Navbar.Link href="/admin/dashboard/upload">
            Upload Book
          </Navbar.Link>
          <Navbar.Link href="/admin/dashboard/manage">
            Manage Books
          </Navbar.Link>
          <Navbar.Link href="/logout">
            Sign out
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </div>
  )
}

export default MobileDashboard