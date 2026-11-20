import { useCallback, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaCloudArrowUp } from 'react-icons/fa6'
import { AuthContext } from '../contexts/AuthProvider'
import { getBookStats, listBooks } from '../api/books'
import BookCover from '../components/BookCover'

export default function Dashboard() {
  const { user, token } = useContext(AuthContext)
  const [stats, setStats] = useState(null)
  const [recentBooks, setRecentBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [statsResult, booksResult] = await Promise.all([
        getBookStats({ token }),
        listBooks({ limit: 5 })
      ])
      setStats(statsResult)
      setRecentBooks(booksResult.books || [])
    } catch {
      setError('The ledger could not be loaded.')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    void load()
  }, [load])

  const displayName = user?.fullName?.trim() || user?.email || 'Administrator'
  const categoryCounts = stats?.categoryCounts || {}
  const totalBooks = stats?.totalBooks || 0
  const maxCategory = Math.max(1, ...Object.values(categoryCounts))

  return (
    <div className="px-5 py-8 sm:px-8 xl:px-12">
      <header className="border-b border-line pb-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow">Shop ledger / Signed in as {displayName}</p>
            <h1 className="mt-4 max-w-[13ch] font-display text-[clamp(2.6rem,5vw,4.8rem)] font-light leading-[0.9] tracking-[-0.045em] text-ink">
              The catalogue, <span className="italic text-oxblood">in hand.</span>
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">
              Catalogue size, category spread, and the copies most recently added to the shelves.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/admin/dashboard/upload" className="btn-primary">
              <FaCloudArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
              Upload a book
            </Link>
            <Link to="/admin/dashboard/manage" className="btn-outline">
              Manage books
            </Link>
          </div>
        </div>
      </header>

      {error ? (
        <div className="mt-8 border border-line bg-white/60 p-8">
          <p className="font-display text-2xl text-ink">The ledger is unavailable.</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{error}</p>
          <button type="button" onClick={() => void load()} className="btn-outline mt-5">
            Try again
          </button>
        </div>
      ) : loading ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse border border-line bg-white/60" />
          ))}
        </div>
      ) : (
        <>
          <dl className="grid grid-cols-2 border-b border-line sm:grid-cols-3">
            {[
              { label: 'Titles', value: totalBooks, note: 'in the catalogue' },
              { label: 'Categories', value: stats?.totalCategories || 0, note: 'in current use' },
              { label: 'Role', value: user?.role || 'admin', note: 'access scope' }
            ].map((stat, index) => (
              <div
                key={stat.label}
                className={`border-b border-line py-5 pr-4 sm:border-b-0 sm:py-6 ${
                  index < 2 ? 'sm:border-r sm:pr-6' : ''
                } ${index === 2 ? 'col-span-2 sm:col-span-1' : ''}`}
              >
                <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">{stat.label}</dt>
                <dd className={`mt-2 font-display leading-none text-ink ${stat.label === 'Role' ? 'text-2xl capitalize' : 'text-4xl tabular-nums'}`}>
                  {stat.value}
                </dd>
                <dd className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted">{stat.note}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 grid gap-8 xl:grid-cols-12">
            <section className="xl:col-span-6" aria-labelledby="category-title">
              <div className="flex items-end justify-between border-b border-line pb-3">
                <h2 id="category-title" className="font-display text-2xl text-ink">By category</h2>
                <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted">Copies</span>
              </div>
              {Object.keys(categoryCounts).length === 0 ? (
                <p className="border-b border-line py-8 text-sm text-muted">No categories yet.</p>
              ) : (
                <div>
                  {Object.entries(categoryCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([category, count]) => (
                      <div key={category} className="flex items-center gap-4 border-b border-line py-3.5">
                        <span className="w-28 shrink-0 text-sm text-ink">{category}</span>
                        <div className="h-1.5 flex-1 bg-parchment">
                          <div
                            className="h-full bg-oxblood"
                            style={{ width: `${(count / maxCategory) * 100}%` }}
                          />
                        </div>
                        <span className="w-6 text-right font-mono text-xs tabular-nums text-muted">{count}</span>
                      </div>
                    ))}
                </div>
              )}
            </section>

            <section className="xl:col-span-5 xl:col-start-8" aria-labelledby="recent-books-title">
              <div className="flex items-end justify-between border-b border-line pb-3">
                <h2 id="recent-books-title" className="font-display text-2xl text-ink">Recent additions</h2>
                <Link to="/admin/dashboard/manage" className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.12em] text-muted hover:text-ink">
                  View all
                  <FaArrowRight className="h-2.5 w-2.5" aria-hidden="true" />
                </Link>
              </div>
              {recentBooks.length === 0 ? (
                <p className="border-b border-line py-8 text-sm text-muted">No books uploaded yet.</p>
              ) : (
                <div>
                  {recentBooks.map((book) => (
                    <article key={book._id} className="flex items-center gap-4 border-b border-line py-4">
                      <div className="h-16 w-11 shrink-0 bg-[#EFE6D2] p-1">
                        <BookCover title={book.bookTitle} author={book.authorName} src={book.imageURL} compact />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-display text-lg leading-tight text-ink">{book.bookTitle}</p>
                        <p className="mt-0.5 truncate text-xs text-muted">{book.authorName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted">{book.category}</p>
                        <p className="mt-1 font-mono text-xs tabular-nums text-ink">${Number(book.price || 0).toFixed(2)}</p>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  )
}
