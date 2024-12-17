import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ScanText,
  Zap,
  Check,
  Clock,
  CloudLightning,
  Upload,
  Cpu,
  FileText,
} from "lucide-react";
import BookItem from "../components/BookItem";
import { useSelector } from "react-redux";

export default function Home() {
  const [pendingBooks, setPendingBooks] = useState([]);
  const [approvedBooks, setApprovedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);

      try {
        let approvedUrl =
          "/api/book/getAll?sort=createdAt&order=desc&limit=5&approvalStatus=Approved";
        const approvedRes = await fetch(approvedUrl);
        const approvedData = await approvedRes.json();
        setApprovedBooks(approvedData);

        if (currentUser) {
          // Fetch Pending & Under Review books for signed-in users
          let pendingUrl =
            "/api/book/getAll?sort=createdAt&order=desc&limit=5&approvalStatus=Pending,Under Review";
          const pendingRes = await fetch(pendingUrl);
          const pendingData = await pendingRes.json();
          setPendingBooks(pendingData);
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    fetchBooks();
  }, [currentUser]);

  const features = [
    {
      icon: <Zap className="h-6 w-6 text-blue-600" />,
      title: "Digital Preservation",
      description:
        "Converts non-editable Tamil books (PDFs/images) into editable and searchable text, preserving Tamil literature digitally.",
    },
    {
      icon: <Check className="h-6 w-6 text-blue-600" />,
      title: "Accuracy Assurance",
      description:
        "Ensures high accuracy through a multi-level review process involving proofreaders and admin validation.",
    },
    {
      icon: <Clock className="h-6 w-6 text-blue-600" />,
      title: "User Contribution",
      description:
        "Allows users to upload books, add details, and participate in the proofreading process for collaborative accuracy.",
    },
    {
      icon: <CloudLightning className="h-6 w-6 text-blue-600" />,
      title: "Secure Accessibility",
      description:
        "Provides secure, role-based access on web and mobile platforms, enabling easy and user-friendly interaction with digitized content.",
    },
  ];

  return (
    <main>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Converts Tamil PDFs into editable and searchable text.
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                The system digitizes Tamil PDF books by converting them into
                editable and searchable text, ensuring accessibility and
                accuracy through OCR technology and human validation.
              </p>
              <Link
                to="/add-book"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 hover:bg-blue-700 transition-colors inline-flex"
              >
                <ScanText className="h-5 w-5" />
                <span>Start Converting Now</span>
              </Link>
            </div>
            <div className="lg:w-1/2">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/tamil-ocr-bd972.appspot.com/o/IMG-20241217-WA0028.jpg?alt=media&token=611dc0ce-c2f6-4fb2-9e52-5769f407fc50"
                alt="Tamil manuscript"
                className="rounded-lg shadow-2xl"
                style={{ height: "50vh", width: "600px" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose TamilOCR?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approved Books Section */}
      <div className="max-w-6xl mx-auto p-3 my-10">
        <h1 className="text-2xl font-semibold mb-5 text-slate-700">
          Approved Books
        </h1>
        {loading ? (
          <p>Loading...</p>
        ) : approvedBooks.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {approvedBooks.map((book) => (
              <BookItem key={book._id} book={book} />
            ))}
          </div>
        ) : (
          <p>No approved books available.</p>
        )}
      </div>

      {/* Pending & Under Review Books Section (Only for Signed-In Users) */}
      {currentUser && (
        <div className="max-w-6xl mx-auto p-3 my-10">
          <h1 className="text-2xl font-semibold mb-5 text-slate-700">
            Pending and Under Review Books
          </h1>
          {loading ? (
            <p>Loading...</p>
          ) : pendingBooks.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {pendingBooks.map((book) => (
                <BookItem key={book._id} book={book} />
              ))}
            </div>
          ) : (
            <p>No pending or under review books available.</p>
          )}
        </div>
      )}

      {/* Message for Not Signed-In Users */}
      {!currentUser && (
        <div className="text-center mt-4">
          <Link to="/sign-in" className="text-blue-600 hover:underline">
            Sign in to view more books
          </Link>
        </div>
      )}

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-12">
            <div className="flex flex-col items-center text-center max-w-xs">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload PDF</h3>
              <p className="text-gray-600">
                Users upload Tamil books in PDF format with relevant details.
              </p>
            </div>
            <div className="flex flex-col items-center text-center max-w-xs">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <Cpu className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Process</h3>
              <p className="text-gray-600">
                The system uses OCR to extract text, followed by review and
                validation by proofreaders.
              </p>
            </div>
            <div className="flex flex-col items-center text-center max-w-xs">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Results</h3>
              <p className="text-gray-600">
                Approved, accurate text is provided in an editable and
                searchable format.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
