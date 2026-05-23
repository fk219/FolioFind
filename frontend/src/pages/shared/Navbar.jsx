import { useContext, useEffect, useState } from "react"
import { FaXmark, FaBarsStaggered, FaBook } from "react-icons/fa6"
import { Link, useLocation } from "react-router-dom"
import { AuthContext } from "../../contexts/AuthProvider"

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isSticky, setIsSticky] = useState(false)
    const { user } = useContext(AuthContext)
    const location = useLocation()

    const toggleMenu = () => setIsMenuOpen(prev => !prev)

    useEffect(() => {
        const handleScroll = () => setIsSticky(window.scrollY > 60)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const navItems = [
        { link: "Home", path: "/" },
        { link: "Shop", path: "/shop" },
        { link: "About", path: "/about" },
        { link: "Blog", path: "/blog" },
    ]

    const isActive = (path) => location.pathname === path

    return (
        <header className={`w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isSticky ? "bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100" : "bg-white/70 backdrop-blur-lg"}`}>
            <nav className="py-5 lg:px-24 px-4">
                <div className="flex justify-between items-center gap-8">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
                            <FaBook className="text-white text-xl" />
                        </div>
                        <span className="text-2xl font-semibold tracking-[-0.02em] text-gray-900 group-hover:text-emerald-700 transition-colors">
                            FolioFid
                        </span>
                    </Link>

                    <ul className="md:flex items-center gap-1 hidden">
                        {navItems.map(({ link, path }) => (
                            <Link 
                                key={link} 
                                to={path} 
                                className={`px-5 py-2 rounded-xl text-[14px] font-medium transition-all ${isActive(path) ? 'text-emerald-700 bg-emerald-50' : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/70'}`}
                            >
                                {link}
                            </Link>
                        ))}
                        
                        <div className="w-px h-5 bg-gray-200 mx-3" />
                        
                        {user ? (
                            <>
                                <Link 
                                    to="/sell" 
                                    className="px-6 py-2.5 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-lg active:scale-[0.985] transition-all shadow-sm"
                                >
                                    Sell Book
                                </Link>
                                <Link 
                                    to="/my-listings" 
                                    className={`px-5 py-2 rounded-xl text-[14px] font-medium transition-all ${isActive('/my-listings') ? 'text-emerald-700 bg-emerald-50' : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/70'}`}
                                >
                                    My Listings
                                </Link>
                                {user.role === "admin" && (
                                    <Link 
                                        to="/admin/dashboard" 
                                        className={`px-5 py-2 rounded-xl text-[14px] font-medium transition-all ${isActive('/admin/dashboard') ? 'text-emerald-700 bg-emerald-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                                    >
                                        Dashboard
                                    </Link>
                                )}
                                <Link 
                                    to="/logout" 
                                    className="px-5 py-2 rounded-xl text-[14px] font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all"
                                >
                                    Logout
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link 
                                    to="/login" 
                                    className={`px-5 py-2 rounded-xl text-[14px] font-medium transition-all ${isActive('/login') ? 'text-emerald-700 bg-emerald-50' : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/70'}`}
                                >
                                    Log in
                                </Link>
                                <Link 
                                    to="/create-user" 
                                    className="px-6 py-2.5 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-lg active:scale-[0.985] transition-all shadow-sm"
                                >
                                    Sign up
                                </Link>
                            </>
                        )}
                    </ul>

                    <div className="md:hidden flex items-center gap-2">
                        <button 
                            onClick={toggleMenu} 
                            className="p-3 rounded-2xl text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-all focus:outline-none"
                        >
                            {isMenuOpen ? <FaXmark className="h-5 w-5" /> : <FaBarsStaggered className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden mt-4 p-5 bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-100 animate-fade-in-up">
                        <div className="space-y-1">
                            {navItems.map(({ link, path }) => (
                                <Link 
                                    key={link} 
                                    to={path} 
                                    onClick={toggleMenu} 
                                    className={`block px-5 py-3 rounded-2xl text-sm font-medium ${isActive(path) ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    {link}
                                </Link>
                            ))}
                            <div className="h-px bg-gray-100 my-2" />
                            {user ? (
                                <>
                                    <Link to="/sell" onClick={toggleMenu} className="block px-5 py-3 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 text-center">
                                        Sell a Book
                                    </Link>
                                    <Link to="/my-listings" onClick={toggleMenu} className={`block px-5 py-3 rounded-2xl text-sm font-medium ${isActive('/my-listings') ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                                        My Listings
                                    </Link>
                                    {user.role === "admin" && (
                                        <Link to="/admin/dashboard" onClick={toggleMenu} className={`block px-5 py-3 rounded-2xl text-sm font-medium ${isActive('/admin/dashboard') ? 'bg-emerald-50 text-emerald-700' : 'text-emerald-600 hover:bg-emerald-50'}`}>
                                            Dashboard
                                        </Link>
                                    )}
                                    <Link to="/logout" onClick={toggleMenu} className="block px-5 py-3 rounded-2xl text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50">
                                        Logout
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={toggleMenu} className={`block px-5 py-3 rounded-2xl text-sm font-medium ${isActive('/login') ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                                        Log in
                                    </Link>
                                    <Link to="/create-user" onClick={toggleMenu} className="block px-5 py-3 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 text-center">
                                        Create account
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    )
}

export default Navbar