import { Outlet } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}