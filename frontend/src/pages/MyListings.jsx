import { useContext, useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Spinner } from 'flowbite-react'
import { AuthContext } from '../contexts/AuthProvider'
import { listMyBooks, updateBookStatus, deleteBook } from '../api/books'

const STATUS_COLORS = {
  available: 'bg-green-100 text-green-800',
  sold: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800'
}

export default function MyListings() {
  const { token, user } = useContext(AuthContext)
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
    try {
      await updateBookStatus({ token, id, status })
      fetchBooks()
    } catch (err) {
      setError(err.message || 'Failed to update status')
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this listing?')) return
    try {
      await deleteBook({ token, id })
      fetchBooks()
    } catch (err) {
      setError(err.message || 'Failed to delete listing')
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="text-center">
          <p className="text-gray-600 mb-4">You must be logged in to view your listings.</p>
          <Link to="/login" className="text-blue-600 hover:text-blue-800 underline">Log in</Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <Spinner aria-label="Loading listings" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
          <Link to="/sell" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg transition">
            + Sell a Book
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {books.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">You haven&apos;t listed any books yet.</p>
            <Link to="/sell" className="text-blue-600 hover:text-blue-800 underline">List your first book</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {books.map(book => (
              <div key={book._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex gap-4 items-start">
                <img
                  src={book.imageURL}
                  alt={book.bookTitle}
                  className="w-20 h-28 object-cover rounded-lg flex-shrink-0"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/80x112?text=No+Image' }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{book.bookTitle}</h3>
                  <p className="text-sm text-gray-500">{book.authorName}</p>
                  <p className="text-sm text-gray-400 mt-1">${book.price?.toFixed(2)} &middot; {book.condition}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[book.status] || 'bg-gray-100 text-gray-800'}`}>
                      {book.status}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  {book.status !== 'sold' && (
                    <button onClick={() => handleStatus(book._id, 'sold')}
                      className="text-xs px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition">
                      Mark Sold
                    </button>
                  )}
                  {book.status !== 'pending' && book.status !== 'sold' && (
                    <button onClick={() => handleStatus(book._id, 'pending')}
                      className="text-xs px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition">
                      Mark Pending
                    </button>
                  )}
                  <Link to={`/book/${book._id}`}
                    className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-center">
                    View
                  </Link>
                  <button onClick={() => handleDelete(book._id)}
                    className="text-xs px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}