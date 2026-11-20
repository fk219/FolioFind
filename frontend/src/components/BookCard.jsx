import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa6';
import BookCover from './BookCover';

const conditionTone = {
  New: 'border-olive/40 bg-olive/10 text-olive',
  'Like New': 'border-olive/40 bg-olive/10 text-olive',
  Good: 'border-brass/40 bg-brass/10 text-[#705626]',
  Acceptable: 'border-oxblood/30 bg-oxblood/5 text-oxblood'
};

export default function BookCard({ book, priority = false }) {
  return (
    <article className="book-card group flex h-full flex-col">
      <Link
        to={`/book/${book._id}`}
        className="flex aspect-[4/5] items-center justify-center overflow-hidden bg-[#EFE6D2] p-6"
        aria-label={`View ${book.bookTitle}`}
      >
        <BookCover
          title={book.bookTitle}
          author={book.authorName}
          src={book.imageURL}
          eager={priority}
          className="max-h-[19rem] max-w-[13rem] object-contain transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </Link>

      <div className="flex flex-1 flex-col border-t border-line p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">{book.category}</span>
          {book.price != null && (
            <span className="font-mono text-sm tabular-nums text-ink">${Number(book.price).toFixed(2)}</span>
          )}
        </div>

        <h3 className="mt-3 font-display text-2xl leading-[1.04] text-ink transition-colors group-hover:text-oxblood">
          <Link to={`/book/${book._id}`}>{book.bookTitle}</Link>
        </h3>
        <p className="mt-1 text-sm text-muted">{book.authorName}</p>

        {book.condition && (
          <span
            className={`mt-4 inline-flex w-fit border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] ${
              conditionTone[book.condition] || 'border-line bg-paper text-muted'
            }`}
          >
            {book.condition}
          </span>
        )}

        {book.conditionNote && (
          <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted">{book.conditionNote}</p>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-line pt-4 font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
          <span>{book.pages ? `${book.pages} pp.` : 'Copy details'}</span>
          <span className="inline-flex items-center gap-1.5 text-oxblood transition-colors group-hover:text-ink">
            View copy
            <FaArrowRight className="h-3 w-3" aria-hidden="true" />
          </span>
        </div>
      </div>
    </article>
  );
}
