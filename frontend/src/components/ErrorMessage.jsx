import { Link } from 'react-router-dom';

export default function ErrorMessage({ message }) {
  return (
    <div className="text-center py-12">
      <p className="text-red-500 text-xl mb-4">{message}</p>
      <Link
        to="/"
        className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
      >
        Вернуться на главную
      </Link>
    </div>
  );
}