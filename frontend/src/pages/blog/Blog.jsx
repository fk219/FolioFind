import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa6'

const notes = [
  {
    number: '01',
    title: 'How to read a condition note',
    body: '“Good” is not a grade, it is a starting point. Look for the specific: a crease on the spine, a bumped corner, a dust jacket with a short tear. A seller who names the wear is easier to trust than one who only says the book is fine.',
    takeaway: 'Specific beats glowing.'
  },
  {
    number: '02',
    title: 'The edition is part of the book',
    body: 'A 1961 Signet paperback and a 2019 hardcover are not the same object, even when the words match. Publisher, year, translator, and cover art all change the reading. If the edition matters to you, ask before the book changes hands.',
    takeaway: 'Read the record, not just the title.'
  },
  {
    number: '03',
    title: 'A shelf is a queue, not a collection',
    body: 'A reading room works when it tells you what to pick up next. Three shelves are enough: want to read, reading, finished. If a book has sat in “want to read” for a year, it is allowed to leave.',
    takeaway: 'Keep the shelf honest.'
  }
]

export default function Blog() {
  return (
    <div className="bg-paper">
      <section className="container-bookshop pb-16 pt-12 lg:pb-24 lg:pt-16">
        <div className="border-b border-line pb-9">
          <p className="eyebrow">Notes / For second-hand readers</p>
          <h1 className="mt-4 max-w-[14ch] font-display text-[clamp(3rem,6.5vw,5.8rem)] font-light leading-[0.9] tracking-[-0.045em] text-ink">
            Notes from the <span className="italic text-oxblood">second</span> shelf.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">
            Short, practical notes about buying books that have already been read. No author personas,
            no invented dates — just the things worth looking at before a copy changes hands.
          </p>
        </div>

        <div className="mt-10">
          {notes.map((note) => (
            <article key={note.number} className="grid gap-6 border-b border-line py-9 sm:grid-cols-[4rem_1fr] lg:grid-cols-[4rem_1.4fr_1fr] lg:gap-12">
              <span className="font-mono text-[10px] tracking-[0.14em] text-brass">{note.number}</span>
              <div>
                <h2 className="font-display text-3xl font-light leading-tight text-ink">{note.title}</h2>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{note.body}</p>
              </div>
              <div className="lg:border-l lg:border-line lg:pl-8">
                <p className="field-label">Keep in mind</p>
                <p className="mt-2 max-w-[18ch] font-display text-xl italic leading-snug text-oxblood">{note.takeaway}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 flex flex-col justify-between gap-6 border border-line bg-white/60 p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="eyebrow">Put it into practice</p>
            <p className="mt-2 font-display text-2xl text-ink">Open a copy’s record.</p>
          </div>
          <Link to="/shop" className="btn-primary">
            Browse the shelves
            <FaArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  )
}
