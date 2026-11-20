import { useCallback, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaPen, FaPlus, FaTrashCan } from 'react-icons/fa6'
import { AuthContext } from '../contexts/AuthProvider'
import { deleteBook, listBooks } from '../api/books'
import BookCover from '../components/BookCover'

export default function ManageBooks() {
  const { token } = useContext(AuthContext)
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [pendingDeleteId, setPendingDeleteId] = useState('')
  const [deletingId, setDeletingId] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const result = await listBooks({ limit: 100 })
      setBooks(result.books || [])
    } catch {
      setError('The inventory could not be loaded.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const handleDelete = async (id) => {
    setDeletingId(id)
    setError('')
    setMessage('')
    try {
      await deleteBook({ token, id })
      setPendingDeleteId('')
      setMessage('Book removed from the catalogue.')
      await load()
    } catch {
      setError('Delete failed.')
    } finally {
      setDeletingId('')
    }
  }

  return (
    <div className="px-5 py-8 sm:px-8 xl:px-12">
      <header className="flex flex-col justify-between gap-6 border-b border-line pb-8 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Shop ledger / Inventory</p>
          <h1 className="mt-4 font-display text-[clamp(2.4rem,4.6vw,4.2rem)] font-light leading-[0.92] tracking-[-0.04em] text-ink">
            Manage the <span className="italic text-oxblood">shelves.</span>
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
            {loading ? 'Counting copies…' : `${books.length} copies in the public catalogue.`}
          </p>
        </div>
        <Link to="/admin/dashboard/upload" className="btn-primary">
          <FaPlus className="h-3 w-3" aria-hidden="true" />
          Add a book
        </Link>
      </header>

      {error && (
        <p className="mt-6 border border-oxblood/30 bg-oxblood/5 px-4 py-3 text-sm text-oxblood" role="alert">{error}</p>
      )}
      {message && (
        <p className="mt-6 border border-olive/30 bg-olive/5 px-4 py-3 text-sm text-olive" role="status">{message}</p>
      )}

      {loading ? (
        <div className="mt-8 space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-24 animate-pulse border border-line bg-white/60" />
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="mt-8 border border-line bg-white/60 px-6 py-16 text-center">
          <p className="eyebrow">Empty catalogue</p>
          <p className="mt-3 font-display text-3xl text-ink">No books on the shelves.</p>
          <Link to="/admin/dashboard/upload" className="btn-primary mt-6">Upload the first book</Link>
        </div>
      ) : (
        <div className="mt-8">
          <div className="hidden grid-cols-[3rem_1fr_8rem_7rem_7rem] gap-4 border-b border-line pb-3 font-mono text-[9px] uppercase tracking-[0.12em] text-muted lg:grid">
            <span>No.</span>
            <span>Book</span>
            <span>Category</span>
            <span>Price / condition</span>
            <span className="text-right">Actions</span>
          </div>

          {books.map((book, index) => (
            <article key={book._id} className="grid gap-4 border-b border-line py-5 lg:grid-cols-[3rem_1fr_8rem_7rem_7rem] lg:items-center">
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.1em] text-muted lg:block">
                {String(index + 1).padStart(2, '0')}
              </span>

              <div className="flex min-w-0 items-center gap-4">
                <div className="h-20 w-14 shrink-0 bg-[#EFE6D2] p-1">
                  <BookCover title={book.bookTitle} author={book.authorName} src={book.imageURL} compact />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-display text-xl leading-tight text-ink">{book.bookTitle}</p>
                  <p className="mt-0.5 truncate text-sm text-muted">{book.authorName}</p>
                  <div className="mt-1.5 flex flex-wrap gap-3 font-mono text-[9px] uppercase tracking-[0.1em] text-muted">
                    <span className="lg:hidden">{book.category}</span>
                    <span className="lg:hidden">${Number(book.price || 0).toFixed(2)}</span>
                    <span>{book.status}</span>
                  </div>
                </div>
              </div>

              <span className="hidden font-mono text-[10px] uppercase tracking-[0.1em] text-muted lg:block">{book.category}</span>
              <div className="hidden lg:block">
                <p className="font-mono text-sm tabular-nums text-ink">${Number(book.price || 0).toFixed(2)}</p>
                <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-muted">{book.condition}</p>
              </div>

              <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                <Link to={`/admin/dashboard/edit-books/${book._id}`} className="btn-outline min-h-9 px-3 py-1.5">
                  <FaPen className="h-2.5 w-2.5" aria-hidden="true" />
                  Edit
                </Link>
                {pendingDeleteId === book._id ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => void handleDelete(book._id)}
                      disabled={deletingId === book._id}
                      className="font-mono text-[9px] uppercase tracking-[0.1em] text-oxblood underline underline-offset-4 disabled:opacity-50"
                    >
                      {deletingId === book._id ? 'Deleting…' : 'Confirm'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingDeleteId('')}
                      className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted underline underline-offset-4"
                    >
                      Keep
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setPendingDeleteId(book._id)}
                    aria-label={`Delete ${book.bookTitle}`}
                    className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-oxblood"
                  >
                    <FaTrashCan className="h-3 w-3" aria-hidden="true" />
                    Delete
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Link to="/shop" className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted hover:text-ink">
          View public shelves
          <FaArrowRight className="h-2.5 w-2.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}
