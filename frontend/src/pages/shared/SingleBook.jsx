import { useContext, useEffect, useState } from 'react'
import { Link, useLoaderData, useLocation, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaArrowRight, FaEnvelope, FaPlus, FaTrashCan } from 'react-icons/fa6'
import { AuthContext } from '../../contexts/AuthProvider'
import { ShelfContext } from '../../contexts/ShelfProvider'
import BookCover from '../../components/BookCover'

const STATUS_OPTIONS = [
  { value: 'want-to-read', label: 'Want to read' },
  { value: 'reading', label: 'Reading' },
  { value: 'finished', label: 'Finished' }
]

const conditionTone = {
  New: 'border-olive/40 bg-olive/10 text-olive',
  'Like New': 'border-olive/40 bg-olive/10 text-olive',
  Good: 'border-brass/40 bg-brass/10 text-[#705626]',
  Acceptable: 'border-oxblood/30 bg-oxblood/5 text-oxblood'
}

const SingleBook = () => {
  const data = useLoaderData()
  const { user } = useContext(AuthContext)
  const { getItem, save, remove, loading: shelfLoading } = useContext(ShelfContext)
  const navigate = useNavigate()
  const location = useLocation()

  const shelfItem = getItem(data._id)
  const [status, setStatus] = useState('')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [confirmRemove, setConfirmRemove] = useState(false)

  useEffect(() => {
    setStatus(shelfItem?.shelf?.status || '')
    setNote(shelfItem?.shelf?.note || '')
  }, [shelfItem?.shelf?.status, shelfItem?.shelf?.note])

  const saveToShelf = async (nextStatus) => {
    if (!user) {
      navigate('/login', { state: { from: location } })
      return
    }
    setSaving(true)
    setError('')
    setMessage('')
    try {
      await save(data._id, nextStatus, note)
      setStatus(nextStatus)
      const option = STATUS_OPTIONS.find((item) => item.value === nextStatus)
      setMessage(`Saved to ${option?.label || 'your shelf'}.`)
    } catch {
      setError('Could not update your shelf. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const saveNote = async () => {
    if (!status) return
    setSaving(true)
    setError('')
    setMessage('')
    try {
      await save(data._id, status, note)
      setMessage('Note saved.')
    } catch {
      setError('Could not save the note.')
    } finally {
      setSaving(false)
    }
  }

  const removeFromShelf = async () => {
    setSaving(true)
    setError('')
    setMessage('')
    try {
      await remove(data._id)
      setStatus('')
      setNote('')
      setConfirmRemove(false)
      setMessage('Removed from your reading room.')
    } catch {
      setError('Could not remove this book.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-paper">
      <div className="container-bookshop pb-16 pt-8 lg:pb-24 lg:pt-12">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink"
        >
          <FaArrowLeft className="h-3 w-3" aria-hidden="true" />
          Back to the shelves
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <div className="border border-line bg-[#EFE6D2] p-8 sm:p-12">
              <div className="mx-auto aspect-[4/5] max-w-[20rem]">
                <BookCover title={data.bookTitle} author={data.authorName} src={data.imageURL} eager />
              </div>
            </div>
            <dl className="mt-5 grid grid-cols-2 border border-line bg-white/60">
              <div className="border-b border-r border-line p-4">
                <dt className="field-label">Condition</dt>
                <dd className="mt-1.5 text-sm text-ink">{data.condition || 'Not graded'}</dd>
              </div>
              <div className="border-b border-line p-4">
                <dt className="field-label">Pages</dt>
                <dd className="mt-1.5 font-mono text-sm tabular-nums text-ink">{data.pages || 'Not listed'}</dd>
              </div>
              <div className="border-r border-line p-4">
                <dt className="field-label">Edition</dt>
                <dd className="mt-1.5 text-sm text-ink">{data.edition || 'Not listed'}</dd>
              </div>
              <div className="p-4">
                <dt className="field-label">Published</dt>
                <dd className="mt-1.5 font-mono text-sm tabular-nums text-ink">
                  {data.publishedYear || 'Not listed'}
                </dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center gap-2">
              {data.category && <span className="badge">{data.category}</span>}
              {data.condition && (
                <span className={`border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] ${conditionTone[data.condition] || 'border-line bg-paper text-muted'}`}>
                  {data.condition}
                </span>
              )}
              {data.status && (
                <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
                  {data.status === 'available' ? 'Available copy' : data.status}
                </span>
              )}
            </div>

            <h1 className="mt-5 max-w-[17ch] font-display text-[clamp(2.8rem,5.5vw,5.2rem)] font-light leading-[0.9] tracking-[-0.045em] text-ink">
              {data.bookTitle}
            </h1>
            <p className="mt-3 text-lg text-muted">by {data.authorName}</p>

            {data.price != null && (
              <p className="mt-6 font-mono text-3xl tabular-nums text-oxblood">${Number(data.price).toFixed(2)}</p>
            )}

            <div className="mt-8 border-t border-line pt-6">
              <p className="field-label">About this book</p>
              <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted">
                {data.bookDescription || 'The seller has not added a description for this copy yet.'}
              </p>
            </div>

            {data.conditionNote && (
              <div className="mt-7 border-l-2 border-brass bg-white/50 px-5 py-4">
                <p className="field-label">This copy</p>
                <p className="mt-2 text-sm italic leading-relaxed text-ink">{data.conditionNote}</p>
              </div>
            )}

            <div className="mt-8 border border-line bg-white/60">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
                <div>
                  <p className="field-label">Seller</p>
                  <p className="mt-1 text-sm text-ink">{data.sellerName || 'FolioFind desk'}</p>
                </div>
                {data.status === 'available' && data.sellerEmail && user?.email !== data.sellerEmail && (
                  <a
                    href={`mailto:${data.sellerEmail}?subject=${encodeURIComponent(`Interested in ${data.bookTitle}`)}`}
                    className="btn-outline min-h-10 px-3 py-2"
                  >
                    <FaEnvelope className="h-3.5 w-3.5" aria-hidden="true" />
                    Email the seller
                  </a>
                )}
                {user?.email === data.sellerEmail && (
                  <Link to="/my-listings" className="btn-outline min-h-10 px-3 py-2">
                    Your listing
                  </Link>
                )}
              </div>
              <p className="px-5 py-3 font-mono text-[9px] uppercase leading-relaxed tracking-[0.12em] text-muted">
                Seeded demo marketplace · Seller contact is illustrative
              </p>
            </div>

            <div className="mt-8 border border-line bg-white/60">
              <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
                <div>
                  <p className="field-label">Your reading room</p>
                  <p className="mt-1 text-sm text-muted">
                    {shelfLoading ? 'Checking your shelf…' : status ? 'This copy is on your shelf.' : 'Keep this copy on one of three shelves.'}
                  </p>
                </div>
                {status && (
                  <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-olive">On your shelf</span>
                )}
              </div>

              <div className="p-5">
                {!user ? (
                  <div>
                    <p className="text-sm leading-relaxed text-muted">
                      Sign in to add this copy to your reading room. Your shelf is stored with your account.
                    </p>
                    <Link to="/login" state={{ from: location }} className="btn-primary mt-4">
                      Sign in to keep it
                      <FaArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="grid gap-2 sm:grid-cols-3" role="group" aria-label="Shelf status">
                      {STATUS_OPTIONS.map((option) => {
                        const active = status === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => void saveToShelf(option.value)}
                            disabled={saving}
                            aria-pressed={active}
                            className={`min-h-11 border px-3 py-2 font-mono text-[9px] uppercase tracking-[0.12em] transition-colors disabled:opacity-50 ${
                              active
                                ? 'border-oxblood bg-oxblood text-paper'
                                : 'border-line bg-paper text-ink hover:border-ink'
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-5">
                      <label htmlFor="shelf-note" className="field-label">
                        Private note <span className="normal-case tracking-normal text-muted">(optional)</span>
                      </label>
                      <textarea
                        id="shelf-note"
                        rows={2}
                        maxLength={280}
                        value={note}
                        onChange={(event) => setNote(event.target.value)}
                        disabled={!status}
                        className="input-field mt-2 resize-y text-sm disabled:cursor-not-allowed disabled:opacity-60"
                        placeholder={status ? 'A line for your own shelf — where you found it, what to remember.' : 'Choose a shelf before adding a note.'}
                      />
                      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted tabular-nums">
                          {note.length} / 280
                        </span>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => void saveNote()}
                            disabled={!status || saving}
                            className="font-mono text-[9px] uppercase tracking-[0.12em] text-oxblood underline underline-offset-4 disabled:opacity-40"
                          >
                            Save note
                          </button>
                          {status && !confirmRemove && (
                            <button
                              type="button"
                              onClick={() => setConfirmRemove(true)}
                              className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-oxblood"
                            >
                              <FaTrashCan className="h-3 w-3" aria-hidden="true" />
                              Remove
                            </button>
                          )}
                        </div>
                      </div>

                      {confirmRemove && (
                        <div className="mt-3 border border-oxblood/30 bg-oxblood/5 p-3">
                          <p className="text-sm text-ink">Remove this copy from your reading room?</p>
                          <div className="mt-2 flex gap-2">
                            <button
                              type="button"
                              onClick={() => void removeFromShelf()}
                              disabled={saving}
                              className="min-h-9 bg-oxblood px-3 font-mono text-[9px] uppercase tracking-[0.12em] text-paper disabled:opacity-50"
                            >
                              Yes, remove
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmRemove(false)}
                              className="min-h-9 border border-line bg-white px-3 font-mono text-[9px] uppercase tracking-[0.12em] text-ink"
                            >
                              Keep it
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {message && <p className="mt-3 text-sm text-olive" role="status">{message}</p>}
                    {error && <p className="mt-3 text-sm text-oxblood" role="alert">{error}</p>}
                  </>
                )}
              </div>
            </div>

            {status && (
              <Link to="/reading-room" className="mt-3 inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-muted hover:text-ink">
                <FaPlus className="h-2.5 w-2.5" aria-hidden="true" />
                Open your reading room
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleBook
