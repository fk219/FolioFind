import { useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  FaArrowRightFromBracket,
  FaArrowUpRightFromSquare,
  FaBookOpen,
  FaChartPie,
  FaCloudArrowUp,
  FaTableList
} from 'react-icons/fa6'
import { AuthContext } from '../contexts/AuthProvider'

const items = [
  { to: '/admin/dashboard', label: 'Overview', icon: FaChartPie, end: true },
  { to: '/admin/dashboard/upload', label: 'Upload book', icon: FaCloudArrowUp },
  { to: '/admin/dashboard/manage', label: 'Manage books', icon: FaTableList }
]

export default function SideBar() {
  const { user, logOut } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSignOut = () => {
    logOut()
    navigate('/')
  }

  return (
    <aside className="sticky top-0 flex h-screen w-16 shrink-0 flex-col border-r border-paper/10 bg-[#211712] text-paper lg:w-64">
      <NavLink to="/admin/dashboard" className="flex h-16 items-center gap-3 border-b border-paper/10 px-4 lg:h-20 lg:px-6" aria-label="FolioFind admin">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-paper text-ink">
          <FaBookOpen className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="hidden flex-col leading-none lg:flex">
          <span className="font-display text-2xl tracking-tight">FolioFind</span>
          <span className="mt-1 font-mono text-[8px] uppercase tracking-[0.2em] text-paper/45">Shop ledger</span>
        </span>
      </NavLink>

      <div className="hidden border-b border-paper/10 px-6 py-4 lg:block">
        <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-paper/35">Signed in</p>
        <p className="mt-1 truncate text-sm text-paper/75">{user?.fullName || user?.email}</p>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4 lg:px-3" aria-label="Admin">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            aria-label={label}
            title={label}
            className={({ isActive }) =>
              `flex min-h-11 items-center gap-3 border-l-2 px-3 transition-colors ${
                isActive
                  ? 'border-brass bg-paper/10 text-paper'
                  : 'border-transparent text-paper/50 hover:bg-paper/5 hover:text-paper'
              }`
            }
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.14em] lg:inline">{label}</span>
          </NavLink>
        ))}
        <NavLink
          to="/shop"
          aria-label="View shop"
          title="View shop"
          className="flex min-h-11 items-center gap-3 border-l-2 border-transparent px-3 text-paper/50 transition-colors hover:bg-paper/5 hover:text-paper"
        >
          <FaArrowUpRightFromSquare className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.14em] lg:inline">View shop</span>
        </NavLink>
      </nav>

      <div className="border-t border-paper/10 p-2 lg:p-3">
        <button
          type="button"
          onClick={handleSignOut}
          aria-label="Sign out"
          className="flex min-h-11 w-full items-center gap-3 border-l-2 border-transparent px-3 text-paper/50 transition-colors hover:bg-paper/5 hover:text-brass"
        >
          <FaArrowRightFromBracket className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.14em] lg:inline">Sign out</span>
        </button>
      </div>
    </aside>
  )
}
