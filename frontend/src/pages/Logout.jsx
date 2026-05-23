import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthProvider'

const Logout = () => {
    const { logOut } = useContext(AuthContext)

    const handleSignOut = () => {
        logOut()
    }

    return (
        <div className="h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md mx-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign Out</h2>
                <p className="text-gray-500 mb-8">Are you sure you want to sign out?</p>
                <div className="flex gap-4 justify-center">
                    <Link
                        to="/"
                        onClick={handleSignOut}
                        className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-2 rounded-lg transition"
                    >
                        Yes, Sign Out
                    </Link>
                    <Link
                        to="/"
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-2 rounded-lg transition"
                    >
                        Cancel
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Logout