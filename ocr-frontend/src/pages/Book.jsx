import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaBookmark, FaUserAlt, FaBookOpen, FaMapMarkerAlt, FaShare } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function BookView() {
  const { currentUser } = useSelector((state) => state.user);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const params = useParams();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/book/get/${params.bookId}`);
        const data = await res.json();
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

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/review/get/${params.bookId}`);
        const data = await res.json();
        setReviews(data);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };
    fetchReviews();
  }, [params.bookId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/review/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({
          review: reviewText,
          bookRef: book._id,
          userRef: currentUser._id,
        }),
      });
  
      // Wait for the review to be created
      await res.json();
  
      // Re-fetch the reviews to get the populated username
      const reviewsRes = await fetch(`/api/review/get/${params.bookId}`);
      const reviewsData = await reviewsRes.json();
      setReviews(reviewsData);
  
      // Clear the review text
      setReviewText("");
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };
  

  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && <p className="text-center my-7 text-2xl">Something went wrong!</p>}
      {book && !loading && !error && (
        <div className="max-w-5xl mx-auto p-6 my-7">
          {/* Book details */}
          <div className="flex gap-10">
            <div className="w-1/3">
              <img
                src={book.imageUrls[0]}
                alt={book.name}
                className="w-full h-full object-cover"
              />
            </div>

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
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-10">
            <h3 className="text-2xl font-semibold mb-5">Reviews</h3>
            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review._id} className="p-4 bg-gray-100 rounded-lg">
                    <p className="font-semibold">{review.review}</p>
                    <p className="text-sm text-gray-600">Reviewed by {review.userRef.username}</p> {/* Use username */}
                  </div>
                ))
              ) : (
                <p>No reviews yet.</p>
              )}
            </div>

            {/* Review Form */}
            {currentUser && (
              <form onSubmit={handleReviewSubmit} className="mt-5">
                <textarea
                  className="w-full p-3 border rounded-md"
                  rows="4"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Write your review..."
                  required
                ></textarea>
                <button
                  type="submit"
                  className="bg-slate-700 text-white mt-3 px-4 py-2 rounded-lg"
                >
                  Submit Review
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
