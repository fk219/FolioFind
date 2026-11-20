import { useCallback, useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaArrowRight, FaPlus, FaTrashCan } from 'react-icons/fa6'
import { AuthContext } from '../contexts/AuthProvider'
import { listMyBooks, updateBookStatus, deleteBook } from '../api/books'
import BookCover from '../components/BookCover'

const STATUS_TONE = {
  available: 'border-olive/40 bg-olive/10 text-olive',
  sold: 'border-oxblood/30 bg-oxblood/5 text-oxblood',
  pending: 'border-brass/40 bg-brass/10 text-[#705626]'
}

export default function MyListings() {
  const { token, user } = useContext(AuthContext)
  const location = useLocation()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actingId, setActingId] = useState('')
  const [pendingDeleteId, setPendingDeleteId] = useState('')
  const [message, setMessage] = useState('')

  const fetchBooks = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await listMyBooks({ token })
      setBooks(data)
    } catch (err) {
      setError(err.message || 'Failed to load listings')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (token) fetchBooks()
    else setLoading(false)
  }, [token, fetchBooks])

  async function handleStatus(id, status) {
    setActingId(id)
    setError('')
    setMessage('')
    try {
      await updateBookStatus({ token, id, status })
      setMessage(`Listing marked ${status}.`)
      await fetchBooks()
    } catch (err) {
      setError(err.message || 'Failed to update status')
    } finally {
      setActingId('')
    }
  }

  async function handleDelete(id) {
    setActingId(id)
    setError('')
    setMessage('')
    try {
      await deleteBook({ token, id })
      setPendingDeleteId('')
      setMessage('Listing removed.')
      await fetchBooks()
    } catch (err) {
      setError(err.message || 'Failed to delete listing')
    } finally {
      setActingId('')
    }
  }

  if (!user) {
    return (
      <div className="bg-paper">
        <div className="container-bookshop flex min-h-[65vh] items-center py-16">
          <div className="max-w-xl">
            <p className="eyebrow">My listings / Account required</p>
            <h1 className="mt-4 font-display text-[clamp(2.8rem,5vw,4.6rem)] font-light leading-[0.92] tracking-[-0.04em] text-ink">
              The books you are passing on.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted">
              Sign in to see and manage the copies you have listed.
            </p>
            <Link to="/login" state={{ from: location }} className="btn-primary mt-7">
              Sign in
              <FaArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-paper">
      <section className="container-bookshop pb-16 pt-12 lg:pb-24 lg:pt-16">
        <div className="flex flex-col justify-between gap-7 border-b border-line pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">My listings</p>
            <h1 className="mt-4 font-display text-[clamp(2.8rem,5.4vw,5rem)] font-light leading-[0.9] tracking-[-0.04em] text-ink">
              Your <span className="italic text-oxblood">listings.</span>
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
              {books.length} {books.length === 1 ? 'copy' : 'copies'} listed. Mark a copy sold to take it off the public shelves.
            </p>
          </div>
          <Link to="/sell" className="btn-primary">
            <FaPlus className="h-3 w-3" aria-hidden="true" />
            List a book
          </Link>
        </div>

        {error && (
          <p className="mt-6 border border-oxblood/30 bg-oxblood/5 px-4 py-3 text-sm text-oxblood" role="alert">
            {error}
          </p>
        )}
        {message && (
          <p className="mt-6 border border-olive/30 bg-olive/5 px-4 py-3 text-sm text-olive" role="status">
            {message}
          </p>
        )}

        {loading ? (
          <div className="mt-8 space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-32 animate-pulse border border-line bg-white/60" />
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="mt-8 border border-line bg-white/60 px-6 py-16 text-center">
            <p className="eyebrow">No listings yet</p>
            <p className="mt-4 font-display text-3xl text-ink">Your shelf is waiting for a book.</p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
              List a copy with its edition, condition, and a note. It will appear in the public catalogue.
            </p>
            <Link to="/sell" className="btn-primary mt-6">
              List your first book
            </Link>
          </div>
        ) : (
          <div className="mt-8 border-t border-line">
            {books.map((book) => (
              <article key={book._id} className="grid gap-5 border-b border-line py-6 sm:grid-cols-[5rem_1fr_auto] sm:items-start">
                <Link to={`/book/${book._id}`} className="block h-28 w-20 bg-[#EFE6D2] p-2" aria-label={`View ${book.bookTitle}`}>
                  <BookCover title={book.bookTitle} author={book.authorName} src={book.imageURL} compact />
                </Link>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] ${STATUS_TONE[book.status] || 'border-line bg-paper text-muted'}`}>
                      {book.status}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted">{book.category}</span>
                  </div>
                  <Link to={`/book/${book._id}`} className="mt-2 block font-display text-2xl leading-tight text-ink transition-colors hover:text-oxblood">
                    {book.bookTitle}
                  </Link>
                  <p className="mt-1 text-sm text-muted">{book.authorName}</p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                    ${Number(book.price).toFixed(2)} · {book.condition}
                  </p>
                  {book.conditionNote && (
                    <p className="mt-1 line-clamp-1 max-w-xl text-xs leading-relaxed text-muted">
                      {book.conditionNote}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-start gap-3 sm:flex-col sm:items-end">
                  <Link to={`/book/${book._id}`} className="btn-outline min-h-9 px-3 py-1.5">
                    View
                  </Link>
                  {book.status !== 'sold' && (
                    <button
                      type="button"
                      onClick={() => void handleStatus(book._id, 'sold')}
                      disabled={actingId === book._id}
                      className="min-h-9 border border-oxblood/30 bg-white px-3 font-mono text-[9px] uppercase tracking-[0.1em] text-oxblood transition-colors hover:bg-oxblood/5 disabled:opacity-50"
                    >
                      Mark sold
                    </button>
                  )}
                  {book.status === 'sold' && (
                    <button
                      type="button"
                      onClick={() => void handleStatus(book._id, 'available')}
                      disabled={actingId === book._id}
                      className="min-h-9 border border-line bg-white px-3 font-mono text-[9px] uppercase tracking-[0.1em] text-ink transition-colors hover:border-ink disabled:opacity-50"
                    >
                      Relist
                    </button>
                  )}

                  {pendingDeleteId === book._id ? (
                    <div className="flex flex-col items-end gap-1">
                      <button
                        type="button"
                        onClick={() => void handleDelete(book._id)}
                        disabled={actingId === book._id}
                        className="font-mono text-[9px] uppercase tracking-[0.1em] text-oxblood underline underline-offset-4 disabled:opacity-50"
                      >
                        {actingId === book._id ? 'Removing…' : 'Confirm delete'}
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
      </section>
    </div>
  )
}
