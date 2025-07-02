import Link from "next/link";

function NotFound() {
  return (
    <main className="flex items-center justify-center h-screen bg-gray-100 px-4">
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800">404</h1>
        <p className="text-lg md:text-2xl text-gray-600">
          Oops! The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-block bg-[#4A90E2] text-white px-6 py-3 text-lg font-medium rounded-lg transition-all duration-300 shadow-lg"
          >
            Go Back Home
          </Link>
        </div>
        <p className="text-sm text-gray-500">
          If you think this is a mistake, please contact support.
        </p>
      </div>
    </main>
  );
}

export default NotFound;
