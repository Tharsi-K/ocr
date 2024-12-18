import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import BookItem from "../components/BookItem";

export default function Search() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    region: "all",
    sort: "created_at",
    order: "desc",
    approvalStatus: "Approved", // Default filter to 'Approved'
  });

  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const regionFromUrl = urlParams.get("region");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");
    const approvalStatusFromUrl = urlParams.get("approvalStatus");

    if (
      searchTermFromUrl ||
      regionFromUrl ||
      sortFromUrl ||
      orderFromUrl ||
      approvalStatusFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || "",
        region: regionFromUrl || "all",
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
        approvalStatus: approvalStatusFromUrl || "Approved",
      });
    }

    const fetchBooks = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/book/getAll?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setBooks(data);
      setLoading(false);
    };

    fetchBooks();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "Jaffna" ||
      e.target.id === "Batticaloa" ||
      e.target.id === "Upcountry" ||
      e.target.id === "Vanni" ||
      e.target.id === "Muslim Tamil" ||
      e.target.id === "Other"
    ) {
      setSidebardata({ ...sidebardata, region: e.target.id });
    }

    if (e.target.id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";
      setSidebardata({ ...sidebardata, sort, order });
    }

    if (e.target.id === "approvalStatus") {
      setSidebardata({ ...sidebardata, approvalStatus: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("region", sidebardata.region);
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);
    urlParams.set("approvalStatus", sidebardata.approvalStatus);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfBooks = books.length;
    const startIndex = numberOfBooks;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/book/getAll?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setBooks([...books, ...data]);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Region:</label>
            <div className="grid grid-cols-3 gap-x-2 gap-y-1">
              {/* Row 1 */}
              <div className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  id="all"
                  className="w-4 h-4"
                  onChange={handleChange}
                  checked={sidebardata.region === "all"}
                />
                <span className="text-sm">All</span>
              </div>
              <div className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  id="Jaffna"
                  className="w-4 h-4"
                  onChange={handleChange}
                  checked={sidebardata.region === "Jaffna"}
                />
                <span className="text-sm">Jaffna</span>
              </div>
              <div className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  id="Batticaloa"
                  className="w-4 h-4"
                  onChange={handleChange}
                  checked={sidebardata.region === "Batticaloa"}
                />
                <span className="text-sm">Batticaloa</span>
              </div>

              {/* Row 2 */}
              <div className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  id="Upcountry"
                  className="w-4 h-4"
                  onChange={handleChange}
                  checked={sidebardata.region === "Upcountry"}
                />
                <span className="text-sm">Upcountry</span>
              </div>
              <div className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  id="Vanni"
                  className="w-4 h-4"
                  onChange={handleChange}
                  checked={sidebardata.region === "Vanni"}
                />
                <span className="text-sm">Vanni</span>
              </div>
              <div className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  id="Muslim Tamil"
                  className="w-4 h-4"
                  onChange={handleChange}
                  checked={sidebardata.region === "Muslim Tamil"}
                />
                <span className="text-sm">Muslim Tamil</span>
              </div>

              {/* Row 3 */}
              <div className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  id="Other"
                  className="w-4 h-4"
                  onChange={handleChange}
                  checked={sidebardata.region === "Other"}
                />
                <span className="text-sm">Other</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              id="sort_order"
              className="border rounded-lg p-3"
            >
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>

          {/* Conditionally show the Approval Status filter for signed-in users */}
          {currentUser && (
            <div className="flex items-center gap-2">
              <label className="font-semibold">Approval Status:</label>
              <select
                onChange={handleChange}
                value={sidebardata.approvalStatus}
                id="approvalStatus"
                className="border rounded-lg p-3"
              >
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Under Review">Under Review</option>
              </select>
            </div>
          )}

          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>

      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Book results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && books.length === 0 && (
            <p className="text-xl text-slate-700">No Book found!</p>
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              Loading...
            </p>
          )}

          {!loading &&
            books &&
            books.map((book) => <BookItem key={book._id} book={book} />)}

          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-green-700 hover:underline p-7 text-center w-full"
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
