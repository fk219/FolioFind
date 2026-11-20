import { Link } from 'react-router-dom';
import { FaBookOpen } from 'react-icons/fa6';

const facts = [
  ['Read the copy', 'Edition, condition, and the seller’s note are part of every listing.'],
  ['Keep a shelf', 'A reading room for what you want to read, are reading, and have finished.'],
  ['Pass it on', 'List the books you are ready to let go of.']
];

export default function AuthFrame({ eyebrow, title, description, children }) {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="border-b border-line">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:h-20 sm:px-8">
          <Link to="/" className="flex items-center gap-3" aria-label="FolioFind home">
            <span className="flex h-9 w-9 items-center justify-center bg-oxblood text-paper">
              <FaBookOpen className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-xl tracking-tight text-ink">FolioFind</span>
              <span className="mt-1 font-mono text-[8px] uppercase tracking-[0.2em] text-muted">The second shelf</span>
            </span>
          </Link>
          <Link to="/shop" className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink">
            Browse books
          </Link>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 items-stretch px-5 py-10 sm:px-8 lg:grid-cols-12 lg:py-14">
        <section className="hidden border border-line bg-[#2A1D17] p-10 text-paper lg:col-span-5 lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-paper/40">The reading room</p>
            <p className="mt-5 max-w-[11ch] font-display text-[clamp(2.8rem,4vw,4.2rem)] font-light leading-[0.9] tracking-[-0.04em]">
              The second shelf starts <span className="italic text-brass">here.</span>
            </p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-paper/60">
              FolioFind is a marketplace for the copies already in circulation. An account keeps your
              shelf and your listings in one place.
            </p>
          </div>

          <ol className="space-y-4 border-t border-paper/10 pt-6">
            {facts.map(([heading, body], index) => (
              <li key={heading} className="grid grid-cols-[1.5rem_1fr] gap-3">
                <span className="font-mono text-[9px] tracking-[0.12em] text-brass">{String(index + 1).padStart(2, '0')}</span>
                <span>
                  <span className="block font-display text-lg leading-snug">{heading}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-paper/50">{body}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section className="border border-line bg-white/70 p-6 sm:p-9 lg:col-span-7">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-3 font-display text-[clamp(2.2rem,3.6vw,3.4rem)] font-light leading-[0.95] tracking-[-0.03em] text-ink">
            {title}
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">{description}</p>
          {children}
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex w-full max-w-6xl flex-col justify-between gap-2 px-5 py-4 font-mono text-[9px] uppercase tracking-[0.14em] text-muted sm:flex-row sm:px-8">
          <span>FolioFind · The second shelf</span>
          <span>Portfolio demo · Seeded listings</span>
        </div>
      </footer>
    </div>
  );
}
