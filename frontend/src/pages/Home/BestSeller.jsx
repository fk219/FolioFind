import { useEffect, useState } from 'react'
import BookCards from '../shared/BookCards';
import { listBooks } from '../../api/books';

const BestSeller = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const data = await listBooks();
                if (!cancelled) setBooks(data.slice(0, 8));
            } catch (e) {
                if (!cancelled) setBooks([]);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [])

    return (
        <>
            <BookCards books={books} headline={"Best Seller Books"} />
        </>
    )
}

export default BestSeller
