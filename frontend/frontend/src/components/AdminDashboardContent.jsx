import { useEffect, useState } from 'react';
import { getProducts, getAllTransactions, getFarmers, getWeather, getArticles } from '../services/api';
import StatCard from '../components/StatCard';

export default function AdminDashboardContent() {
  const [stats, setStats] = useState({
    farmers: 0,
    products: 0,
    transactions: 0,
    totalRevenue: 0,
    totalCommission: 0,
  });
  const [weather, setWeather] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for hover effects
  const [hoveredSidebarLink, setHoveredSidebarLink] = useState(null);
  const [hoveredWeatherItem, setHoveredWeatherItem] = useState(null);
  const [hoveredArticleItem, setHoveredArticleItem] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [farmersRes, productsRes, txRes, weatherRes, artRes] = await Promise.all([
          getFarmers(),
          getProducts(),
          getAllTransactions(),
          getWeather(),
          getArticles(),
        ]);

        const totalRevenue = txRes.data.reduce((sum, t) => sum + parseFloat(t.total_price), 0);
        const totalCommission = txRes.data.reduce((sum, t) => sum + parseFloat(t.commission_fee), 0);

        setStats({
          farmers: farmersRes.data.length,
          products: productsRes.data.length,
          transactions: txRes.data.length,
          totalRevenue,
          totalCommission,
        });
        setWeather(weatherRes.data);
        setArticles(artRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Styles
  const styles = {
    // Base container
    container: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb', // gray-50
    },
    // Sidebar
    sidebar: {
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      width: '256px',
      backgroundColor: '#ffffff',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      transform: 'translateX(-100%)',
      transition: 'transform 0.2s ease-in-out',
      zIndex: 30,
    },
    sidebarVisible: {
      transform: 'translateX(0)',
    },
    sidebarHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '64px',
      borderBottom: '1px solid #e5e7eb', // gray-200
    },
    sidebarTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#1f2937', // gray-800
    },
    nav: {
      marginTop: '24px',
    },
    navLink: (isActive, isHovered) => ({
      display: 'block',
      padding: '10px 16px',
      borderRadius: '4px',
      textDecoration: 'none',
      transition: 'background-color 0.2s',
      backgroundColor: isActive ? '#eff6ff' : isHovered ? '#f3f4f6' : 'transparent', // blue-50 / gray-100
      color: isActive ? '#2563eb' : '#374151', // blue-600 / gray-700
      borderLeft: isActive ? '4px solid #2563eb' : 'none',
    }),
    // Main content
    main: {
      marginLeft: '256px',
      padding: '24px',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '32px',
    },
    headerTitle: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: '#1f2937', // gray-800
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    adminName: {
      fontSize: '0.875rem',
      color: '#4b5563', // gray-600
    },
    avatar: {
      width: '32px',
      height: '32px',
      backgroundColor: '#3b82f6', // blue-500
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ffffff',
      fontWeight: '600',
    },
    // Stat cards grid
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '24px',
      marginBottom: '32px',
    },
    // Weather & Articles grid
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '24px',
      marginBottom: '32px',
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      padding: '24px',
    },
    cardTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
    },
    cardTitleIcon: {
      marginRight: '8px',
    },
    weatherItem: (isHovered) => ({
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px',
      backgroundColor: isHovered ? '#f3f4f6' : '#f9fafb', // gray-100 / gray-50
      borderRadius: '8px',
      transition: 'background-color 0.2s',
      cursor: 'pointer',
    }),
    weatherDistrict: {
      fontWeight: '500',
      color: '#374151', // gray-700
    },
    weatherDetails: {
      color: '#4b5563', // gray-600
    },
    articleItem: (isHovered) => ({
      padding: '12px',
      backgroundColor: isHovered ? '#f3f4f6' : '#f9fafb', // gray-100 / gray-50
      borderRadius: '8px',
      transition: 'background-color 0.2s',
      cursor: 'pointer',
    }),
    articleLink: {
      color: '#2563eb', // blue-600
      textDecoration: 'none',
      fontWeight: '500',
    },
    // Quick management
    quickActions: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      padding: '24px',
    },
    quickActionsTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
    },
    buttonContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '12px',
    },
    button: (bgColor, hoverColor, isHovered) => ({
      padding: '10px 20px',
      backgroundColor: isHovered ? hoverColor : bgColor,
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1rem',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-block',
      transition: 'background-color 0.2s',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    }),
    // Loading skeleton
    loadingContainer: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingPulse: {
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      width: '48px',
      height: '48px',
      backgroundColor: '#e5e7eb', // gray-200
      borderRadius: '4px',
    },
  };

  // Inject keyframes for loading animation (inline style cannot define keyframes, so we add a style tag)
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingPulse}></div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={{ ...styles.sidebar, ...(window.innerWidth >= 768 ? styles.sidebarVisible : {}) }}>
        <div style={styles.sidebarHeader}>
          <h1 style={styles.sidebarTitle}>Admin Panel</h1>
        </div>
        <nav style={styles.nav}>
          {[
            { href: '/admin', label: 'Dashboard', active: true },
            { href: '/admin/users', label: 'Users', active: false },
            { href: '/admin/products', label: 'Products', active: false },
            { href: '/admin/transactions', label: 'Transactions', active: false },
            { href: '/admin/weather', label: 'Weather', active: false },
            { href: '/admin/advisory', label: 'Advisory', active: false },
          ].map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              style={styles.navLink(link.active, hoveredSidebarLink === index)}
              onMouseEnter={() => setHoveredSidebarLink(index)}
              onMouseLeave={() => setHoveredSidebarLink(null)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Header */}
        <header style={styles.header}>
          <h1 style={styles.headerTitle}>Dashboard</h1>
          <div style={styles.headerRight}>
            <span style={styles.adminName}>Admin</span>
            <div style={styles.avatar}>A</div>
          </div>
        </header>

        {/* Stat Cards */}
        <div style={styles.statsGrid}>
          <StatCard title="Farmers" value={stats.farmers} icon="👨‍🌾" />
          <StatCard title="Products" value={stats.products} icon="📦" />
          <StatCard title="Transactions" value={stats.transactions} icon="🔄" />
          <StatCard title="Revenue" value={`RWF ${stats.totalRevenue.toLocaleString()}`} icon="💰" />
          <StatCard title="Commission" value={`RWF ${stats.totalCommission.toLocaleString()}`} icon="⚖️" />
        </div>

        {/* Weather and Articles */}
        <div style={styles.infoGrid}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              <span style={styles.cardTitleIcon}>🌤️</span> Recent Weather Updates
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {weather.slice(0, 5).map((w, idx) => (
                <div
                  key={w.weather_id}
                  style={styles.weatherItem(hoveredWeatherItem === idx)}
                  onMouseEnter={() => setHoveredWeatherItem(idx)}
                  onMouseLeave={() => setHoveredWeatherItem(null)}
                >
                  <span style={styles.weatherDistrict}>{w.district}</span>
                  <span style={styles.weatherDetails}>
                    {w.temperature}°C | rain {w.rainfall_probability}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              <span style={styles.cardTitleIcon}>📰</span> Recent Advisory Articles
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {articles.slice(0, 5).map((a, idx) => (
                <div
                  key={a.article_id}
                  style={styles.articleItem(hoveredArticleItem === idx)}
                  onMouseEnter={() => setHoveredArticleItem(idx)}
                  onMouseLeave={() => setHoveredArticleItem(null)}
                >
                  <a href={`/advisory/${a.article_id}`} style={styles.articleLink}>
                    {a.title}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Management */}
        <div style={styles.quickActions}>
          <h2 style={styles.quickActionsTitle}>
            <span style={styles.cardTitleIcon}>⚡</span> Quick Management
          </h2>
          <div style={styles.buttonContainer}>
            {[
              { href: '/admin/users', label: 'Manage Users', bg: '#2563eb', hover: '#1d4ed8' },
              { href: '/admin/products', label: 'Manage Products', bg: '#16a34a', hover: '#15803d' },
              { href: '/admin/transactions', label: 'View Transactions', bg: '#9333ea', hover: '#7e22ce' },
              { href: '/admin/weather', label: 'Update Weather', bg: '#ca8a04', hover: '#a16207' },
              { href: '/admin/advisory', label: 'Manage Advisory', bg: '#dc2626', hover: '#b91c1c' },
            ].map((btn, idx) => (
              <a
                key={btn.href}
                href={btn.href}
                style={styles.button(btn.bg, btn.hover, hoveredButton === idx)}
                onMouseEnter={() => setHoveredButton(idx)}
                onMouseLeave={() => setHoveredButton(null)}
              >
                {btn.label}
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}