import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

export default function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all books
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/book/getAll"); // Adjust this route if needed
      const data = await response.json();
      setBooks(data);
      setError(null);
    } catch (error) {
      setError("Failed to fetch books.");
    }
    setLoading(false);
  };

  // Delete book by ID
  const deleteBook = async (bookId) => {
    try {
      await fetch(`/api/book/delete/${bookId}`, {
        method: "DELETE",
      });
      setBooks(books.filter((book) => book._id !== bookId));
    } catch (error) {
      setError("Failed to delete book.");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="p-5">
      <h2 className="text-2xl font-semibold mb-4">Manage Books</h2>
      {loading && <p>Loading books...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && books.length === 0 && <p>No books available.</p>}
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b text-left">Book Name</th>
            <th className="px-6 py-3 border-b text-left">Author</th>
            <th className="px-6 py-3 border-b text-left">Approval Status</th>
            <th className="px-6 py-3 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book._id}>
              <td className="px-6 py-4 border-b">
                <Link
                  to={`/book/${book._id}`}
                  className="text-blue-500 hover:underline"
                >
                  {book.name}
                </Link>
              </td>
              <td className="px-6 py-4 border-b">{book.author}</td>
              <td className="px-6 py-4 border-b">
                {book.approvalStatus === "Approved" ? (
                  <span className="text-green-500">Approved</span>
                ) : book.approvalStatus === "Under Review" ? (
                  <span className="text-yellow-500">Under Review</span>
                ) : (
                  <span className="text-red-500">Pending</span>
                )}
              </td>
              <td className="px-6 py-4 border-b">
                <button
                  onClick={() => deleteBook(book._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
