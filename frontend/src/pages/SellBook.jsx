import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaArrowRight, FaBookOpen } from 'react-icons/fa6'
import { AuthContext } from '../contexts/AuthProvider'
import { createBook } from '../api/books'

const CATEGORIES = ['Fiction', 'Non-Fiction', 'Science', 'Technology', 'History', 'Biography', 'Fantasy', 'Mystery', 'Romance', 'Thriller', 'Horror', 'Self-Help', 'Children']
const CONDITIONS = ['New', 'Like New', 'Good', 'Acceptable']

const emptyForm = {
  bookTitle: '',
  authorName: '',
  imageURL: '',
  category: CATEGORIES[0],
  bookDescription: '',
  price: '',
  condition: CONDITIONS[0],
  conditionNote: '',
  edition: '',
  publishedYear: '',
  pages: '',
  isbn: ''
}

export default function SellBook() {
  const { token, user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState(emptyForm)

  function handleChange(event) {
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const price = parseFloat(form.price)
      if (Number.isNaN(price) || price <= 0) {
        throw new Error('Enter a price greater than zero.')
      }
      const payload = {
        bookTitle: form.bookTitle.trim(),
        authorName: form.authorName.trim(),
        imageURL: form.imageURL.trim(),
        category: form.category,
        bookDescription: form.bookDescription.trim(),
        price,
        condition: form.condition,
        conditionNote: form.conditionNote.trim(),
        edition: form.edition.trim(),
        isbn: form.isbn.trim()
      }
      if (form.publishedYear) payload.publishedYear = Number(form.publishedYear)
      if (form.pages) payload.pages = Number(form.pages)

      await createBook({ token, book: payload })
      navigate('/my-listings')
    } catch (err) {
      setError(err.message || 'Failed to create listing')
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="bg-paper">
        <div className="container-bookshop flex min-h-[65vh] items-center py-16">
          <div className="max-w-xl">
            <p className="eyebrow">Sell a book / Account required</p>
            <h1 className="mt-4 font-display text-[clamp(2.8rem,5vw,4.8rem)] font-light leading-[0.92] tracking-[-0.04em] text-ink">
              Give a book its next reader.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted">
              Sign in to list a copy with its edition, condition, and a note about the book in your hands.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/login" state={{ from: { pathname: '/sell' } }} className="btn-primary">
                Sign in to sell
              </Link>
              <Link to="/create-user" state={{ from: { pathname: '/sell' } }} className="btn-outline">
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-paper">
      <section className="container-bookshop pb-16 pt-12 lg:pb-24 lg:pt-16">
        <div className="grid gap-10 border-b border-line pb-10 lg:grid-cols-12 lg:items-end lg:gap-14">
          <div className="lg:col-span-7">
            <p className="eyebrow">List a copy</p>
            <h1 className="mt-4 max-w-[15ch] font-display text-[clamp(2.8rem,5.4vw,5rem)] font-light leading-[0.9] tracking-[-0.04em] text-ink">
              Give a book its <span className="italic text-oxblood">next</span> reader.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted">
              A good listing is specific: which edition, how the copy has held up, and what a reader
              should know before taking it home.
            </p>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <ol className="space-y-3 border-l border-line pl-5">
              {['Name the book and edition', 'Describe this particular copy', 'Set a price and pass it on'].map((step, index) => (
                <li key={step} className="flex items-baseline gap-3">
                  <span className="font-mono text-[9px] tracking-[0.12em] text-brass">{String(index + 1).padStart(2, '0')}</span>
                  <span className="text-sm text-muted">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-8">
            {error && (
              <p className="mb-6 border border-oxblood/30 bg-oxblood/5 px-4 py-3 text-sm text-oxblood" role="alert">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="border border-line bg-white/60 p-5 sm:p-8">
              <fieldset className="border-b border-line pb-7">
                <legend className="font-display text-2xl text-ink">The book</legend>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="bookTitle" className="field-label">Title *</label>
                    <input id="bookTitle" name="bookTitle" value={form.bookTitle} onChange={handleChange} required maxLength={200} className="input-field mt-2" />
                  </div>
                  <div>
                    <label htmlFor="authorName" className="field-label">Author *</label>
                    <input id="authorName" name="authorName" value={form.authorName} onChange={handleChange} required maxLength={200} className="input-field mt-2" />
                  </div>
                  <div>
                    <label htmlFor="category" className="field-label">Category *</label>
                    <select id="category" name="category" value={form.category} onChange={handleChange} className="input-field mt-2">
                      {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="imageURL" className="field-label">Cover image URL</label>
                    <input id="imageURL" name="imageURL" type="url" value={form.imageURL} onChange={handleChange} className="input-field mt-2" placeholder="https://…" />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="bookDescription" className="field-label">Description *</label>
                    <textarea id="bookDescription" name="bookDescription" rows={4} value={form.bookDescription} onChange={handleChange} required maxLength={5000} className="input-field mt-2 resize-y" placeholder="What is the book about, and why did it stay with you?" />
                  </div>
                </div>
              </fieldset>

              <fieldset className="border-b border-line py-7">
                <legend className="font-display text-2xl text-ink">This copy</legend>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="condition" className="field-label">Condition *</label>
                    <select id="condition" name="condition" value={form.condition} onChange={handleChange} className="input-field mt-2">
                      {CONDITIONS.map((condition) => <option key={condition} value={condition}>{condition}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="edition" className="field-label">Edition</label>
                    <input id="edition" name="edition" value={form.edition} onChange={handleChange} maxLength={120} className="input-field mt-2" placeholder="Publisher and series" />
                  </div>
                  <div>
                    <label htmlFor="publishedYear" className="field-label">Published year</label>
                    <input id="publishedYear" name="publishedYear" type="number" min="0" max="2100" value={form.publishedYear} onChange={handleChange} className="input-field mt-2 tabular-nums" />
                  </div>
                  <div>
                    <label htmlFor="pages" className="field-label">Pages</label>
                    <input id="pages" name="pages" type="number" min="1" max="10000" value={form.pages} onChange={handleChange} className="input-field mt-2 tabular-nums" />
                  </div>
                  <div>
                    <label htmlFor="isbn" className="field-label">ISBN</label>
                    <input id="isbn" name="isbn" value={form.isbn} onChange={handleChange} maxLength={20} className="input-field mt-2 font-mono text-sm" placeholder="978…" />
                  </div>
                  <div>
                    <label htmlFor="price" className="field-label">Price (USD) *</label>
                    <input id="price" name="price" type="number" step="0.01" min="0.5" value={form.price} onChange={handleChange} required className="input-field mt-2 tabular-nums" placeholder="24.50" />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="conditionNote" className="field-label">Condition note</label>
                    <textarea id="conditionNote" name="conditionNote" rows={2} maxLength={280} value={form.conditionNote} onChange={handleChange} className="input-field mt-2 resize-y" placeholder="Be specific: spine, corners, markings, dust jacket." />
                    <p className="mt-1 text-right font-mono text-[9px] uppercase tracking-[0.12em] text-muted tabular-nums">{form.conditionNote.length} / 280</p>
                  </div>
                </div>
              </fieldset>

              <div className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-sm font-mono text-[9px] uppercase leading-relaxed tracking-[0.12em] text-muted">
                  Seeded demo marketplace · Listings are public
                </p>
                <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">
                  {submitting ? 'Publishing…' : 'Publish listing'}
                  {!submitting && <FaArrowRight className="h-3.5 w-3.5" aria-hidden="true" />}
                </button>
              </div>
            </form>
          </div>

          <aside className="lg:col-span-3 lg:col-start-10">
            <div className="border border-line bg-[#2A1D17] p-6 text-paper">
              <FaBookOpen className="h-5 w-5 text-brass" aria-hidden="true" />
              <p className="mt-4 font-display text-2xl font-light leading-snug">A copy is not a product SKU.</p>
              <p className="mt-3 text-xs leading-relaxed text-paper/55">
                The strongest listings read like a note from one reader to the next. Mention the edition,
                the shelf wear, and anything the next person should expect.
              </p>
            </div>
            <div className="mt-4 border border-line p-5">
              <p className="field-label">After publishing</p>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                Your listing appears on the shelves immediately. Manage it from My listings.
              </p>
              <Link to="/my-listings" className="link-line mt-3 inline-block font-mono text-[9px] uppercase tracking-[0.12em] text-oxblood">
                My listings
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}
