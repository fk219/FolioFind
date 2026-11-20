import { useState } from 'react'

export const BOOK_CATEGORIES = [
  'Fiction',
  'Non-Fiction',
  'Mystery',
  'Science Fiction',
  'Fantasy',
  'Horror',
  'Biography',
  'History',
  'Self-Help',
  'Science',
  'Technology',
  'Children'
]

export const BOOK_CONDITIONS = ['New', 'Like New', 'Good', 'Acceptable']

const blank = {
  bookTitle: '',
  authorName: '',
  imageURL: '',
  category: BOOK_CATEGORIES[0],
  bookDescription: '',
  condition: BOOK_CONDITIONS[0],
  conditionNote: '',
  edition: '',
  publishedYear: '',
  pages: '',
  isbn: '',
  price: ''
}

function toForm(initial = {}) {
  return {
    ...blank,
    ...Object.fromEntries(
      Object.keys(blank).map((key) => [key, initial[key] == null ? blank[key] : String(initial[key])])
    )
  }
}

export default function BookForm({
  initial,
  submitLabel,
  busyLabel,
  busy,
  error,
  message,
  onSubmit,
  onCancel
}) {
  const [form, setForm] = useState(() => toForm(initial))

  const setField = (key) => (event) => {
    setForm((previous) => ({ ...previous, [key]: event.target.value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const price = Number.parseFloat(form.price)
    if (Number.isNaN(price) || price <= 0) return
    const payload = {
      bookTitle: form.bookTitle.trim(),
      authorName: form.authorName.trim(),
      imageURL: form.imageURL.trim(),
      category: form.category,
      bookDescription: form.bookDescription.trim(),
      condition: form.condition,
      conditionNote: form.conditionNote.trim(),
      edition: form.edition.trim(),
      isbn: form.isbn.trim(),
      price
    }
    if (form.publishedYear) payload.publishedYear = Number(form.publishedYear)
    if (form.pages) payload.pages = Number(form.pages)
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="border border-line bg-white/70 p-5 sm:p-8">
      {error && (
        <p className="mb-6 border border-oxblood/30 bg-oxblood/5 px-4 py-3 text-sm text-oxblood" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="mb-6 border border-olive/30 bg-olive/5 px-4 py-3 text-sm text-olive" role="status">
          {message}
        </p>
      )}

      <fieldset className="border-b border-line pb-7">
        <legend className="font-display text-2xl text-ink">The book</legend>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="admin-title" className="field-label">Title *</label>
            <input id="admin-title" value={form.bookTitle} onChange={setField('bookTitle')} required maxLength={200} className="input-field mt-2" />
          </div>
          <div>
            <label htmlFor="admin-author" className="field-label">Author *</label>
            <input id="admin-author" value={form.authorName} onChange={setField('authorName')} required maxLength={200} className="input-field mt-2" />
          </div>
          <div>
            <label htmlFor="admin-category" className="field-label">Category *</label>
            <select id="admin-category" value={form.category} onChange={setField('category')} className="input-field mt-2">
              {BOOK_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="admin-cover" className="field-label">Cover image URL</label>
            <input id="admin-cover" type="url" value={form.imageURL} onChange={setField('imageURL')} className="input-field mt-2" placeholder="https://…" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="admin-description" className="field-label">Description *</label>
            <textarea id="admin-description" rows={4} value={form.bookDescription} onChange={setField('bookDescription')} required maxLength={5000} className="input-field mt-2 resize-y" />
          </div>
        </div>
      </fieldset>

      <fieldset className="border-b border-line py-7">
        <legend className="font-display text-2xl text-ink">This copy</legend>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="admin-condition" className="field-label">Condition *</label>
            <select id="admin-condition" value={form.condition} onChange={setField('condition')} className="input-field mt-2">
              {BOOK_CONDITIONS.map((condition) => <option key={condition} value={condition}>{condition}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="admin-price" className="field-label">Price (USD) *</label>
            <input id="admin-price" type="number" step="0.01" min="0.5" value={form.price} onChange={setField('price')} required className="input-field mt-2 tabular-nums" />
          </div>
          <div>
            <label htmlFor="admin-edition" className="field-label">Edition</label>
            <input id="admin-edition" value={form.edition} onChange={setField('edition')} maxLength={120} className="input-field mt-2" />
          </div>
          <div>
            <label htmlFor="admin-isbn" className="field-label">ISBN</label>
            <input id="admin-isbn" value={form.isbn} onChange={setField('isbn')} maxLength={20} className="input-field mt-2 font-mono text-sm" />
          </div>
          <div>
            <label htmlFor="admin-year" className="field-label">Published year</label>
            <input id="admin-year" type="number" min="0" max="2100" value={form.publishedYear} onChange={setField('publishedYear')} className="input-field mt-2 tabular-nums" />
          </div>
          <div>
            <label htmlFor="admin-pages" className="field-label">Pages</label>
            <input id="admin-pages" type="number" min="1" max="10000" value={form.pages} onChange={setField('pages')} className="input-field mt-2 tabular-nums" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="admin-note" className="field-label">Condition note</label>
            <textarea id="admin-note" rows={2} maxLength={280} value={form.conditionNote} onChange={setField('conditionNote')} className="input-field mt-2 resize-y" />
          </div>
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center justify-end gap-3 pt-6">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-outline">
            Cancel
          </button>
        )}
        <button type="submit" disabled={busy} className="btn-primary disabled:opacity-50">
          {busy ? busyLabel : submitLabel}
        </button>
      </div>
    </form>
  )
}
