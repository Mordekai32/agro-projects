import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const farmerLinks = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/products', label: 'My Products', icon: '🌽' },
  { to: '/add-product', label: 'Add Product', icon: '➕' },
  { to: '/transactions', label: 'Sales', icon: '💰' },
  { to: '/weather', label: 'Weather', icon: '☀️' },
  { to: '/advisory', label: 'Advisory', icon: '📚' },
];

const buyerLinks = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/products', label: 'Browse Products', icon: '🌾' },
  { to: '/my-purchases', label: 'My Purchases', icon: '🛒' },
  { to: '/weather', label: 'Weather', icon: '☀️' },
  { to: '/advisory', label: 'Advisory', icon: '📚' },
];

const adminLinks = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/admin/users', label: 'Users', icon: '👥' },
  { to: '/admin/products', label: 'Products', icon: '📦' },
  { to: '/admin/transactions', label: 'Transactions', icon: '🔄' },
  { to: '/admin/weather', label: 'Weather', icon: '☀️' },
  { to: '/admin/advisory', label: 'Advisory', icon: '📚' },
];

export default function Sidebar({ closeSidebar }) {
  const { user, logout } = useAuth();

  let links = [];
  if (user?.type === 'farmer' || user?.type === 'cooperative') links = farmerLinks;
  else if (user?.type === 'buyer') links = buyerLinks;
  else if (user?.type === 'admin') links = adminLinks;

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-green-600">AgriPlatform</h1>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <span className="mr-3 text-lg">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <span className="mr-3">🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
}