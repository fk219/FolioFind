import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthProvider'
import { createBook } from '../api/books'
import BookForm from './BookForm'

export default function UploadBook() {
  const { token } = useContext(AuthContext)
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (payload) => {
    setBusy(true)
    setError('')
    try {
      await createBook({ token, book: payload })
      navigate('/admin/dashboard/manage')
    } catch (err) {
      setError(err.message || 'The book could not be uploaded.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="px-5 py-8 sm:px-8 xl:px-12">
      <header className="border-b border-line pb-8">
        <p className="eyebrow">Shop ledger / New copy</p>
        <h1 className="mt-4 font-display text-[clamp(2.4rem,4.6vw,4.2rem)] font-light leading-[0.92] tracking-[-0.04em] text-ink">
          Upload a <span className="italic text-oxblood">book.</span>
        </h1>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
          Add a copy to the public catalogue. Include the edition, condition, and a specific note for
          the reader who takes it home.
        </p>
        <Link to="/admin/dashboard/manage" className="link-line mt-4 inline-block font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
          Back to inventory
        </Link>
      </header>

      <div className="mt-8 max-w-4xl">
        <BookForm
          submitLabel="Publish book"
          busyLabel="Publishing…"
          busy={busy}
          error={error}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
