import { Link } from 'react-router-dom';
import { FaArrowUpRightFromSquare, FaBookOpen } from 'react-icons/fa6';

const shopLinks = [
  { label: 'All books', to: '/shop' },
  { label: 'Reading room', to: '/reading-room' },
  { label: 'Sell a book', to: '/sell' }
];

const houseLinks = [
  { label: 'About FolioFind', to: '/about' },
  { label: 'Notes', to: '/blog' },
  { label: 'My listings', to: '/my-listings' }
];

export default function FooterMain() {
  return (
    <footer className="border-t border-ink bg-ink text-paper">
      <div className="container-bookshop grid gap-12 py-16 md:grid-cols-[1.6fr_1fr_1fr_1.1fr] lg:py-20">
        <div>
          <Link to="/" className="inline-flex items-center gap-3" aria-label="FolioFind home">
            <span className="flex h-10 w-10 items-center justify-center bg-paper text-ink">
              <FaBookOpen className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="font-display text-2xl tracking-tight">FolioFind</span>
          </Link>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-paper/60">
            A second-hand bookshop for books that have already been read. Every listing names the
            copy, the condition, and the person passing it on.
          </p>
          <p className="mt-4 font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-paper/35">
            Portfolio demo · Seeded listings · Not a live checkout
          </p>
        </div>

        <nav aria-label="Shop links">
          <h2 className="font-mono text-[9px] uppercase tracking-[0.16em] text-paper/40">Browse</h2>
          <ul className="mt-5 space-y-3">
            {shopLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm text-paper/70 transition-colors hover:text-paper">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="House links">
          <h2 className="font-mono text-[9px] uppercase tracking-[0.16em] text-paper/40">The house</h2>
          <ul className="mt-5 space-y-3">
            {houseLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm text-paper/70 transition-colors hover:text-paper">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-mono text-[9px] uppercase tracking-[0.16em] text-paper/40">Source</h2>
          <p className="mt-5 text-sm leading-relaxed text-paper/60">
            Built with React, Express, and MongoDB. The shelf and listings are backed by the API.
          </p>
          <a
            href="https://github.com/fk219/FolioFind"
            target="_blank"
            rel="noreferrer"
            className="link-line mt-4 inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-paper/70 transition-colors hover:text-paper"
          >
            GitHub
            <FaArrowUpRightFromSquare className="h-3 w-3" aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <div className="container-bookshop flex flex-col justify-between gap-3 py-6 font-mono text-[9px] uppercase tracking-[0.14em] text-paper/40 sm:flex-row">
          <span>© {new Date().getFullYear()} FolioFind</span>
          <span>Books are seeded demo listings</span>
        </div>
      </div>
    </footer>
  );
}
