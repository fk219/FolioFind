import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthProvider'
import { listBooks } from '../api/books'

const Dashboard = () => {
  const { user } = useContext(AuthContext)
  const [stats, setStats] = useState(null)
  const [recentBooks, setRecentBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await listBooks()
        if (cancelled) return
        const books = data?.books || []
        const totalBooks = books.length
        const categories = [...new Set(books.map(b => b.category).filter(Boolean))]
        const categoryCounts = {}
        for (const cat of categories) {
          categoryCounts[cat] = books.filter(b => b.category === cat).length
        }
        const sorted = [...books].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        setStats({ totalBooks, totalCategories: categories.length, categoryCounts })
        setRecentBooks(sorted.slice(0, 5))
        setLoading(false)
      } catch {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="px-4 py-8 w-full">
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-gray-500 mb-8">Welcome back, {user?.fullName || user?.email}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Books</p>
              <p className="text-4xl font-bold text-gray-800 mt-1">{stats?.totalBooks || 0}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Categories</p>
              <p className="text-4xl font-bold text-gray-800 mt-1">{stats?.totalCategories || 0}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Role</p>
              <p className="text-4xl font-bold text-gray-800 mt-1 capitalize">{user?.role || "user"}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-xl">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Books by Category</h2>
          {stats?.categoryCounts && Object.keys(stats.categoryCounts).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(stats.categoryCounts).map(([cat, count]) => (
                <div key={cat} className="flex items-center justify-between">
                  <span className="text-gray-700">{cat}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(count / stats.totalBooks) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-600 w-6 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No books uploaded yet.</p>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Books</h2>
          {recentBooks.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {recentBooks.map(book => (
                <li key={book._id} className="py-3 flex items-center gap-3">
                  <img
                    src={book.imageURL}
                    alt={book.bookTitle}
                    className="w-10 h-14 object-cover rounded"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{book.bookTitle}</p>
                    <p className="text-sm text-gray-500 truncate">{book.authorName}</p>
                  </div>
                  <span className="text-xs text-gray-400">{book.category}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No books uploaded yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard