import { Table, Spinner } from 'flowbite-react'
import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthProvider';
import { deleteBook, listBooks } from '../api/books';

const ManageBooks = () => {
    const [allBooks, setAllBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useContext(AuthContext);
    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        (async () => {
            try {
                const { books } = await listBooks();
                if (!cancelled) setAllBooks(books);
            } catch (e) {
                if (!cancelled) setAllBooks([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Spinner aria-label="Loading books" size="xl" />
            </div>
        );
    }

    // delete a books
    const handleDelete = async (id) => {
        const ok = confirm("Delete this book?");
        if (!ok) return;
        try {
            await deleteBook({ token, id });
            setAllBooks((prev) => prev.filter((b) => b._id !== id));
        } catch (e) {
            alert("Delete failed.");
        }
      };

    return (
        <div className='px-4 my-12'>
            <h2 className='mb-8 text-3xl font-bold'>Manager Your Books Inventory!</h2>

            {/* table */}

            <Table className='lg:w-[1180px]'>
                <Table.Head>
                    <Table.HeadCell>
                        No.
                    </Table.HeadCell>
                    <Table.HeadCell>
                        Book name
                    </Table.HeadCell>
                    <Table.HeadCell>
                        Author Name
                    </Table.HeadCell>
                    <Table.HeadCell>
                        Category
                    </Table.HeadCell>
                    <Table.HeadCell>
                        Price
                    </Table.HeadCell>
                    <Table.HeadCell>
                        Edit or Manage
                    </Table.HeadCell>
                </Table.Head>

                {
                    allBooks.map((book, index) => <Table.Body className="divide-y" key={book._id}>
                        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                {index + 1}
                            </Table.Cell>
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                {book.bookTitle}
                            </Table.Cell>
                            <Table.Cell>
                                {book.authorName}
                            </Table.Cell>
                            <Table.Cell>
                                {book.category}
                            </Table.Cell>
                            <Table.Cell>
                                {book.price ? `$${book.price.toFixed(2)}` : '-'}
                            </Table.Cell>
                            <Table.Cell>
                                <Link
                                    className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 mr-5"
                                    to={`/admin/dashboard/edit-books/${book._id}`}
                                >
                                    Edit
                                </Link>
                                <button className='bg-red-600 px-4 py-1 font-semibold text-white rounded-sm hover:bg-sky-600' onClick={() => handleDelete(book._id)}>Delete</button>

                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>)
                }
            </Table>

            {allBooks.length > 10 && (
                <p className="text-center text-gray-400 text-sm mt-6">{allBooks.length} books total</p>
            )}
        </div>
    )
}

export default ManageBooks
