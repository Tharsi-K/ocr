import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

export default function BookItem({ book }) {
  return (
    <div className="group relative w-[200px] h-[320px] bg-white rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:-rotate-1">
      {/* Spine Simulation */}
      <div className="absolute top-0 left-0 w-[12px] h-full bg-gradient-to-r from-gray-400 to-gray-300 rounded-l-lg shadow-inner"></div>

      {/* Book Cover */}
      <Link to={`/book/${book._id}`}>
        <div className="relative z-10 h-full w-full overflow-hidden rounded-lg">
          <img
            src={
              book.imageUrls[0] ||
              "https://media.istockphoto.com/id/173015527/photo/a-single-red-book-on-a-white-surface.jpg?s=612x612&w=0&k=20&c=AeKmdZvg2_bRY2Yct7odWhZXav8CgDtLMc_5_pjSItY="
            }
            alt="book cover"
            className="h-full w-full object-cover"
          />
          {/* Text Content */}
          <div className="absolute bottom-0 w-full p-2 bg-white bg-opacity-90">
            <p className="truncate text-base font-bold text-slate-700">
              {book.name}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <MdLocationOn className="h-4 w-4 text-green-700" />
              <p className="text-sm text-gray-600 truncate">{book.author}</p>
            </div>
          </div>
        </div>
      </Link>

      {/* Book Bottom Edge */}
      <div className="absolute bottom-0 left-0 w-full h-[8px] bg-gray-200 rounded-b-lg shadow-inner"></div>
    </div>
  );
}
