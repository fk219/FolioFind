import { useContext, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaArrowRight, FaPen, FaTrashCan } from 'react-icons/fa6'
import { AuthContext } from '../contexts/AuthProvider'
import { ShelfContext } from '../contexts/ShelfProvider'
import BookCover from '../components/BookCover'

const SHELVES = [
  { status: 'want-to-read', label: 'Want to read', note: 'The books you are keeping an eye on.' },
  { status: 'reading', label: 'Reading', note: 'The ones currently on the bedside table.' },
  { status: 'finished', label: 'Finished', note: 'Read, remembered, or ready to pass on.' }
]

const spinePalettes = [
  { bg: '#6B2A2A', text: '#F4EEDF' },
  { bg: '#5C6245', text: '#F4EEDF' },
  { bg: '#B38B4D', text: '#1E1A16' },
  { bg: '#2F3A3A', text: '#F4EEDF' },
  { bg: '#8A5A32', text: '#F4EEDF' },
  { bg: '#3E2F28', text: '#F4EEDF' }
]

function Shelf({ shelf, books }) {
  return (
    <section className="border border-paper/15 bg-[#211712] text-paper" aria-labelledby={`shelf-${shelf.status}`}>
      <div className="flex items-baseline justify-between gap-3 border-b border-paper/10 px-5 py-4">
        <h2 id={`shelf-${shelf.status}`} className="font-display text-2xl font-light">
          {shelf.label}
        </h2>
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-paper/40 tabular-nums">
          {books.length}
        </span>
      </div>

      <div className="px-4 pt-6">
        {books.length === 0 ? (
          <div className="mb-4 flex h-[9.5rem] items-center justify-center border border-dashed border-paper/15 px-4 text-center">
            <p className="max-w-[16ch] text-xs leading-relaxed text-paper/35">{shelf.note}</p>
          </div>
        ) : (
          <div className="overflow-x-auto pb-1">
            <div className="flex min-w-max items-end gap-2 px-1">
              {books.map((book, index) => {
                const palette = spinePalettes[index % spinePalettes.length]
                const height = Math.min(13, Math.max(8.5, (book.pages || 280) / 46))
                return (
                  <Link
                    key={book._id}
                    to={`/book/${book._id}`}
                    className="spine"
                    style={{
                      '--spine-height': `${height}rem`,
                      '--spine-width': index % 3 === 0 ? '2.6rem' : '2.25rem',
                      backgroundColor: palette.bg,
                      color: palette.text
                    }}
                    aria-label={`${book.bookTitle} by ${book.authorName}`}
                  >
                    <span className="spine-title">{book.bookTitle}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
        <div className="shelf-plank" />
      </div>

      {books.length > 0 && (
        <p className="px-5 py-4 text-xs leading-relaxed text-paper/45">{shelf.note}</p>
      )}
    </section>
  )
}

export default function ReadingRoom() {
  const { user } = useContext(AuthContext)
  const { items, counts, loading, error, refresh, save, remove } = useContext(ShelfContext)
  const location = useLocation()
  const [editingId, setEditingId] = useState('')
  const [draftNote, setDraftNote] = useState('')
  const [savingId, setSavingId] = useState('')
  const [pendingRemoveId, setPendingRemoveId] = useState('')
  const [message, setMessage] = useState('')
  const [actionError, setActionError] = useState('')

  if (!user) {
    return (
      <div className="bg-paper">
        <section className="container-bookshop py-16 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <p className="eyebrow">Reading room / Account required</p>
              <h1 className="mt-5 max-w-[12ch] font-display text-[clamp(3.2rem,7vw,6.4rem)] font-light leading-[0.88] tracking-[-0.05em] text-ink">
                A room for the books you <span className="italic text-oxblood">mean</span> to read.
              </h1>
              <p className="mt-7 max-w-xl text-base leading-relaxed text-muted">
                Sign in to keep a shelf of books you want to read, are reading, or have finished. Add
                a private note, move a copy between shelves, and come back to it later.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/login" state={{ from: location }} className="btn-primary">
                  Sign in
                  <FaArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
                <Link to="/create-user" className="btn-outline">
                  Create an account
                </Link>
              </div>
              <p className="mt-6 font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-muted">
                Your shelf is stored with your account. Demo data only.
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="border border-paper/15 bg-[#211712] p-5 text-paper">
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-paper/40">A reading room, waiting</p>
                <div className="mt-6 space-y-4">
                  {SHELVES.map((shelf) => (
                    <div key={shelf.status}>
                      <div className="flex h-14 items-end gap-1.5 px-1">
                        {Array.from({ length: 7 }).map((_, index) => (
                          <div
                            key={index}
                            className="w-3 border border-paper/10 bg-paper/5"
                            style={{ height: `${2.2 + ((index * 13) % 38) / 10}rem` }}
                          />
                        ))}
                      </div>
                      <div className="shelf-plank" />
                      <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.14em] text-paper/35">
                        {shelf.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  const displayName = user.fullName?.trim() || user.email.split('@')[0]

  const startEdit = (item) => {
    setEditingId(item._id)
    setDraftNote(item.shelf.note || '')
    setMessage('')
    setActionError('')
  }

  const saveNote = async (item) => {
    setSavingId(item._id)
    setActionError('')
    setMessage('')
    try {
      await save(item._id, item.shelf.status, draftNote)
      setEditingId('')
      setMessage('Note saved.')
    } catch {
      setActionError('Could not save the note.')
    } finally {
      setSavingId('')
    }
  }

  const changeStatus = async (item, status) => {
    setSavingId(item._id)
    setActionError('')
    setMessage('')
    try {
      await save(item._id, status, item.shelf.note || '')
      setMessage('Shelf updated.')
    } catch {
      setActionError('Could not move this book.')
    } finally {
      setSavingId('')
    }
  }

  const confirmRemove = async (item) => {
    setSavingId(item._id)
    setActionError('')
    setMessage('')
    try {
      await remove(item._id)
      setPendingRemoveId('')
      setMessage('Removed from your reading room.')
    } catch {
      setActionError('Could not remove this book.')
    } finally {
      setSavingId('')
    }
  }

  const total = counts['want-to-read'] + counts.reading + counts.finished

  return (
    <div className="bg-paper">
      <section className="container-bookshop pb-12 pt-12 lg:pt-16">
        <div className="flex flex-col justify-between gap-8 border-b border-line pb-9 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow">Reading room / {displayName}</p>
            <h1 className="mt-4 max-w-[12ch] font-display text-[clamp(3rem,6vw,5.4rem)] font-light leading-[0.9] tracking-[-0.045em] text-ink">
              Your <span className="italic text-oxblood">reading</span> room.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
              Three shelves, one account. Move a book as your reading changes, or leave a private note
              for the copy on your table.
            </p>
          </div>
          <Link to="/shop" className="btn-primary">
            Find another book
            <FaArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        <dl className="grid grid-cols-2 border-b border-line sm:grid-cols-4">
          {[
            { label: 'Total', value: total },
            ...SHELVES.map((shelf) => ({ label: shelf.label, value: counts[shelf.status] }))
          ].map((stat) => (
            <div key={stat.label} className="border-b border-line py-5 pr-4 sm:border-b-0 sm:border-r sm:px-5 sm:first:pl-0 sm:last:border-r-0">
              <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">{stat.label}</dt>
              <dd className="mt-1.5 font-display text-3xl tabular-nums text-ink">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="container-bookshop pb-16" aria-label="Your shelves">
        {loading ? (
          <div className="grid gap-5 lg:grid-cols-3">
            {SHELVES.map((shelf) => (
              <div key={shelf.status} className="h-[20rem] animate-pulse border border-line bg-parchment/60" />
            ))}
          </div>
        ) : error ? (
          <div className="border border-line bg-white/60 p-8">
            <p className="font-display text-2xl text-ink">Your reading room could not be loaded.</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">The shelf request failed. Try again.</p>
            <button type="button" onClick={() => void refresh()} className="btn-outline mt-5">
              Retry
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="border border-line bg-white/60 px-6 py-16 text-center">
            <p className="eyebrow">Nothing on the shelves yet</p>
            <p className="mt-4 font-display text-3xl text-ink">Your reading room is empty.</p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
              Open any book and choose Want to read, Reading, or Finished. It will appear here.
            </p>
            <Link to="/shop" className="btn-primary mt-6">
              Browse the shelves
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-5 lg:grid-cols-3">
              {SHELVES.map((shelf) => (
                <Shelf
                  key={shelf.status}
                  shelf={shelf}
                  books={items.filter((item) => item.shelf.status === shelf.status)}
                />
              ))}
            </div>

            <div className="mt-14">
              <div className="flex flex-col justify-between gap-3 border-b border-line pb-4 sm:flex-row sm:items-baseline">
                <h2 className="font-display text-3xl font-light text-ink">The record</h2>
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
                  Status and private notes
                </p>
              </div>

              {(message || actionError) && (
                <p
                  className={`mt-4 text-sm ${actionError ? 'text-oxblood' : 'text-olive'}`}
                  role={actionError ? 'alert' : 'status'}
                >
                  {actionError || message}
                </p>
              )}

              <div>
                {items.map((item) => (
                  <article key={item._id} className="grid gap-4 border-b border-line py-5 sm:grid-cols-[4rem_1fr_auto] sm:items-start">
                    <Link to={`/book/${item._id}`} className="block h-24 w-16 bg-[#EFE6D2] p-1.5" aria-label={`Open ${item.bookTitle}`}>
                      <BookCover title={item.bookTitle} author={item.authorName} src={item.imageURL} className="object-contain" compact />
                    </Link>

                    <div className="min-w-0">
                      <Link to={`/book/${item._id}`} className="font-display text-2xl leading-tight text-ink transition-colors hover:text-oxblood">
                        {item.bookTitle}
                      </Link>
                      <p className="mt-0.5 text-sm text-muted">{item.authorName}</p>

                      {editingId === item._id ? (
                        <div className="mt-3 max-w-xl">
                          <label htmlFor={`note-${item._id}`} className="field-label">
                            Private note
                          </label>
                          <textarea
                            id={`note-${item._id}`}
                            rows={2}
                            maxLength={280}
                            value={draftNote}
                            onChange={(event) => setDraftNote(event.target.value)}
                            className="input-field mt-2 resize-y text-sm"
                          />
                          <div className="mt-2 flex gap-3">
                            <button
                              type="button"
                              onClick={() => void saveNote(item)}
                              disabled={savingId === item._id}
                              className="font-mono text-[9px] uppercase tracking-[0.12em] text-oxblood underline underline-offset-4 disabled:opacity-40"
                            >
                              {savingId === item._id ? 'Saving…' : 'Save note'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId('')}
                              className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted underline underline-offset-4"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-2 flex flex-wrap items-center gap-3">
                          <p className="max-w-xl text-xs leading-relaxed text-muted">
                            {item.shelf.note || 'No private note yet.'}
                          </p>
                          <button
                            type="button"
                            onClick={() => startEdit(item)}
                            className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-ink"
                          >
                            <FaPen className="h-2.5 w-2.5" aria-hidden="true" />
                            {item.shelf.note ? 'Edit note' : 'Add note'}
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-row items-center gap-3 sm:flex-col sm:items-end">
                      <label className="sr-only" htmlFor={`status-${item._id}`}>
                        Shelf for {item.bookTitle}
                      </label>
                      <select
                        id={`status-${item._id}`}
                        value={item.shelf.status}
                        onChange={(event) => void changeStatus(item, event.target.value)}
                        disabled={savingId === item._id}
                        className="min-h-9 border border-line bg-paper px-2 text-xs text-ink focus:border-oxblood focus:outline-none disabled:opacity-50"
                      >
                        {SHELVES.map((shelf) => (
                          <option key={shelf.status} value={shelf.status}>
                            {shelf.label}
                          </option>
                        ))}
                      </select>

                      {pendingRemoveId === item._id ? (
                        <div className="flex flex-col items-end gap-1">
                          <button
                            type="button"
                            onClick={() => void confirmRemove(item)}
                            disabled={savingId === item._id}
                            className="font-mono text-[9px] uppercase tracking-[0.12em] text-oxblood underline underline-offset-4 disabled:opacity-50"
                          >
                            {savingId === item._id ? 'Removing…' : 'Confirm remove'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setPendingRemoveId('')}
                            className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted underline underline-offset-4"
                          >
                            Keep
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setPendingRemoveId(item._id)}
                          className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-oxblood"
                          aria-label={`Remove ${item.bookTitle} from shelf`}
                        >
                          <FaTrashCan className="h-3 w-3" aria-hidden="true" />
                          Remove
                        </button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  )
}
