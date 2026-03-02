import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Map user_type to a readable label (adjust keys to match your backend values)
  const userTypeMap = {
    farmer: '🌾 Farmer',
    cooperative: '🤝 Cooperative',
    buyer: '🛒 Buyer',
    admin: '⚙️ Admin',
  };

  // Use optional chaining and fallbacks
  const displayName = user?.full_name || user?.email || 'User';
  const displayType = user
    ? userTypeMap[user.user_type?.toLowerCase()] || 'Unknown user type'
    : '';

  return (
    <nav style={navStyle}>
      <div style={logoStyle}>
        <Link to="/" style={linkStyle}>AgriPlatform</Link>
      </div>

      <div style={navLinksStyle}>
        {user ? (
          <>
            <span style={userInfoStyle}>
              {displayName} <span style={userTypeStyle}>({displayType})</span>
            </span>
            <button onClick={handleLogout} style={logoutButtonStyle}>
              🚪 Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/register" style={linkStyle}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

// Simple inline styles – replace with your own or CSS classes
const navStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem 2rem',
  backgroundColor: '#0b4f6c',
  color: 'white',
};

const logoStyle = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
};

const navLinksStyle = {
  display: 'flex',
  gap: '1.5rem',
  alignItems: 'center',
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  fontWeight: '500',
};

const userInfoStyle = {
  marginRight: '1rem',
};

const userTypeStyle = {
  fontSize: '0.85rem',
  opacity: 0.9,
};

const logoutButtonStyle = {
  background: 'transparent',
  border: '1px solid white',
  color: 'white',
  padding: '0.4rem 1rem',
  borderRadius: '2rem',
  cursor: 'pointer',
  fontSize: '0.9rem',
};