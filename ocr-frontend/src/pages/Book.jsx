import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaBookmark, FaUserAlt, FaBookOpen, FaMapMarkerAlt, FaShare } from "react-icons/fa";
import { useSelector } from "react-redux";
// import Contact from "../components/Contact"; // If you have a contact feature

export default function BookView() {
  const { currentUser } = useSelector((state) => state.user);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/book/get/${params.bookId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setBook(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchBook();
  }, [params.bookId]);

  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && <p className="text-center my-7 text-2xl">Something went wrong!</p>}
      {book && !loading && !error && (
        <div className="max-w-5xl mx-auto p-6 my-7">
          {/* Share Button */}
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}

          {/* Book details */}
          <div className="flex gap-10">
            {/* Book image */}
            <div className="w-1/3">
              <img
                src={book.imageUrls[0]}
                alt={book.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Book info and extracted text */}
            <div className="w-2/3 flex flex-col gap-4">
              <p className="text-3xl font-semibold">{book.name}</p>
              <p className="text-sm flex items-center gap-2 text-slate-600">
                <FaUserAlt className="text-green-700" />
                Author: {book.author}
              </p>
              <p className="text-sm flex items-center gap-2 text-slate-600">
                <FaBookmark className="text-green-700" />
                ISBN: {book.ISBN}
              </p>
              <p className="flex items-center gap-2 text-slate-600 text-sm">
                <FaMapMarkerAlt className="text-green-700" />
                Type: {book.type}
              </p>
              <p className="text-slate-800">
                <span className="font-semibold text-black">Description - </span>
                {book.description}
              </p>

              <div className="bg-gray-100 p-4 rounded-md">
                <h3 className="text-lg font-semibold mb-3">Extracted Text</h3>
                <pre className="whitespace-pre-wrap">
                  {book.bookContent[0]?.chapterText || "No text available"}
                </pre>
              </div>

              {/* Contact Publisher */}
              {/* {currentUser && book.userRef !== currentUser._id && !contact && (
                <button
                  onClick={() => setContact(true)}
                  className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
                >
                  Contact Publisher
                </button>
              )}
              {contact && <Contact book={book} />} */}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
