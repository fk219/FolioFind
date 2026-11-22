const REAL_BOOKS = [
  {
    bookTitle: "The Great Gatsby",
    authorName: "F. Scott Fitzgerald",
    category: "Fiction",
    bookDescription: "A portrait of the Jazz Age in all its decadence and excess, Gatsby explores the disillusionment of the American Dream through the mysterious Jay Gatsby and his obsession with the beautiful Daisy Buchanan.",
    imageURL: "/covers/the-great-gatsby.jpg",
    bookPDFURL: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    price: 12.99,
    condition: "Like New",
    conditionNote: "Trade paperback. Square spine, clean text block, faint shelf wear to the corners.",
    edition: "Scribner Paperback",
    publishedYear: 2004,
    pages: 180,
    isbn: "9780743273565",
    status: "available",
    sellerId: "admin_seed",
    sellerEmail: "admin@example.com",
    sellerName: "The FolioFind desk"
  },
  {
    bookTitle: "To Kill a Mockingbird",
    authorName: "Harper Lee",
    category: "Fiction",
    bookDescription: "Set in the American South during the Great Depression, this classic novel addresses the deeply rooted racial injustices through the innocent eyes of young Scout Finch and her father, the heroic lawyer Atticus Finch.",
    imageURL: "/covers/to-kill-a-mockingbird.jpg",
    bookPDFURL: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    price: 14.50,
    condition: "Good",
    conditionNote: "Read once. No underlining; a small crease on the back cover.",
    edition: "Harper Perennial",
    publishedYear: 2005,
    pages: 336,
    isbn: "9780061120084",
    status: "available",
    sellerId: "admin_seed",
    sellerEmail: "admin@example.com",
    sellerName: "The FolioFind desk"
  },
  {
    bookTitle: "1984",
    authorName: "George Orwell",
    category: "Fiction",
    bookDescription: "Orwell's dystopian masterpiece introduces a chilling vision of a totalitarian state under Big Brother, where history is rewritten, language is weaponized, and the individual soul is utterly crushed.",
    imageURL: "/covers/1984.jpg",
    bookPDFURL: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    price: 10.99,
    condition: "New",
    conditionNote: "Signet Classics edition. Unmarked pages, tight binding.",
    edition: "Signet Classics",
    publishedYear: 1961,
    pages: 328,
    isbn: "9780451524935",
    status: "available",
    sellerId: "admin_seed",
    sellerEmail: "admin@example.com",
    sellerName: "The FolioFind desk"
  },
  {
    bookTitle: "Dune",
    authorName: "Frank Herbert",
    category: "Science",
    bookDescription: "The sweeping sci-fi epic set on the desert planet Arrakis. Dune tells the story of Paul Atreides as he navigates political betrayal, ecology, and messianic destiny in a futuristic feudal empire.",
    imageURL: "/covers/dune.jpg",
    bookPDFURL: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    price: 18.99,
    condition: "New",
    conditionNote: "Ace paperback. Light tanning to page edges, no markings.",
    edition: "Ace",
    publishedYear: 2019,
    pages: 688,
    isbn: "9780441013593",
    status: "available",
    sellerId: "admin_seed",
    sellerEmail: "admin@example.com",
    sellerName: "The FolioFind desk"
  },
  {
    bookTitle: "Atomic Habits",
    authorName: "James Clear",
    category: "Self-Help",
    bookDescription: "The definitive guide to breaking bad habits and building good ones. James Clear provides practical, scientifically-backed frameworks for getting 1% better every single day through micro-behavioral changes.",
    imageURL: "/covers/atomic-habits.jpg",
    bookPDFURL: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    price: 16.95,
    condition: "Like New",
    conditionNote: "Hardcover with dust jacket. Appears unread.",
    edition: "Avery",
    publishedYear: 2018,
    pages: 320,
    isbn: "9780735211292",
    status: "available",
    sellerId: "admin_seed",
    sellerEmail: "admin@example.com",
    sellerName: "The FolioFind desk"
  },
  {
    bookTitle: "Sapiens: A Brief History of Humankind",
    authorName: "Yuval Noah Harari",
    category: "History",
    bookDescription: "Harari takes us on a breathtaking journey from early modern humans walking the Earth to the cognitive, agricultural, and scientific revolutions that shaped modern civilization.",
    imageURL: "/covers/sapiens.jpg",
    bookPDFURL: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    price: 19.99,
    condition: "Good",
    conditionNote: "Trade paperback. A few dog-eared pages, otherwise clean.",
    edition: "Harper",
    publishedYear: 2015,
    pages: 464,
    isbn: "9780062316097",
    status: "available",
    sellerId: "admin_seed",
    sellerEmail: "admin@example.com",
    sellerName: "The FolioFind desk"
  },
  {
    bookTitle: "The Hobbit",
    authorName: "J.R.R. Tolkien",
    category: "Fantasy",
    bookDescription: "The precursor to The Lord of the Rings. Bilbo Baggins is whisked away from his comfortable hobbit-hole by Gandalf and a company of dwarves on an epic quest to reclaim the Lonely Mountain and its treasure from the dragon Smaug.",
    imageURL: "/covers/the-hobbit.jpg",
    bookPDFURL: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    price: 15.00,
    condition: "Like New",
    conditionNote: "Mariner paperback. Crease to the spine, all pages intact.",
    edition: "Mariner Books",
    publishedYear: 2012,
    pages: 300,
    isbn: "9780547928227",
    status: "available",
    sellerId: "admin_seed",
    sellerEmail: "admin@example.com",
    sellerName: "The FolioFind desk"
  },
  {
    bookTitle: "Brave New World",
    authorName: "Aldous Huxley",
    category: "Fiction",
    bookDescription: "A dark vision of a genetically-engineered, soma-medicated society where pain has been engineered away at the cost of human freedom, individuality, and deep emotional connection.",
    imageURL: "/covers/brave-new-world.jpg",
    bookPDFURL: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    price: 11.20,
    condition: "Acceptable",
    conditionNote: "Harper Perennial edition. Reading wear; no notes or highlighting.",
    edition: "Harper Perennial",
    publishedYear: 2006,
    pages: 288,
    isbn: "9780060850524",
    status: "available",
    sellerId: "admin_seed",
    sellerEmail: "admin@example.com",
    sellerName: "The FolioFind desk"
  }
];

async function seedBooksIfNeeded(collections) {
  try {
    const count = await collections.books.countDocuments();
    if (count > 0) return;

    const admin = await collections.users.findOne({ role: "admin" });
    const docs = REAL_BOOKS.map(book => ({
      ...book,
      sellerId: admin ? String(admin._id) : book.sellerId,
      sellerEmail: admin?.email || book.sellerEmail,
      sellerName: admin ? "The FolioFind desk" : book.sellerName,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await collections.books.insertMany(docs);
    process.stdout.write("FolioFind demo inventory seeded.\n");
  } catch (err) {
    process.stderr.write(`Failed to seed books: ${err.message}\n`);
  }
}

module.exports = { seedBooksIfNeeded };
