import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("Approved"); // Default Approval Status
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    urlParams.set("approvalStatus", approvalStatus); // Add approval status to URL params
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const approvalStatusFromUrl = urlParams.get("approvalStatus");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
    if (approvalStatusFromUrl) {
      setApprovalStatus(approvalStatusFromUrl);
    }
  }, [location.search]);

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Tamil</span>
            <span className="text-slate-700">OCR</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-3 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {currentUser && ( // Conditionally show the Approval Status filter for signed-in users
            <select
              value={approvalStatus}
              onChange={(e) => setApprovalStatus(e.target.value)}
              className="ml-3 p-2 border rounded-lg"
            >
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
            </select>
          )}
          <button type="submit">
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              About
            </li>
          </Link>
          {(currentUser?.role === "Admin" || currentUser?.role === "User") && (
            <Link to="/add-book">
              <li className="text-slate-700 hover:underline">Add Book</li>
            </Link>
          )}
          {/* Show Admin Page if user is an Admin */}
          {currentUser?.role === "Admin" && (
            <Link to="/admin">
              <li className="text-slate-700 hover:underline">Admin Panel</li>
            </Link>
          )}
          <Link to="/profile">
            {currentUser ? (
              <img
                className="rounded-full h-7 w-7 object-cover"
                src={currentUser.avatar}
                alt="profile"
              />
            ) : (
              <li className="text-slate-700 hover:underline">Sign-In</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
