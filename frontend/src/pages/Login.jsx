import { useContext, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa6'
import { AuthContext } from '../contexts/AuthProvider'
import AuthFrame from '../components/AuthFrame'

export default function Login() {
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useContext(AuthContext)
  const location = useLocation()
  const navigate = useNavigate()

  const from = location.state?.from?.pathname || '/reading-room'

  const handleLogin = async (event) => {
    event.preventDefault()
    setLoading(true)
    setErrorMessage('')
    const form = event.target
    try {
      await login(form.email.value.trim(), form.password.value)
      navigate(from, { replace: true })
    } catch (error) {
      setErrorMessage(error.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthFrame
      eyebrow="Reader sign in"
      title="Come back to your shelf."
      description="Your reading room, listings, and account in one place."
    >
      <form onSubmit={handleLogin} className="mt-8 max-w-md space-y-5">
        <div>
          <label htmlFor="email" className="field-label">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className="input-field mt-2"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="field-label">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className="input-field mt-2 pr-12"
              placeholder="Your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-0 top-2 flex h-12 w-12 items-center justify-center text-muted transition-colors hover:text-ink"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEyeSlash className="h-4 w-4" aria-hidden="true" /> : <FaEye className="h-4 w-4" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {errorMessage && (
          <p className="border border-oxblood/30 bg-oxblood/5 px-4 py-3 text-sm text-oxblood" role="alert">
            {errorMessage}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        <p className="text-sm text-muted">
          New here?{' '}
          <Link to="/create-user" state={location.state} className="link-line font-medium text-oxblood">
            Create an account
          </Link>
        </p>
      </form>

      <div className="mt-8 max-w-md border border-line bg-paper p-4">
        <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-oxblood">Seeded demo administrator</p>
        <dl className="mt-3 space-y-1.5 font-mono text-[11px] text-ink">
          <div className="flex flex-wrap gap-x-2">
            <dt className="text-muted">Email</dt>
            <dd>admin@example.com</dd>
          </div>
          <div className="flex flex-wrap gap-x-2">
            <dt className="text-muted">Password</dt>
            <dd>admin123</dd>
          </div>
        </dl>
        <p className="mt-3 text-[11px] leading-relaxed text-muted">
          Reader accounts can be created from the link above. Demo data only.
        </p>
      </div>
    </AuthFrame>
  )
}
