import { useAuth } from '../context/AuthContext';

export default function Header({ toggleSidebar }) {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex-1" />
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-600 hidden sm:inline">
            {user?.name} ({user?.type})
          </span>
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
            {user?.name?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
}