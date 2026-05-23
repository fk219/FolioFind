const REAL_BOOKS = [
  {
    bookTitle: "The Great Gatsby",
    authorName: "F. Scott Fitzgerald",
    category: "Fiction",
    bookDescription: "A portrait of the Jazz Age in all its decadence and excess, Gatsby explores the disillusionment of the American Dream through the mysterious Jay Gatsby and his obsession with the beautiful Daisy Buchanan.",
    imageURL: "https://covers.openlibrary.org/b/id/8432047-L.jpg",
    bookPDFURL: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    price: 12.99,
    condition: "Like New",
    status: "available",
    sellerId: "admin_seed",
    sellerEmail: "admin@example.com",
    sellerName: "FolioFind Admin"
  },
  {
    bookTitle: "To Kill a Mockingbird",
    authorName: "Harper Lee",
    category: "Fiction",
    bookDescription: "Set in the American South during the Great Depression, this classic novel addresses the deeply rooted racial injustices through the innocent eyes of young Scout Finch and her father, the heroic lawyer Atticus Finch.",
    imageURL: "https://covers.openlibrary.org/b/id/8226191-L.jpg",
    bookPDFURL: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    price: 14.50,
    condition: "Good",
    status: "available",
    sellerId: "admin_seed",
    sellerEmail: "admin@example.com",
    sellerName: "FolioFind Admin"
  },
  {
    bookTitle: "1984",
    authorName: "George Orwell",
    category: "Fiction",
    bookDescription: "Orwell's dystopian masterpiece introduces a chilling vision of a totalitarian state under Big Brother, where history is rewritten, language is weaponized, and the individual soul is utterly crushed.",
    imageURL: "https://covers.openlibrary.org/b/id/12711674-L.jpg",
    bookPDFURL: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    price: 10.99,
    condition: "New",
    status: "available",
    sellerId: "admin_seed",
    sellerEmail: "admin@example.com",
    sellerName: "FolioFind Admin"
  },
  {
    bookTitle: "Dune",
    authorName: "Frank Herbert",
    category: "Science",
    bookDescription: "The sweeping sci-fi epic set on the desert planet Arrakis. Dune tells the story of Paul Atreides as he navigates political betrayal, ecology, and messianic destiny in a futuristic feudal empire.",
    imageURL: "https://covers.openlibrary.org/b/id/10325997-L.jpg",
    bookPDFURL: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    price: 18.99,
    condition: "New",
    status: "available",
    sellerId: "admin_seed",
    sellerEmail: "admin@example.com",
    sellerName: "FolioFind Admin"
  },
  {
    bookTitle: "Atomic Habits",
    authorName: "James Clear",
    category: "Self-Help",
    bookDescription: "The definitive guide to breaking bad habits and building good ones. James Clear provides practical, scientifically-backed frameworks for getting 1% better every single day through micro-behavioral changes.",
    imageURL: "https://covers.openlibrary.org/b/id/12836262-L.jpg",
    bookPDFURL: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    price: 16.95,
    condition: "Like New",
    status: "available",
    sellerId: "admin_seed",
    sellerEmail: "admin@example.com",
    sellerName: "FolioFind Admin"
  },
  {
    bookTitle: "Sapiens: A Brief History of Humankind",
    authorName: "Yuval Noah Harari",
    category: "History",
    bookDescription: "Harari takes us on a breathtaking journey from early modern humans walking the Earth to the cognitive, agricultural, and scientific revolutions that shaped modern civilization.",
    imageURL: "https://covers.openlibrary.org/b/id/14354714-L.jpg",
    bookPDFURL: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    price: 19.99,
    condition: "Good",
    status: "available",
    sellerId: "admin_seed",
    sellerEmail: "admin@example.com",
    sellerName: "FolioFind Admin"
  },
  {
    bookTitle: "The Hobbit",
    authorName: "J.R.R. Tolkien",
    category: "Fantasy",
    bookDescription: "The precursor to The Lord of the Rings. Bilbo Baggins is whisked away from his comfortable hobbit-hole by Gandalf and a company of dwarves on an epic quest to reclaim the Lonely Mountain and its treasure from the dragon Smaug.",
    imageURL: "https://covers.openlibrary.org/b/id/8405788-L.jpg",
    bookPDFURL: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    price: 15.00,
    condition: "Like New",
    status: "available",
    sellerId: "admin_seed",
    sellerEmail: "admin@example.com",
    sellerName: "FolioFind Admin"
  },
  {
    bookTitle: "Brave New World",
    authorName: "Aldous Huxley",
    category: "Fiction",
    bookDescription: "A dark vision of a genetically-engineered, soma-medicated society where pain has been engineered away at the cost of human freedom, individuality, and deep emotional connection.",
    imageURL: "https://covers.openlibrary.org/b/id/10290518-L.jpg",
    bookPDFURL: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    price: 11.20,
    condition: "Acceptable",
    status: "available",
    sellerId: "admin_seed",
    sellerEmail: "admin@example.com",
    sellerName: "FolioFind Admin"
  }
];

async function seedBooksIfNeeded(collections) {
  try {
    const count = await collections.books.countDocuments();
    if (count > 0) return;

    const docs = REAL_BOOKS.map(book => ({
      ...book,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await collections.books.insertMany(docs);
    console.log("📚 Real book inventory seeded successfully!");
  } catch (err) {
    console.error("❌ Failed to seed books:", err.message);
  }
}

module.exports = { seedBooksIfNeeded };
