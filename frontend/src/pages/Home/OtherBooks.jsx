import { useEffect, useState } from 'react'
import BookCards from '../shared/BookCards';
import { listBooks } from '../../api/books';

const OtherBooks = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const { books } = await listBooks();
                if (!cancelled) setBooks(books.slice(5, 12));
            } catch (e) {
                if (!cancelled) setBooks([]);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [])

    return (
        <div className='mt-24'>
            <BookCards books={books} headline={"Other Books"} />
        </div>
    )
}

export default OtherBooks
