# FolioFind — Guide

## What it is

FolioFind is a second-hand book marketplace where every listing is a specific copy, not a generic title. Each copy has an edition, condition, seller note, price, and a reading-room record.

- **Live site:** https://foliofind.furqankhan.dev
- **Admin ledger:** https://foliofind.furqankhan.dev/admin/dashboard
- **API:** https://foliofind.onrender.com

## Browse and keep books

1. Open **Shop**.
2. Search by title or author.
3. Filter by category, price, and sort order.
4. Open a copy to read its condition note, edition, and seller.
5. Sign in to use the **reading room**.
6. Put the copy on **Want to read**, **Reading**, or **Finished**.
7. Add a private note and move the copy between shelves.

The reading room is private to the signed-in account.

## Ask a seller

On any available copy, press **Ask about this copy**. The message is stored in FolioFind's enquiry collection and appears in the seller's **My listings** inbox. Personal email addresses are not exposed.

## Sell a book

1. Sign in.
2. Press **Sell a book**.
3. Add the title, author, category, description, condition, price, and optional edition details.
4. Publish the listing.
5. Use **My listings** to view it, mark it sold, relist it, or delete it.

A sold copy leaves the public shelves but stays in the seller's record.

## Admin

Sign in with:

- **Email:** `admin@example.com`
- **Password:** `admin123`

The admin ledger shows catalogue totals, category spread, recent additions, all listings, and buyer enquiries. The seeded "FolioFind desk" copies belong to the admin account.

## What is real

- Books, users, reading-room shelves, and enquiries are stored in MongoDB Atlas.
- Search, filters, pagination, sorting, listing CRUD, sold/relist, and enquiries hit the live API.
- The frontend proxies `/api` through Vercel.

## Tech

React, Vite, Tailwind CSS, Express, MongoDB Atlas, JWT, Zod.

## Honest limits

- No live checkout or payment. FolioFind is a catalogue and reading-room demo.
- Seller contact happens through the in-app enquiry inbox, not email.
- The free Render API can cold-start after inactivity.
