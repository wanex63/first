import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-red-500 mb-4">404</h1>
      <p className="text-xl mb-4">Страница не найдена</p>
      <Link
        to="/"
        className="text-yellow-500 hover:underline"
      >
        Вернуться на главную
      </Link>
    </div>
  );
}