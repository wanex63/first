export default function Footer() {
  return (
    <footer className="bg-gray-800 py-6">
      <div className="container mx-auto px-4 text-center text-gray-400">
        <p>© 2024 KinoPoisk. Все права защищены.</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="#" className="hover:text-yellow-500">Политика конфиденциальности</a>
          <a href="#" className="hover:text-yellow-500">Контакты</a>
        </div>
      </div>
    </footer>
  );
}