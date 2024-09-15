export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-2">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center space-y-4 md:flex-row md:justify-between md:space-y-0">
        <div className="text-center md:text-left">
          <h2 className="text-lg font-bold">Shop Together</h2>
          <p className="text-sm">© 2024 Shop Together. All rights reserved.</p>
        </div>
        <div className="flex space-x-4">
          <a href="#" className="hover:underline text-sm">
            Terms of Service
          </a>
          <a href="#" className="hover:underline text-sm">
            Privacy Policy
          </a>
          <a href="#" className="hover:underline text-sm">
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
}
