import { useContext, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa6'
import { AuthContext } from '../contexts/AuthProvider'
import AuthFrame from '../components/AuthFrame'

export default function Signup() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '' })
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { createUser } = useContext(AuthContext)
  const location = useLocation()
  const navigate = useNavigate()

  const from = location.state?.from?.pathname || '/reading-room'

  const handleChange = (event) => {
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }))
  }

  const handleSignup = async (event) => {
    event.preventDefault()
    setErrorMessage('')

    if (form.password !== form.confirm) {
      setErrorMessage('The passwords do not match.')
      return
    }
    if (form.password.length < 8) {
      setErrorMessage('Use at least 8 characters for the password.')
      return
    }

    setLoading(true)
    try {
      await createUser(form.email.trim(), form.password, form.fullName.trim())
      navigate(from, { replace: true })
    } catch (error) {
      setErrorMessage(error.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthFrame
      eyebrow="New reader"
      title="Open your reading room."
      description="Create an account to keep a shelf, list books, and return to the copies you were considering."
    >
      <form onSubmit={handleSignup} className="mt-8 max-w-md space-y-5">
        <div>
          <label htmlFor="fullName" className="field-label">
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            value={form.fullName}
            onChange={handleChange}
            className="input-field mt-2"
            placeholder="Your name"
            required
            maxLength={100}
          />
        </div>

        <div>
          <label htmlFor="email" className="field-label">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
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
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              className="input-field mt-2 pr-12"
              placeholder="At least 8 characters"
              required
              minLength={8}
              maxLength={128}
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

        <div>
          <label htmlFor="confirm" className="field-label">
            Confirm password
          </label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            autoComplete="new-password"
            value={form.confirm}
            onChange={handleChange}
            className="input-field mt-2"
            placeholder="Repeat the password"
            required
            minLength={8}
            maxLength={128}
          />
        </div>

        {errorMessage && (
          <p className="border border-oxblood/30 bg-oxblood/5 px-4 py-3 text-sm text-oxblood" role="alert">
            {errorMessage}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
          {loading ? 'Creating the account…' : 'Create account'}
        </button>

        <p className="text-sm text-muted">
          Already have an account?{' '}
          <Link to="/login" state={location.state} className="link-line font-medium text-oxblood">
            Sign in
          </Link>
        </p>
      </form>

      <p className="mt-8 max-w-md border-t border-line pt-4 font-mono text-[9px] uppercase leading-relaxed tracking-[0.12em] text-muted">
        Demo accounts only · Do not enter personal or payment information
      </p>
    </AuthFrame>
  )
}
