import { useContext, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthProvider'
import { FaBook } from 'react-icons/fa6'

export default function Login() {
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const { login } = useContext(AuthContext)
    const location = useLocation()
    const navigate = useNavigate()

    const from = location.state?.from?.pathname || '/'

    const handleLogin = async (event) => {
        event.preventDefault()
        setLoading(true)
        setErrorMessage('')
        const form = event.target
        const email = form.email.value
        const password = form.password.value
        try {
            await login(email, password)
            navigate(from, { replace: true })
        } catch (error) {
            setErrorMessage(error.message || 'Invalid email or password')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[100dvh] bg-[#f8f7f4] flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-[440px]">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
                            <FaBook className="text-white text-2xl" />
                        </div>
                        <span className="font-semibold text-3xl tracking-[-1px]">FolioFid</span>
                    </div>
                    <h1 className="text-4xl tracking-[-1.5px] font-semibold">Welcome back</h1>
                    <p className="mt-2 text-gray-600">Sign in to continue your reading journey</p>
                </div>

                <div className="card p-8 md:p-10">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-700">Email address</label>
                            <input 
                                id="email" name="email" type="email" 
                                className="input-field" 
                                placeholder="you@reading.com" 
                                required 
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-700">Password</label>
                            <input 
                                id="password" name="password" type="password" 
                                className="input-field" 
                                placeholder="••••••••" 
                                required 
                            />
                        </div>

                        {errorMessage && (
                            <div className="text-red-600 text-sm bg-red-50 border border-red-100 px-4 py-2.5 rounded-2xl">
                                {errorMessage}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="btn-primary w-full text-base py-4"
                        >
                            {loading ? 'Signing you in...' : 'Sign in to FolioFid'}
                        </button>

                        <p className="text-center text-sm text-gray-600 pt-2">
                            New here?{' '}
                            <Link to="/create-user" className="font-semibold text-emerald-700 hover:underline">Create an account</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}