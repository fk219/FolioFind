import { Link } from 'react-router-dom'
import { FaArrowRight, FaArrowUpRightFromSquare, FaBookOpen } from 'react-icons/fa6'

const principles = [
  {
    title: 'The copy is the product',
    body: 'Every listing names the edition, the condition, and what is actually being passed on. A used book is not an anonymous SKU.'
  },
  {
    title: 'A shelf should remember',
    body: 'The reading room stores want-to-read, reading, and finished with a private note. It is deliberately smaller than a wishlist.'
  },
  {
    title: 'No invented shop history',
    body: 'FolioFind is a portfolio demo. The books, sellers, and accounts are seeded data; there is no fictional founding story or fake review wall.'
  }
]

const stack = [
  ['Frontend', 'React 18 · Vite · Tailwind CSS · React Router'],
  ['API', 'Node.js · Express · Zod validation · JWT auth'],
  ['Data', 'MongoDB · native driver · seeded catalogue'],
  ['Shelf', 'Per-account status and notes persisted through the API']
]

export default function About() {
  return (
    <div className="bg-paper">
      <section className="container-bookshop pb-16 pt-12 lg:pb-24 lg:pt-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="eyebrow">About / The second shelf</p>
            <h1 className="mt-4 max-w-[12ch] font-display text-[clamp(3.2rem,7vw,6.4rem)] font-light leading-[0.88] tracking-[-0.05em] text-ink">
              A bookshop with a <span className="italic text-oxblood">second</span> life.
            </h1>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-muted">
              FolioFind is built around a simple idea: a used book is a particular copy, not a
              generic product. The interface gives the edition, the wear, and the seller the same
              attention as the title.
            </p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
              It is also a working portfolio project. The catalogue, accounts, listings, and reading
              shelf are all backed by the API in this repository.
            </p>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <div className="border border-line bg-[#2A1D17] p-7 text-paper">
              <FaBookOpen className="h-6 w-6 text-brass" aria-hidden="true" />
              <p className="mt-5 font-display text-2xl font-light leading-snug">
                The books are seeded. The interaction is real.
              </p>
              <p className="mt-3 text-xs leading-relaxed text-paper/55">
                Create an account, keep a shelf, move a copy between statuses, and list a book of your
                own. Those changes are written to MongoDB.
              </p>
              <a
                href="https://github.com/fk219/FolioFind"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 border border-paper/25 px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.14em] text-paper/80 transition-colors hover:bg-paper hover:text-ink"
              >
                View source
                <FaArrowUpRightFromSquare className="h-3 w-3" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-5 border-t border-line pt-10 md:grid-cols-3">
          {principles.map((principle, index) => (
            <article key={principle.title}>
              <span className="font-mono text-[9px] tracking-[0.14em] text-brass">{String(index + 1).padStart(2, '0')}</span>
              <h2 className="mt-3 font-display text-2xl leading-tight text-ink">{principle.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{principle.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-16 grid gap-10 border-t border-line pt-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">Under the counter</p>
            <h2 className="mt-3 font-display text-3xl font-light text-ink">How it is built</h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
              A small MERN stack with a real persistence boundary between the shop and the shelf.
            </p>
          </div>
          <dl className="lg:col-span-6 lg:col-start-7">
            {stack.map(([label, value]) => (
              <div key={label} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[7rem_1fr]">
                <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">{label}</dt>
                <dd className="text-sm text-ink">{value}</dd>
              </div>
            ))}
            <div className="grid gap-1 border-b border-line py-4 sm:grid-cols-[7rem_1fr]">
              <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">Tests</dt>
              <dd className="text-sm text-ink">47 backend tests including auth, catalogue, and reading-room shelf</dd>
            </div>
          </dl>
        </div>

        <div className="mt-14 flex flex-wrap gap-3">
          <Link to="/shop" className="btn-primary">
            Browse the shelves
            <FaArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
          <Link to="/reading-room" className="btn-outline">
            Open the reading room
          </Link>
        </div>
      </section>
    </div>
  )
}
