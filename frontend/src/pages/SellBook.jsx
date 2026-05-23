import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthProvider'
import { createBook } from '../api/books'

const CATEGORIES = ['Fiction', 'Non-Fiction', 'Science', 'Technology', 'History', 'Biography', 'Fantasy', 'Mystery', 'Romance', 'Thriller', 'Horror', 'Self-Help', 'Children']
const CONDITIONS = ['New', 'Like New', 'Good', 'Acceptable']

export default function SellBook() {
  const { token, user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    bookTitle: '',
    authorName: '',
    imageURL: '',
    category: CATEGORIES[0],
    bookDescription: '',
    price: '',
    condition: CONDITIONS[0]
  })

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const price = parseFloat(form.price)
      if (isNaN(price) || price <= 0) {
        throw new Error('Please enter a valid price')
      }
      await createBook({ token, book: { ...form, price } })
      navigate('/my-listings')
    } catch (err) {
      setError(err.message || 'Failed to create listing')
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="text-center">
          <p className="text-gray-600 mb-4">You must be logged in to sell a book.</p>
          <Link to="/login" className="text-blue-600 hover:text-blue-800 underline">Log in</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 pb-16 px-4 bg-[#f8f7f4]">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-semibold tracking-tight">Sell your book</h1>
          <p className="text-gray-600 mt-2 text-lg">List it in minutes. Reach thousands of passionate readers.</p>
        </div>

        {error && <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 text-sm">{error}</div>}

        <div className="card p-9">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Book title *</label>
                <input name="bookTitle" value={form.bookTitle} onChange={handleChange} required className="input-field" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Author name *</label>
                <input name="authorName" value={form.authorName} onChange={handleChange} required className="input-field" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Condition *</label>
                <select name="condition" value={form.condition} onChange={handleChange} className="input-field">
                  {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Price (USD) *</label>
                <input name="price" type="number" step="0.01" min="0.5" value={form.price} onChange={handleChange} required className="input-field" placeholder="24.50" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Category *</label>
                <select name="category" value={form.category} onChange={handleChange} className="input-field">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Cover image URL</label>
              <input name="imageURL" value={form.imageURL} onChange={handleChange} className="input-field" placeholder="https://..." />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Description</label>
              <textarea name="bookDescription" value={form.bookDescription} onChange={handleChange} rows={5} className="input-field resize-y" placeholder="What makes this copy special? Any notes on edition, condition details, or why you loved it..." />
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full py-4 text-lg">
              {submitting ? 'Publishing your listing...' : 'Publish listing'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}