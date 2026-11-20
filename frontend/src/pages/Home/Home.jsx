import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaBookOpen, FaPlus } from 'react-icons/fa6';
import { listBooks } from '../../api/books';
import BookCard from '../../components/BookCard';
import BookCover from '../../components/BookCover';

const spinePalettes = [
  { bg: '#6B2A2A', text: '#F4EEDF' },
  { bg: '#5C6245', text: '#F4EEDF' },
  { bg: '#B38B4D', text: '#1E1A16' },
  { bg: '#2F3A3A', text: '#F4EEDF' },
  { bg: '#8A5A32', text: '#F4EEDF' },
  { bg: '#3E2F28', text: '#F4EEDF' }
];

const shelfSteps = [
  {
    title: 'Want to read',
    body: 'Keep the copy you are considering in one place instead of another browser tab.'
  },
  {
    title: 'Reading',
    body: 'Move a book here when it is on the bedside table. Add a private note if you like.'
  },
  {
    title: 'Finished',
    body: 'Keep a record of what you read, or take the book off the shelf and pass it on.'
  }
];

function ShelfSpines({ books }) {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-max items-end gap-2 px-3 sm:gap-3 sm:px-6">
        {books.slice(0, 7).map((book, index) => {
          const palette = spinePalettes[index % spinePalettes.length];
          const height = Math.min(13, Math.max(8.5, (book.pages || 280) / 46));
          return (
            <Link
              key={book._id}
              to={book ? `/book/${book._id}` : '/shop'}
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
          );
        })}
        <Link
          to="/reading-room"
          className="flex h-[9.5rem] w-10 flex-col items-center justify-center border border-dashed border-paper/30 text-paper/50 transition-colors hover:border-paper/70 hover:text-paper"
          aria-label="Open your reading room"
        >
          <FaPlus className="h-3 w-3" aria-hidden="true" />
        </Link>
      </div>
      <div className="shelf-plank" />
    </div>
  );
}

export const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    listBooks({ limit: 8 })
      .then((result) => {
        if (!active) return;
        setBooks(result.books || []);
      })
      .catch(() => {
        if (!active) return;
        setError('The shelves could not be loaded.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const featuredTitles = ['Dune', '1984', 'To Kill a Mockingbird'];
  const featured = featuredTitles
    .map((title) => books.find((book) => book.bookTitle === title))
    .filter(Boolean);
  const heroBooks = [...featured, ...books.filter((book) => !featured.includes(book))].slice(0, 3);
  const sample = books[0];
  const newArrivals = books.slice(0, 4);

  return (
    <div className="bg-paper">
      <section className="container-bookshop pb-16 pt-12 lg:pb-24 lg:pt-20" aria-labelledby="home-title">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="eyebrow">Second-hand books / Named copies</p>
            <h1
              id="home-title"
              className="mt-6 max-w-[11ch] font-display text-[clamp(3.6rem,8vw,7.5rem)] font-light leading-[0.86] tracking-[-0.05em] text-ink"
            >
              Books with a <span className="italic text-oxblood">previous</span> life.
            </h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              A bookshop for the copies already on someone else’s shelf. Read the condition note,
              meet the seller, and add the ones you want to keep to your reading room.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/shop" className="btn-primary">
                Browse the shelves
                <FaArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
              <Link to="/sell" className="btn-outline">
                Sell a book
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-line pt-5 font-mono text-[9px] uppercase tracking-[0.13em] text-muted">
              <span>Real listing copy</span>
              <span aria-hidden="true">·</span>
              <span>Condition notes</span>
              <span aria-hidden="true">·</span>
              <span>A shelf that persists</span>
            </div>
          </div>

          <div className="relative lg:col-span-5">
            <div className="relative mx-auto h-[22rem] w-full max-w-md sm:h-[27rem]" aria-label="Three featured books">
              <div className="absolute left-2 top-8 w-[52%] -rotate-6 border border-line bg-[#EFE6D2] p-4 shadow-cover sm:left-0">
                <div className="aspect-[4/5]">
                  {heroBooks[0] ? (
                    <BookCover title={heroBooks[0].bookTitle} author={heroBooks[0].authorName} src={heroBooks[0].imageURL} eager />
                  ) : (
                    <div className="h-full w-full animate-pulse bg-parchment" />
                  )}
                </div>
              </div>
              <div className="absolute right-0 top-0 w-[50%] rotate-3 border border-line bg-[#EFE6D2] p-4 shadow-cover">
                <div className="aspect-[4/5]">
                  {heroBooks[1] ? (
                    <BookCover title={heroBooks[1].bookTitle} author={heroBooks[1].authorName} src={heroBooks[1].imageURL} />
                  ) : (
                    <div className="h-full w-full animate-pulse bg-parchment" />
                  )}
                </div>
              </div>
              <div className="absolute bottom-0 left-[22%] w-[46%] rotate-1 border border-line bg-[#EFE6D2] p-4 shadow-cover">
                <div className="aspect-[4/5]">
                  {heroBooks[2] ? (
                    <BookCover title={heroBooks[2].bookTitle} author={heroBooks[2].authorName} src={heroBooks[2].imageURL} />
                  ) : (
                    <div className="h-full w-full animate-pulse bg-parchment" />
                  )}
                </div>
              </div>
            </div>
            <p className="mt-6 text-center font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
              Featured copies from the current shelves
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-[#2A1D17] py-16 text-paper lg:py-20" aria-labelledby="shelf-title">
        <div className="container-bookshop grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="min-w-0 lg:col-span-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/40">The signature shelf</p>
            <h2 id="shelf-title" className="mt-4 max-w-[11ch] font-display text-[clamp(2.8rem,5vw,4.8rem)] font-light leading-[0.92] tracking-[-0.04em]">
              A reading room, not a wishlist.
            </h2>
            <p className="mt-6 max-w-sm text-base leading-relaxed text-paper/60">
              Put a book on one of three shelves: want to read, reading, or finished. Your shelf is
              stored with your account and comes back when you do.
            </p>
            <Link to="/reading-room" className="mt-7 inline-flex min-h-11 items-center gap-2 border border-paper/25 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-paper transition-colors hover:bg-paper hover:text-ink">
              Open your reading room
              <FaArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="min-w-0 lg:col-span-6 lg:col-start-7">
            <div className="border border-paper/15 bg-[#211712] p-5 sm:p-7">
              <div className="flex items-center justify-between border-b border-paper/10 pb-4">
                <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-paper/50">
                  <FaBookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                  This month’s shelf
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-paper/35">
                  {books.length ? `${books.length} copies` : 'Loading'}
                </span>
              </div>
              <div className="pt-6">
                {books.length > 0 ? (
                  <ShelfSpines books={books} />
                ) : (
                  <div className="flex items-end gap-2 px-3 pb-0">
                    {Array.from({ length: 7 }).map((_, index) => (
                      <div key={index} className="h-36 w-9 animate-pulse bg-paper/10" />
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-6 grid gap-5 border-t border-paper/10 pt-5 sm:grid-cols-3">
                {shelfSteps.map((step, index) => (
                  <div key={step.title}>
                    <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-brass">
                      {String(index + 1).padStart(2, '0')} / {step.title}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-paper/55">{step.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-bookshop py-16 lg:py-24" aria-labelledby="arrivals-title">
        <div className="flex flex-col justify-between gap-6 border-b border-line pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">On the shelves now</p>
            <h2 id="arrivals-title" className="mt-3 font-display text-[clamp(2.4rem,4.5vw,4rem)] font-light leading-[0.95] tracking-[-0.03em]">
              New arrivals.
            </h2>
          </div>
          <Link to="/shop" className="link-line font-mono text-[10px] uppercase tracking-[0.14em] text-oxblood">
            View all books
          </Link>
        </div>

        {error ? (
          <div className="mt-8 border border-line bg-white/60 p-8">
            <p className="font-display text-2xl text-ink">The shelves are unavailable.</p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
              The book catalogue could not be loaded. This is an API problem, not an empty shop.
            </p>
            <button type="button" onClick={() => setReloadKey((key) => key + 1)} className="btn-outline mt-5">
              Try again
            </button>
          </div>
        ) : loading ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="border border-line bg-white/60">
                <div className="aspect-[4/5] animate-pulse bg-parchment" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-2/3 animate-pulse bg-parchment" />
                  <div className="h-3 w-1/2 animate-pulse bg-parchment" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {newArrivals.map((book, index) => (
              <BookCard key={book._id} book={book} priority={index < 2} />
            ))}
          </div>
        )}
      </section>

      {sample && (
        <section className="border-y border-line bg-parchment/70 py-16 lg:py-24" aria-labelledby="copy-title">
          <div className="container-bookshop grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div className="mx-auto max-w-[18rem] border border-line bg-[#EFE6D2] p-7 shadow-cover">
                <div className="aspect-[4/5]">
                  <BookCover title={sample.bookTitle} author={sample.authorName} src={sample.imageURL} />
                </div>
              </div>
            </div>
            <div className="lg:col-span-7">
              <p className="eyebrow">Every copy is individual</p>
              <h2 id="copy-title" className="mt-4 max-w-[14ch] font-display text-[clamp(2.6rem,5vw,4.6rem)] font-light leading-[0.94] tracking-[-0.04em]">
                The book is used. The reading is not.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted">
                A listing is not just a title and a price. It is a particular edition, a condition
                note written by the seller, and a copy you can picture on your own shelf.
              </p>

              <dl className="mt-8 grid gap-4 border-t border-line pt-6 sm:grid-cols-3">
                <div>
                  <dt className="eyebrow">Edition</dt>
                  <dd className="mt-1.5 text-sm text-ink">{sample.edition || 'Listing edition'}</dd>
                </div>
                <div>
                  <dt className="eyebrow">Condition</dt>
                  <dd className="mt-1.5 text-sm text-ink">{sample.condition || 'Not graded'}</dd>
                </div>
                <div>
                  <dt className="eyebrow">Seller</dt>
                  <dd className="mt-1.5 text-sm text-ink">{sample.sellerName || 'FolioFind desk'}</dd>
                </div>
              </dl>

              <p className="mt-6 max-w-xl border-l-2 border-brass pl-4 text-sm italic leading-relaxed text-muted">
                “{sample.conditionNote || 'The seller has not added a condition note yet.'}”
              </p>

              <Link to={`/book/${sample._id}`} className="btn-primary mt-7">
                Read this copy’s record
                <FaArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="container-bookshop py-16 lg:py-24" aria-labelledby="sell-title">
        <div className="grid gap-10 border border-line bg-white/60 p-7 sm:p-10 lg:grid-cols-12 lg:items-end lg:p-14">
          <div className="lg:col-span-7">
            <p className="eyebrow">Pass a book on</p>
            <h2 id="sell-title" className="mt-3 max-w-[15ch] font-display text-[clamp(2.6rem,4.6vw,4.4rem)] font-light leading-[0.95] tracking-[-0.035em]">
              Your finished books can start another shelf.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted">
              List a copy with its edition, condition, and a note about the actual book in your hands.
              No cart, no checkout theatre — a seller and a reader.
            </p>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <Link to="/sell" className="btn-primary w-full">
              List a book
            </Link>
            <p className="mt-3 text-center font-mono text-[9px] uppercase leading-relaxed tracking-[0.12em] text-muted">
              Account required · Seeded demo marketplace
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
