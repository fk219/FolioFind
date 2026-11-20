import { useContext, useState } from 'react'
import { Link, useLoaderData, useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthProvider'
import { updateBook } from '../api/books'
import BookForm from './BookForm'

export default function EditBooks() {
  const bookData = useLoaderData() || {}
  const { token } = useContext(AuthContext)
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (payload) => {
    setBusy(true)
    setError('')
    setMessage('')
    try {
      await updateBook({ token, id: bookData._id, patch: payload })
      setMessage('Copy updated.')
    } catch (err) {
      setError(err.message || 'The copy could not be updated.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="px-5 py-8 sm:px-8 xl:px-12">
      <header className="border-b border-line pb-8">
        <p className="eyebrow">Shop ledger / Edit copy</p>
        <h1 className="mt-4 max-w-[16ch] font-display text-[clamp(2.4rem,4.6vw,4.2rem)] font-light leading-[0.92] tracking-[-0.04em] text-ink">
          {bookData.bookTitle || 'Edit a book'}
        </h1>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
          Update the public record for this copy. Changes appear on the shop immediately.
        </p>
        <Link to="/admin/dashboard/manage" className="link-line mt-4 inline-block font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
          Back to inventory
        </Link>
      </header>

      <div className="mt-8 max-w-4xl">
        <BookForm
          initial={bookData}
          submitLabel="Save changes"
          busyLabel="Saving…"
          busy={busy}
          error={error}
          message={message}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/admin/dashboard/manage')}
        />
      </div>
    </div>
  )
}
