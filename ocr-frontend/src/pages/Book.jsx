import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaBookmark, FaUserAlt, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";

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

    const hasReviewed = reviews.some(
      (review) => review.userRef === currentUser._id
    );
    if (hasReviewed) {
      alert("You have already submitted a review for this book.");
      return;
    }

    if (book.userRef === currentUser._id) {
      alert("You cannot review a book you have created.");
      return;
    }

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

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to submit review");
        return;
      }

      const reviewsRes = await fetch(`/api/review/get/${params.bookId}`);
      const reviewsData = await reviewsRes.json();
      setReviews(reviewsData);

      setReviewText("");
    } catch (error) {
      console.error("Failed to submit review:", error);
      alert("An error occurred while submitting the review.");
    }
  };

  const handleApproveClick = async () => {
    try {
      const res = await fetch(`/api/book/approve/${book._id}`, {
        method: "PUT", // Change from PATCH to PUT
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setBook({ ...book, approvalStatus: "Approved" });
      } else {
        alert(data.message || "Failed to approve book");
      }
    } catch (error) {
      console.error("Failed to approve book:", error);
      alert("An error occurred while approving the book.");
    }
  };

  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong!</p>
      )}
      {book && !loading && !error && (
        <div>
          <div className="w-4/5 mx-auto p-6 my-7">
            <div className="w-full bg-white mb-10 p-5 flex items-start">
              {/* Book Cover */}
              <div className="w-20 h-28 mr-5">
                <img
                  src={book.imageUrls[0]}
                  alt={book.name}
                  className="w-full h-full object-cover rounded-md shadow"
                />
              </div>

              {/* Book Details */}
              <div className="flex-1">
                <p className="text-3xl font-semibold">{book.name}</p>
                <p className="text-sm flex items-center gap-2 text-slate-600">
                  <FaUserAlt className="text-green-700" /> எழுத்தாளர்:{" "}
                  {book.author}
                </p>
                <p className="text-sm flex items-center gap-2 text-slate-600">
                  <FaBookmark className="text-green-700" /> தொகுப்பு எண்:{" "}
                  {book.ISBN}
                </p>
                <p className="flex items-center gap-2 text-slate-600 text-sm">
                  <FaMapMarkerAlt className="text-green-700" /> கிளைமொழி/ வட்டார
                  வழக்கு: {book.region}
                </p>
                <p className="text-sm flex items-center gap-2 text-slate-600">
                  <FaClock className="text-green-700" />
                  ஆண்டு: {book.year}
                </p>
              </div>

              <div className="flex">
                <div className="w-1/2">
                  <p className="text-slate-800">
                    <span className="font-semibold text-black">
                      விளக்கம் :{" "}
                    </span>
                    {book.description}
                  </p>
                  <p className="text-slate-800">
                    <span className="font-semibold text-black">ஊடகம் : </span>
                    {book.media}
                  </p>

                  <p className="text-slate-800">
                    <span className="font-semibold text-black">மொழி : </span>
                    {book.language}
                  </p>

                  <p className="text-slate-800">
                    <span className="font-semibold text-black">நிலை : </span>
                    {book.condition}
                  </p>

                  <p className="text-slate-800">
                    <span className="font-semibold text-black">ஆவண வகை : </span>
                    {book.documentType}
                  </p>

                  <p className="text-slate-800">
                    <span className="font-semibold text-black">
                      எழுத்து வகை :{" "}
                    </span>
                    {book.textStyle}
                  </p>
                </div>
                <div className="w-1/2">
                  <p className="text-slate-800">
                    <span className="font-semibold text-black">
                      பதிப்பாளர் :{" "}
                    </span>
                    {book.publisher}
                  </p>

                  <p className="text-slate-800">
                    <span className="font-semibold text-black">
                      பதிப்புரிமை :{" "}
                    </span>
                    {book.copyright}
                  </p>

                  <p className="text-slate-800">
                    <span className="font-semibold text-black">
                      இணைய இணைப்பு :{" "}
                    </span>
                    {book.internetReference}
                  </p>

                  <p className="text-slate-800">
                    <span className="font-semibold text-black">
                      வெளியீடு :{" "}
                    </span>
                    {book.release}
                  </p>

                  <p className="text-slate-800">
                    <span className="font-semibold text-black">
                      மூலத்தை வைத்திருப்பவர் :{" "}
                    </span>
                    {book.sourceHolder}
                  </p>

                  <p className="text-slate-800">
                    <span className="font-semibold text-black">முகவரி : </span>
                    {book.address}
                  </p>

                  <p className="text-slate-800">
                    <span className="font-semibold text-black">
                      சேகரித்தவர் :{" "}
                    </span>
                    {book.collector}
                  </p>

                  <p className="text-slate-800">
                    <span className="font-semibold text-black">திகதி : </span>
                    {book.Date}
                  </p>

                  <p className="text-slate-800">
                    <span className="font-semibold text-black">
                      திறவுச்சொற்கள் :{" "}
                    </span>
                    {book.keyWords}
                  </p>
                </div>
              </div>
            </div>

            {/* Image and text side by side */}
            <div className="flex mt-4 space-x-4 w-full">
              {/* PDF Viewer on the Left */}
              <div className="flex-1 w-full">
                <h2 className="text-xl font-medium mb-2">PDF Preview</h2>
                {book.pdfUrl && (
                  <embed
                    src={book.pdfUrl}
                    width="100%"
                    height="500px"
                    type="application/pdf"
                  />
                )}
              </div>

              {/* Extracted Text on the Right */}
              <div className="flex-1 w-full">
                <h2 className="text-xl font-medium mb-2">Extracted Text</h2>
                <textarea
                  value={
                    book.bookContent[0]?.chapterText || "No text available"
                  }
                  readOnly
                  rows="20"
                  cols="50"
                  placeholder="Extracted text will appear here..."
                  className="border border-gray-300 p-2 rounded-md w-full"
                />
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-10">
              <h3 className="text-2xl font-semibold mb-5">Reviews</h3>
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div
                      key={review._id}
                      className="p-4 bg-gray-100 rounded-lg"
                    >
                      <p className="font-semibold">{review.review}</p>
                      <p className="text-sm text-gray-600">
                        Reviewed by {review.userRef.username}
                      </p>
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

              {/* Approve Button (Only visible to admins and when review count is 2) */}
              {currentUser?.role === "Admin" && book.reviewCount === 2 && (
                <button
                  onClick={handleApproveClick}
                  className="bg-green-600 text-white px-4 py-2 mt-5 rounded-md"
                >
                  Approve Book
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
