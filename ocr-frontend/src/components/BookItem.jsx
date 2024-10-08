import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';

export default function BookItem({ book }) {
  return (
    <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]'>
      <Link to={`/book/${book._id}`}>
        <img
          src={
            book.imageUrls[0] ||
            'https://media.istockphoto.com/id/173015527/photo/a-single-red-book-on-a-white-surface.jpg?s=612x612&w=0&k=20&c=AeKmdZvg2_bRY2Yct7odWhZXav8CgDtLMc_5_pjSItY='
          }
          alt='book cover'
          className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
        />
        <div className='p-3 flex flex-col gap-2 w-full'>
          <p className='truncate text-lg font-semibold text-slate-700'>
            {book.name}
          </p>
          <div className='flex items-center gap-1'>
            <MdLocationOn className='h-4 w-4 text-green-700' />
            <p className='text-sm text-gray-600 truncate w-full'>
              {book.author}
            </p>
          </div>
          <p className='text-sm text-gray-600 line-clamp-2'>
            {book.description}
          </p>
        </div>
      </Link>
    </div>
  );
}