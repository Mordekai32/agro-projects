import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProducts, getSellerTransactions, getWeather, getArticles } from '../services/api';
import StatCard from '../components/StatCard';
import ProductTable from '../components/ProductTable';
import TransactionTable from '../components/TransactionTable';

export default function FarmerDashboardContent() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [weather, setWeather] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredWeather, setHoveredWeather] = useState(null);
  const [hoveredArticle, setHoveredArticle] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, txRes, weatherRes, artRes] = await Promise.all([
          getProducts(),
          getSellerTransactions(),
          getWeather(),
          getArticles(),
        ]);
        const myProducts = prodRes.data.filter(p => p.farmer_id === user.id);
        setProducts(myProducts);
        setTransactions(txRes.data);
        setWeather(weatherRes.data);
        setArticles(artRes.data.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Inject keyframes for loading shimmer
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes shimmer {
        0% { background-position: -1000px 0; }
        100% { background-position: 1000px 0; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Blue & white color palette
  const colors = {
    white: '#ffffff',
    offWhite: '#f8fafd',
    lightBlue: '#e6f0ff',
    softBlue: '#d4e4ff',
    primaryBlue: '#2b6ef0',
    mediumBlue: '#1e5ad9',
    darkBlue: '#103a7c',
    textDark: '#1a2b4c',
    textLight: '#5a6e8c',
    borderLight: '#d9e2f0',
    shadow: 'rgba(0, 40, 100, 0.08)',
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: colors.offWhite,
      fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      padding: '24px 32px',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '32px',
    },
    headerLeft: {
      display: 'flex',
      flexDirection: 'column',
    },
    greeting: {
      fontSize: '0.875rem',
      color: colors.textLight,
      marginBottom: '4px',
    },
    title: {
      fontSize: '2rem',
      fontWeight: '700',
      color: colors.darkBlue,
      margin: 0,
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    userName: {
      fontSize: '1rem',
      color: colors.textDark,
    },
    avatar: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      background: `linear-gradient(145deg, ${colors.primaryBlue}, ${colors.mediumBlue})`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: colors.white,
      fontWeight: '600',
      fontSize: '1.25rem',
      boxShadow: `0 4px 8px ${colors.primaryBlue}40`,
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '24px',
      marginBottom: '40px',
    },
    section: {
      backgroundColor: colors.white,
      borderRadius: '24px',
      padding: '24px',
      boxShadow: `0 12px 30px ${colors.shadow}`,
      marginBottom: '32px',
    },
    sectionTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: colors.darkBlue,
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      borderBottom: `2px solid ${colors.softBlue}`,
      paddingBottom: '12px',
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '24px',
    },
    card: {
      backgroundColor: colors.white,
      borderRadius: '24px',
      padding: '24px',
      boxShadow: `0 12px 30px ${colors.shadow}`,
    },
    cardTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: colors.darkBlue,
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    weatherItem: (hovered) => ({
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 16px',
      backgroundColor: hovered ? colors.lightBlue : colors.white,
      borderRadius: '16px',
      marginBottom: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      border: `1px solid ${colors.borderLight}`,
      transform: hovered ? 'translateX(6px)' : 'none',
      boxShadow: hovered ? `0 4px 12px ${colors.shadow}` : 'none',
    }),
    weatherDistrict: {
      fontWeight: '600',
      color: colors.darkBlue,
    },
    weatherDetails: {
      color: colors.textLight,
      fontSize: '0.95rem',
    },
    articleItem: (hovered) => ({
      padding: '14px 16px',
      backgroundColor: hovered ? colors.lightBlue : colors.white,
      borderRadius: '16px',
      marginBottom: '8px',
      border: `1px solid ${colors.borderLight}`,
      transition: 'background-color 0.2s',
    }),
    articleLink: {
      color: colors.primaryBlue,
      textDecoration: 'none',
      fontWeight: '500',
      fontSize: '1rem',
      display: 'block',
    },
    skeletonContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
    },
    skeletonCard: {
      width: '400px',
      height: '300px',
      borderRadius: '24px',
      backgroundColor: colors.borderLight,
      backgroundImage: `linear-gradient(90deg, ${colors.borderLight} 0%, ${colors.softBlue} 50%, ${colors.borderLight} 100%)`,
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
    },
  };

  if (loading) {
    return (
      <div style={styles.skeletonContainer}>
        <div style={styles.skeletonCard}></div>
      </div>
    );
  }

  const totalRevenue = transactions.reduce((sum, t) => sum + parseFloat(t.total_price), 0);
  const totalCommission = transactions.reduce((sum, t) => sum + parseFloat(t.commission_fee), 0);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.greeting}>Welcome back,</span>
          <h1 style={styles.title}>{user?.name || 'Farmer'}</h1>
        </div>
        <div style={styles.userInfo}>
          <span style={styles.userName}>{user?.email}</span>
          <div style={styles.avatar}>
            {user?.name?.charAt(0) || 'F'}
          </div>
        </div>
      </header>

      {/* Stat Cards with blue gradients */}
      <div style={styles.statsGrid}>
        <StatCard
          title="My Products"
          value={products.length}
          icon="🌽"
          gradient={`linear-gradient(145deg, ${colors.primaryBlue}, ${colors.mediumBlue})`}
        />
        <StatCard
          title="Total Sales"
          value={transactions.length}
          icon="💰"
          gradient={`linear-gradient(145deg, ${colors.mediumBlue}, ${colors.darkBlue})`}
        />
        <StatCard
          title="Revenue"
          value={`RWF ${totalRevenue.toLocaleString()}`}
          icon="📈"
          gradient={`linear-gradient(145deg, ${colors.primaryBlue}, ${colors.darkBlue})`}
        />
        <StatCard
          title="Commission Paid"
          value={`RWF ${totalCommission.toLocaleString()}`}
          icon="⚖️"
          gradient={`linear-gradient(145deg, ${colors.darkBlue}, #0a2647)`}
        />
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>
          <span>🌽</span> My Products
        </h2>
        <ProductTable products={products} showActions />
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>
          <span>💰</span> Recent Sales
        </h2>
        <TransactionTable transactions={transactions.slice(0, 5)} />
      </div>

      <div style={styles.infoGrid}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            <span>🌤️</span> Weather Updates
          </h2>
          <div>
            {weather.map((w, idx) => (
              <div
                key={w.weather_id}
                style={styles.weatherItem(hoveredWeather === idx)}
                onMouseEnter={() => setHoveredWeather(idx)}
                onMouseLeave={() => setHoveredWeather(null)}
              >
                <span style={styles.weatherDistrict}>{w.district}</span>
                <span style={styles.weatherDetails}>
                  {w.temperature}°C | {w.rainfall_probability}% rain
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            <span>📰</span> Latest Advisory
          </h2>
          <div>
            {articles.map((a, idx) => (
              <div
                key={a.article_id}
                style={styles.articleItem(hoveredArticle === idx)}
                onMouseEnter={() => setHoveredArticle(idx)}
                onMouseLeave={() => setHoveredArticle(null)}
              >
                <a href={`/advisory/${a.article_id}`} style={styles.articleLink}>
                  {a.title}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}