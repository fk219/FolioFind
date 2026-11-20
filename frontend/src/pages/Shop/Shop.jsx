import { useEffect, useMemo, useState } from 'react';
import { FaArrowLeft, FaArrowRight, FaMagnifyingGlass } from 'react-icons/fa6';
import { listBooks } from '../../api/books';
import BookCard from '../../components/BookCard';

const CATEGORIES = [
  'Fiction',
  'Non-Fiction',
  'Science',
  'Technology',
  'History',
  'Biography',
  'Fantasy',
  'Mystery',
  'Romance',
  'Thriller',
  'Horror',
  'Self-Help',
  'Children'
];

const SORTS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'price-asc', label: 'Price, low to high' },
  { value: 'price-desc', label: 'Price, high to low' },
  { value: 'title', label: 'Title, A–Z' }
];

const PAGE_SIZE = 12;

export default function Shop() {
  const [books, setBooks] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => clearTimeout(timer);
  }, [search]);

  const priceError = useMemo(
    () => minPrice !== '' && maxPrice !== '' && Number(minPrice) > Number(maxPrice),
    [minPrice, maxPrice]
  );

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    listBooks({
      category: category || undefined,
      q: debouncedSearch || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      sort,
      page,
      limit: PAGE_SIZE
    })
      .then((result) => {
        if (!active) return;
        setBooks(result.books || []);
        setPagination(result.pagination);
      })
      .catch(() => {
        if (!active) return;
        setBooks([]);
        setPagination(null);
        setError('The catalogue could not be loaded.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [category, debouncedSearch, minPrice, maxPrice, sort, page, reloadKey]);

  const updateFilter = (setter) => (event) => {
    setter(event.target.value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    setPage(1);
  };

  const hasFilters = Boolean(search || category || minPrice || maxPrice);

  return (
    <div className="bg-paper">
      <section className="container-bookshop pb-10 pt-12 lg:pb-14 lg:pt-16" aria-labelledby="shop-title">
        <div className="flex flex-col justify-between gap-8 border-b border-line pb-8 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow">Catalogue / Named copies</p>
            <h1
              id="shop-title"
              className="mt-4 max-w-[13ch] font-display text-[clamp(3rem,6.5vw,5.8rem)] font-light leading-[0.9] tracking-[-0.045em] text-ink"
            >
              The <span className="italic text-oxblood">shelves.</span>
            </h1>
          </div>
          <p className="max-w-sm text-base leading-relaxed text-muted">
            Each result is a specific copy with an edition, a condition note, and a seller. Search by
            title or author, then open the copy’s record.
          </p>
        </div>

        <form
          role="search"
          aria-label="Filter the catalogue"
          onSubmit={(event) => event.preventDefault()}
          className="mt-7 border border-line bg-white/60 p-4 sm:p-5"
        >
          <div className="grid gap-4 md:grid-cols-12 md:items-end">
            <div className="md:col-span-5">
              <label htmlFor="shop-search" className="field-label">
                Search
              </label>
              <div className="relative mt-2">
                <FaMagnifyingGlass
                  className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
                  aria-hidden="true"
                />
                <input
                  id="shop-search"
                  type="search"
                  value={search}
                  onChange={updateFilter(setSearch)}
                  className="input-field pl-9"
                  placeholder="Title or author"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="shop-min" className="field-label">
                Min price
              </label>
              <input
                id="shop-min"
                type="number"
                min="0"
                step="0.01"
                value={minPrice}
                onChange={updateFilter(setMinPrice)}
                className="input-field mt-2 tabular-nums"
                placeholder="0"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="shop-max" className="field-label">
                Max price
              </label>
              <input
                id="shop-max"
                type="number"
                min="0"
                step="0.01"
                value={maxPrice}
                onChange={updateFilter(setMaxPrice)}
                className="input-field mt-2 tabular-nums"
                placeholder="Any"
              />
            </div>

            <div className="md:col-span-3">
              <label htmlFor="shop-sort" className="field-label">
                Order
              </label>
              <select
                id="shop-sort"
                value={sort}
                onChange={updateFilter(setSort)}
                className="input-field mt-2"
              >
                {SORTS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">Category</span>
            <button
              type="button"
              onClick={() => {
                setCategory('');
                setPage(1);
              }}
              aria-pressed={!category}
              className={`font-mono text-[10px] uppercase tracking-[0.1em] transition-colors ${
                !category ? 'text-oxblood underline underline-offset-4' : 'text-muted hover:text-ink'
              }`}
            >
              All
            </button>
            {CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setCategory(item);
                  setPage(1);
                }}
                aria-pressed={category === item}
                className={`font-mono text-[10px] uppercase tracking-[0.1em] transition-colors ${
                  category === item ? 'text-oxblood underline underline-offset-4' : 'text-muted hover:text-ink'
                }`}
              >
                {item}
              </button>
            ))}
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="ml-auto font-mono text-[10px] uppercase tracking-[0.1em] text-oxblood underline underline-offset-4"
              >
                Clear filters
              </button>
            )}
          </div>
        </form>

        {priceError && (
          <p className="mt-3 text-sm text-oxblood" role="alert">
            The minimum price is higher than the maximum price.
          </p>
        )}
      </section>

      <section className="container-bookshop pb-16 lg:pb-24" aria-labelledby="results-title">
        <h2 id="results-title" className="sr-only">
          Catalogue results
        </h2>

        <div className="flex flex-col justify-between gap-3 border-b border-line pb-4 sm:flex-row sm:items-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted" aria-live="polite">
            {loading
              ? 'Opening the catalogue'
              : pagination
                ? `${pagination.total} cop${pagination.total === 1 ? 'y' : 'ies'} on the shelves`
                : 'No copies found'}
          </p>
          {pagination && pagination.totalPages > 1 && (
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              Page <span className="tabular-nums text-ink">{page}</span> of{' '}
              <span className="tabular-nums text-ink">{pagination.totalPages}</span>
            </p>
          )}
        </div>

        {error ? (
          <div className="mt-8 border border-line bg-white/60 p-10">
            <p className="font-display text-3xl text-ink">The shelves are unavailable.</p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
              The catalogue request failed. This is a server problem, not an empty shelf.
            </p>
            <button type="button" onClick={() => setReloadKey((key) => key + 1)} className="btn-outline mt-6">
              Try again
            </button>
          </div>
        ) : loading ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="border border-line bg-white/60">
                <div className="aspect-[4/5] animate-pulse bg-parchment" />
                <div className="space-y-3 border-t border-line p-5">
                  <div className="h-3 w-1/3 animate-pulse bg-parchment" />
                  <div className="h-5 w-2/3 animate-pulse bg-parchment" />
                  <div className="h-3 w-1/2 animate-pulse bg-parchment" />
                </div>
              </div>
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="mt-8 border border-line bg-white/60 px-6 py-16 text-center">
            <p className="eyebrow">Nothing matches</p>
            <p className="mt-4 font-display text-3xl text-ink">No copies on this shelf.</p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
              Try a different category, a wider price range, or clear the search.
            </p>
            <button type="button" onClick={clearFilters} className="btn-outline mt-6">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {books.map((book, index) => (
              <BookCard key={book._id} book={book} priority={index < 4} />
            ))}
          </div>
        )}

        {!loading && !error && pagination && pagination.totalPages > 1 && (
          <nav className="mt-12 flex items-center justify-between border-t border-line pt-6" aria-label="Catalogue pages">
            <button
              type="button"
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              disabled={!pagination.hasPrev}
              className="inline-flex min-h-11 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ink transition-colors hover:text-oxblood disabled:cursor-not-allowed disabled:opacity-30"
            >
              <FaArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Previous
            </button>

            <div className="hidden items-center gap-1 sm:flex">
              {Array.from({ length: pagination.totalPages }, (_, index) => index + 1)
                .filter(
                  (number) =>
                    number === 1 ||
                    number === pagination.totalPages ||
                    Math.abs(number - page) <= 1
                )
                .map((number, index, list) => (
                  <span key={number} className="flex items-center gap-1">
                    {index > 0 && number - list[index - 1] > 1 && (
                      <span className="px-1 font-mono text-xs text-muted">…</span>
                    )}
                    <button
                      type="button"
                      onClick={() => setPage(number)}
                      aria-current={number === page ? 'page' : undefined}
                      className={`flex h-10 w-10 items-center justify-center font-mono text-xs transition-colors ${
                        number === page
                          ? 'bg-oxblood text-paper'
                          : 'border border-line text-muted hover:border-ink hover:text-ink'
                      }`}
                    >
                      {number}
                    </button>
                  </span>
                ))}
            </div>

            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted sm:hidden">
              {page} / {pagination.totalPages}
            </span>

            <button
              type="button"
              onClick={() => setPage((value) => Math.min(pagination.totalPages, value + 1))}
              disabled={!pagination.hasNext}
              className="inline-flex min-h-11 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ink transition-colors hover:text-oxblood disabled:cursor-not-allowed disabled:opacity-30"
            >
              Next
              <FaArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </nav>
        )}
      </section>
    </div>
  );
}
