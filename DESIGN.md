# FolioFind — Design Direction

## Concept

**The second shelf.** FolioFind is a marketplace for books that have already been read. The product is not a new-book retailer with a cart; it is a record of specific copies passing from one reader to another. The interface should feel like an independent bookshop: warm paper, dark wood, shelf spines, and the quiet precision of a good catalogue.

**One sentence:** A second-hand bookshop where the copy, the condition note, and the reader's shelf all matter.

## Audience and register

- Readers who buy used books and care which edition they are getting.
- Sellers who want to describe the actual copy in their hands.
- Register: literary, tactile, direct. No urgency tactics, no fake community numbers, no review wall.

## Dials

- **ENERGY 1:** quiet and tactile.
- **RHYTHM 2:** editorial sections with one strong interactive shelf.
- **MOTION 1:** small, functional transitions only.

## Palette

| Token | Hex | Role |
|---|---|---|
| `paper` | `#F4EEDF` | Warm page ground |
| `parchment` | `#E9DFC9` | Secondary surfaces |
| `ink` | `#1E1A16` | Primary text, dark panels |
| `oxblood` | `#6B2A2A` | Primary actions and emphasis |
| `olive` | `#5C6245` | Secondary status and selected states |
| `brass` | `#B38B4D` | Rules, focus, small accents |
| `muted` | `rgba(30,26,22,0.62)` | Body copy |
| `line` | `rgba(30,26,22,0.16)` | Hairlines and borders |

No emerald gradients, no glass cards, no rounded pill systems.

## Typography

- **Display:** Fraunces. Soft, literary, slightly editorial.
- **Body:** Karla. Clear and warm.
- **Labels and data:** Space Mono. Edition, ISBN, prices, counts, condition states.

## Layout

- A wide bookshop container (max 82rem) with a 12-column editorial grid.
- The hero puts one large statement beside a physical stack of three real covers.
- The signature reading-room section is a dark walnut band with a shelf of spines.
- Cards are catalogue entries, not floating product tiles: cover, title, author, category, price, condition, and a condition note.
- Hairline rules separate records. Corners stay sharp.

## Signature moment

**The Reading Room.** A signed-in reader keeps three account-scoped shelves:

- **Want to read** — a considered queue, not an infinite wishlist.
- **Reading** — the copy currently on the bedside table.
- **Finished** — a record, or a book ready to pass on.

Each entry can carry a private note. The shelf is visualised as book spines on dark wood, and the same entries appear in a manageable record below. The shelf is stored through the API, so it survives a reload and a new session.

## Supporting feature

**The copy record.** Every listing names its edition, pages, ISBN, condition, and a specific condition note. “Email the seller” is an explicit demo action; there is no invented checkout.

## Motion

- Page entrance: small opacity/translation, 200–300ms.
- Hover: cover lifting, spine lifting, border/colour changes, 160–220ms.
- No scroll-gated hidden content.
- `prefers-reduced-motion: reduce` removes movement while keeping state visible.

## Content rules

- Every book, seller, and condition note is seeded demo data.
- No fabricated testimonials, ratings, reader counts, founding stories, or press quotes.
- Empty and error states are honest and offer a real next action.
- All cover images are bundled locally; the app never depends on a third-party image service at runtime.
