import { Link } from 'react-router-dom';
import { FaceFrownIcon } from '@heroicons/react/24/outline';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <div className="text-center max-w-md">
        <FaceFrownIcon className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl mb-6">Страница не найдена</p>
        <Link
          to="/"
          className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-lg transition"
        >
          На главную
        </Link>
      </div>
    </div>
  );
}