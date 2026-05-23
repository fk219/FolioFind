import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { listBooks } from '../../api/books'

const CONDITIONS = ["New", "Like New", "Good", "Acceptable"]

const CONDITION_COLORS = {
  New: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  'Like New': 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300',
  Good: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  Acceptable: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300'
}

export default function Shop() {
  const [books, setBooks] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [page, setPage] = useState(1)

  const fetchBooks = useCallback(async (p) => {
    setLoading(true)
    try {
      const result = await listBooks({ category: selectedCategory || undefined, page: p, limit: 12 })
      setBooks(result.books)
      setPagination(result.pagination)
      const allCats = [...new Set(result.books.map(b => b.category).filter(Boolean))]
      setCategories(prev => prev.length ? prev : allCats)
    } catch {
      setBooks([])
      setPagination(null)
    } finally {
      setLoading(false)
    }
  }, [selectedCategory])

  useEffect(() => {
    setPage(1)
  }, [selectedCategory])

  useEffect(() => {
    fetchBooks(page)
  }, [fetchBooks, page])

  const filtered = useMemo(() => {
    return books.filter(b => {
      if (search) {
        const q = search.toLowerCase()
        if (!b.bookTitle?.toLowerCase().includes(q) && !b.authorName?.toLowerCase().includes(q)) return false
      }
      if (minPrice !== "" && (b.price == null || b.price < parseFloat(minPrice))) return false
      if (maxPrice !== "" && (b.price == null || b.price > parseFloat(maxPrice))) return false
      return true
    })
  }, [books, search, minPrice, maxPrice])

  return (
    <div className="pt-20 pb-16 px-4 lg:px-24 bg-[#f8f7f4] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center pt-8 pb-10">
          <div className="badge mx-auto mb-4">Marketplace</div>
          <h1 className="text-6xl tracking-[-2px] font-semibold">Discover books</h1>
          <p className="text-xl text-gray-600 mt-3">Find your next great read from our curated collection</p>
        </div>

        {/* Premium Filters */}
        <div className="card p-8 mb-10">
          <div className="flex flex-col lg:flex-row gap-5 items-end">
            <div className="flex-1 w-full">
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Title, author or keyword..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="input-field pl-11"
                />
                <div className="absolute left-4 top-4 text-gray-400">⌘</div>
              </div>
            </div>

            <div className="flex gap-3 w-full lg:w-auto">
              <div className="flex-1 lg:w-28">
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Min price</label>
                <input type="number" placeholder="0" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="input-field" />
              </div>
              <div className="flex-1 lg:w-28">
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Max price</label>
                <input type="number" placeholder="Any" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="input-field" />
              </div>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mt-6">
            <button onClick={() => setSelectedCategory("")} className={`px-5 py-1.5 text-sm rounded-full font-medium transition ${!selectedCategory ? 'bg-emerald-600 text-white shadow' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
              All books
            </button>
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-5 py-1.5 text-sm rounded-full font-medium transition ${selectedCategory === cat ? 'bg-emerald-600 text-white shadow' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card p-0 overflow-hidden animate-pulse">
                <div className="h-60 bg-gray-100" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-xl text-gray-500">No books match your search.</p>
            <button onClick={() => { setSearch(""); setMinPrice(""); setMaxPrice(""); setSelectedCategory("") }} className="btn-ghost mt-6">Clear filters</button>
          </div>
        ) : (
          <>
            <p className="text-sm text-center text-gray-500 mb-8">
              Showing <span className="font-semibold text-gray-700">{filtered.length}</span> beautiful books
            </p>

            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
              {filtered.map(book => (
                <Link to={`/book/${book._id}`} key={book._id} className="group">
                  <div className="book-card h-full flex flex-col">
                    <div className="relative bg-[#f4f3ef] aspect-[16/10] flex items-center justify-center overflow-hidden">
                      <img 
                        src={book.imageURL} 
                        alt={book.bookTitle} 
                        className="max-h-[210px] object-contain group-hover:scale-[1.04] transition-transform duration-500" 
                        loading="lazy"
                      />
                      {book.condition && (
                        <span className="absolute top-4 left-4 badge text-xs">{book.condition}</span>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex-1">
                        <h3 className="font-semibold text-xl leading-tight group-hover:text-emerald-700 transition line-clamp-2">{book.bookTitle}</h3>
                        <p className="text-gray-500 mt-1 text-sm">{book.authorName}</p>
                      </div>
                      <div className="flex items-end justify-between pt-6 mt-auto border-t">
                        <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium">{book.category}</span>
                        {book.price != null && <span className="font-semibold text-2xl tracking-tighter text-emerald-700">${Number(book.price).toFixed(2)}</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-14">
                <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={!pagination.hasPrev} className="btn-ghost disabled:opacity-40">← Previous</button>
                
                {Array.from({length: pagination.totalPages}, (_,i) => i+1)
                  .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - page) < 2)
                  .map((p, idx, arr) => (
                    <button key={p} onClick={() => setPage(p)} className={`px-4 py-2 rounded-2xl text-sm font-medium transition ${page === p ? 'bg-emerald-600 text-white' : 'bg-white border hover:bg-gray-50'}`}>
                      {p}
                    </button>
                  ))}
                
                <button onClick={() => setPage(p => Math.min(pagination.totalPages, p+1))} disabled={!pagination.hasNext} className="btn-ghost disabled:opacity-40">Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}