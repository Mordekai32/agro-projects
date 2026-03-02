// CustomerDashboardContent.jsx — Professional Redesign
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getProducts,
  getMyTransactions,
  getWeather,
  getArticles,
} from "../services/api";

/* ─── INJECT STYLES ─────────────────────────────────────────── */
const injectStyles = () => {
  if (document.getElementById("cd-pro-css")) return;
  const s = document.createElement("style");
  s.id = "cd-pro-css";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');

    *, *::before, *::after { box-sizing: border-box; }

    :root {
      --ink:       #0a0d14;
      --ink-2:     #3a3f52;
      --ink-3:     #7a8099;
      --surface:   #ffffff;
      --surface-2: #f4f6fb;
      --surface-3: #eceef6;
      --accent:    #2f54eb;
      --accent-lt: #e8edff;
      --accent-2:  #00c9a7;
      --accent-2lt:#e0faf4;
      --warn:      #f5a623;
      --warn-lt:   #fef3d7;
      --danger:    #e8455a;
      --danger-lt: #fde8eb;
      --border:    #e4e8f2;
      --radius-sm: 10px;
      --radius:    16px;
      --radius-lg: 24px;
      --shadow-sm: 0 1px 4px rgba(10,13,20,.06);
      --shadow:    0 4px 20px rgba(10,13,20,.08);
      --shadow-lg: 0 12px 40px rgba(10,13,20,.12);
    }

    body { background: var(--surface-2); }

    .cd-root {
      font-family: 'DM Sans', sans-serif;
      color: var(--ink);
      min-height: 100vh;
      background: var(--surface-2);
    }

    /* ── SIDEBAR ── */
    .cd-sidebar {
      position: fixed; top: 0; left: 0; bottom: 0;
      width: 72px;
      background: var(--ink);
      display: flex; flex-direction: column; align-items: center;
      padding: 24px 0;
      z-index: 100;
      gap: 8px;
    }
    .cd-logo {
      width: 40px; height: 40px; background: var(--accent);
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      font-family: 'Syne', sans-serif;
      font-weight: 800; color: #fff; font-size: 18px;
      margin-bottom: 28px;
      box-shadow: 0 4px 14px rgba(47,84,235,.45);
    }
    .cd-nav-item {
      width: 48px; height: 48px; border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; cursor: pointer; transition: all .2s;
      color: var(--ink-3);
      position: relative;
    }
    .cd-nav-item:hover, .cd-nav-item.active {
      background: rgba(255,255,255,.1); color: #fff;
    }
    .cd-nav-item.active::before {
      content: '';
      position: absolute; left: -4px;
      width: 4px; height: 28px;
      background: var(--accent);
      border-radius: 0 4px 4px 0;
    }
    .cd-nav-spacer { flex: 1; }

    /* ── MAIN ── */
    .cd-main {
      margin-left: 72px;
      min-height: 100vh;
      display: flex; flex-direction: column;
    }

    /* ── TOPBAR ── */
    .cd-topbar {
      height: 72px;
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      display: flex; align-items: center;
      padding: 0 32px;
      gap: 16px;
      position: sticky; top: 0; z-index: 50;
    }
    .cd-topbar-title {
      font-family: 'Syne', sans-serif;
      font-weight: 700; font-size: 20px;
      color: var(--ink);
      flex: 1;
    }
    .cd-topbar-title span { color: var(--accent); }
    .cd-lang-btn {
      height: 36px; padding: 0 14px;
      border-radius: 100px;
      border: 1.5px solid var(--border);
      background: var(--surface);
      font-size: 13px; font-weight: 600;
      color: var(--ink-2);
      cursor: pointer; display: flex; align-items: center; gap-6px;
      gap: 6px; transition: all .2s;
      font-family: 'DM Sans', sans-serif;
    }
    .cd-lang-btn:hover { border-color: var(--accent); color: var(--accent); }
    .cd-lang-dropdown {
      position: absolute; top: calc(100% + 8px); right: 0;
      width: 160px; background: var(--surface);
      border: 1.5px solid var(--border);
      border-radius: var(--radius); padding: 6px;
      box-shadow: var(--shadow-lg); z-index: 200;
    }
    .cd-lang-option {
      padding: 9px 12px; border-radius: 10px;
      font-size: 13px; font-weight: 500; cursor: pointer;
      display: flex; align-items: center; gap: 8px;
      transition: all .15s; color: var(--ink-2);
    }
    .cd-lang-option:hover { background: var(--surface-2); color: var(--ink); }
    .cd-lang-option.sel { background: var(--accent-lt); color: var(--accent); font-weight: 600; }

    .cd-user-pill {
      display: flex; align-items: center; gap: 10px;
      padding: 4px 4px 4px 14px;
      border: 1.5px solid var(--border);
      border-radius: 100px;
      background: var(--surface);
    }
    .cd-user-email { font-size: 13px; color: var(--ink-2); font-weight: 500; max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .cd-avatar {
      width: 36px; height: 36px; border-radius: 100%;
      object-fit: cover; border: 2px solid var(--accent-lt);
    }
    .cd-logout-btn {
      width: 36px; height: 36px; border-radius: 100%;
      border: 1.5px solid var(--border);
      background: transparent;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; font-size: 15px; transition: all .2s;
      color: var(--ink-3);
    }
    .cd-logout-btn:hover { background: var(--danger-lt); border-color: var(--danger); color: var(--danger); }

    /* ── PAGE BODY ── */
    .cd-body { padding: 32px; flex: 1; }

    /* ── SECTION HEADER ── */
    .cd-section-header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 20px;
    }
    .cd-section-title {
      font-family: 'Syne', sans-serif;
      font-weight: 700; font-size: 15px; color: var(--ink);
      display: flex; align-items: center; gap: 8px;
    }
    .cd-section-title .ico { font-size: 16px; }
    .cd-badge {
      padding: 3px 10px; border-radius: 100px;
      font-size: 11px; font-weight: 700;
      background: var(--surface-2); color: var(--ink-3);
      border: 1px solid var(--border);
    }

    /* ── STAT CARDS ── */
    .cd-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; margin-bottom: 28px; }
    @media(max-width:900px) { .cd-stats { grid-template-columns: 1fr 1fr; } }
    @media(max-width:600px) { .cd-stats { grid-template-columns: 1fr; } }

    .cd-stat {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 24px 26px;
      position: relative; overflow: hidden;
      box-shadow: var(--shadow-sm);
      transition: transform .25s, box-shadow .25s;
    }
    .cd-stat:hover { transform: translateY(-3px); box-shadow: var(--shadow); }
    .cd-stat-accent { border-top: 3px solid var(--accent); }
    .cd-stat-accent2 { border-top: 3px solid var(--accent-2); }
    .cd-stat-warn { border-top: 3px solid var(--warn); }
    .cd-stat-glow {
      position: absolute; top: -20px; right: -20px;
      width: 80px; height: 80px; border-radius: 100%;
      opacity: .08;
    }
    .cd-stat-glow-accent { background: var(--accent); }
    .cd-stat-glow-accent2 { background: var(--accent-2); }
    .cd-stat-glow-warn { background: var(--warn); }
    .cd-stat-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--ink-3); margin-bottom: 10px; }
    .cd-stat-value { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; color: var(--ink); line-height: 1; }
    .cd-stat-icon { position: absolute; bottom: 18px; right: 20px; font-size: 26px; opacity: .3; }

    /* ── GRID ── */
    .cd-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 28px; }
    @media(max-width:900px) { .cd-grid-2 { grid-template-columns: 1fr; } }

    /* ── CARD ── */
    .cd-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 26px 28px;
      box-shadow: var(--shadow-sm);
    }

    /* ── TABLE ── */
    .cd-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
    .cd-table thead tr { border-bottom: 2px solid var(--border); }
    .cd-table thead th {
      text-align: left; padding: 0 12px 12px;
      font-size: 11px; font-weight: 700; text-transform: uppercase;
      letter-spacing: .08em; color: var(--ink-3);
    }
    .cd-table tbody tr { border-bottom: 1px solid var(--surface-3); transition: background .15s; }
    .cd-table tbody tr:last-child { border-bottom: none; }
    .cd-table tbody tr:hover { background: var(--surface-2); }
    .cd-table td { padding: 13px 12px; color: var(--ink-2); vertical-align: middle; }
    .cd-table td.bold { font-weight: 600; color: var(--ink); }
    .cd-table td.accent { color: var(--accent); font-weight: 600; }

    .cd-pill {
      display: inline-flex; align-items: center;
      padding: 3px 10px; border-radius: 100px;
      font-size: 11px; font-weight: 700; border: 1.5px solid;
    }
    .cd-pill-ok { background: var(--accent-2lt); color: #028f75; border-color: #a3e8dc; }
    .cd-pill-pending { background: var(--warn-lt); color: #b07100; border-color: #f5d380; }
    .cd-pill-fail { background: var(--danger-lt); color: var(--danger); border-color: #f5adb8; }

    .cd-buy-btn {
      padding: 6px 14px; border-radius: 100px;
      background: var(--accent); color: #fff;
      font-size: 12px; font-weight: 700;
      border: none; cursor: pointer;
      font-family: 'DM Sans', sans-serif;
      transition: all .2s;
      box-shadow: 0 2px 8px rgba(47,84,235,.25);
    }
    .cd-buy-btn:hover { background: #1c3fd4; transform: scale(1.04); box-shadow: 0 4px 14px rgba(47,84,235,.35); }

    /* ── WEATHER ITEM ── */
    .cd-weather-item {
      display: flex; align-items: center; justify-content: space-between;
      padding: 12px 14px; border-radius: var(--radius-sm);
      border: 1px solid var(--border);
      background: var(--surface-2);
      margin-bottom: 8px; transition: all .2s;
    }
    .cd-weather-item:last-child { margin-bottom: 0; }
    .cd-weather-item:hover { background: var(--accent-lt); border-color: #c0ccf8; }
    .cd-weather-item .wi-left { display: flex; align-items: center; gap: 10px; }
    .cd-weather-item .wi-district { font-weight: 600; font-size: 13.5px; color: var(--ink); }
    .cd-weather-item .wi-cond { font-size: 12px; color: var(--ink-3); }
    .cd-weather-item .wi-temp { font-family: 'Syne', sans-serif; font-weight: 700; color: var(--accent); font-size: 15px; }
    .cd-weather-item .wi-rain { font-size: 11px; color: var(--ink-3); text-align: right; }

    /* ── ARTICLE ITEM ── */
    .cd-article-item {
      display: flex; align-items: center; justify-content: space-between;
      padding: 12px 14px; border-radius: var(--radius-sm);
      border: 1px solid var(--border);
      background: var(--surface-2);
      margin-bottom: 8px; text-decoration: none;
      transition: all .2s; color: inherit;
    }
    .cd-article-item:last-child { margin-bottom: 0; }
    .cd-article-item:hover { background: var(--accent-2lt); border-color: #8de8d5; }
    .cd-article-item .art-title { font-size: 13.5px; font-weight: 600; color: var(--ink); }
    .cd-article-date {
      font-size: 11px; font-weight: 700;
      padding: 3px 9px; border-radius: 100px;
      background: var(--surface); border: 1px solid var(--border);
      color: var(--accent-2); white-space: nowrap; flex-shrink: 0;
    }

    /* ── FOOTER ── */
    .cd-footer {
      background: var(--ink); color: var(--ink-3);
      padding: 20px 32px;
      display: flex; flex-wrap: wrap; gap: 16px;
      align-items: center; justify-content: center;
      font-size: 12.5px;
    }
    .cd-footer a { color: #8fa8ff; text-decoration: none; transition: color .15s; }
    .cd-footer a:hover { color: #fff; }
    .cd-footer-sep { width: 3px; height: 3px; border-radius: 100%; background: var(--ink-2); }

    /* ── MODAL ── */
    .cd-modal-overlay {
      position: fixed; inset: 0;
      background: rgba(10,13,20,.4); backdrop-filter: blur(6px);
      display: flex; align-items: center; justify-content: center; z-index: 999;
      animation: fadeOverlay .2s ease;
    }
    @keyframes fadeOverlay { from { opacity: 0; } to { opacity: 1; } }
    .cd-modal {
      background: var(--surface); border-radius: 24px;
      padding: 36px 40px; width: 90%; max-width: 380px;
      box-shadow: 0 24px 60px rgba(10,13,20,.22);
      animation: scaleModal .25s cubic-bezier(.34,1.56,.64,1);
    }
    @keyframes scaleModal { from { opacity:0; transform:scale(.9); } to { opacity:1; transform:scale(1); } }
    .cd-modal h3 { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: var(--ink); margin: 0 0 8px; }
    .cd-modal p { color: var(--ink-3); font-size: 14px; margin: 0 0 28px; }
    .cd-modal-btns { display: flex; gap: 12px; }
    .cd-modal-yes {
      flex: 1; padding: 13px;
      background: var(--danger); color: #fff;
      border: none; border-radius: 12px;
      font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px;
      cursor: pointer; transition: all .2s;
    }
    .cd-modal-yes:hover { background: #c73248; }
    .cd-modal-cancel {
      flex: 1; padding: 13px;
      background: var(--surface-2); color: var(--ink-2);
      border: 1.5px solid var(--border); border-radius: 12px;
      font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px;
      cursor: pointer; transition: all .2s;
    }
    .cd-modal-cancel:hover { background: var(--surface-3); }

    /* ── LOADER ── */
    .cd-loader { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; padding: 32px; }
    .cd-skel {
      height: 120px; border-radius: var(--radius-lg);
      background: linear-gradient(90deg, var(--surface-3) 25%, var(--surface-2) 50%, var(--surface-3) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.4s infinite;
    }
    @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

    /* ── FADE ANIMS ── */
    .cd-fade { animation: fadeUp .4s ease forwards; }
    @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
    .cd-delay-1 { animation-delay: .05s; opacity: 0; }
    .cd-delay-2 { animation-delay: .1s; opacity: 0; }
    .cd-delay-3 { animation-delay: .15s; opacity: 0; }
    .cd-delay-4 { animation-delay: .2s; opacity: 0; }
    .cd-delay-5 { animation-delay: .25s; opacity: 0; }

    /* overflow fix */
    .cd-overflow { overflow-x: auto; }
  `;
  document.head.appendChild(s);
};

/* ─── TRANSLATIONS ─────────────────────────────────────────── */
const TRANSLATIONS = {
  en: {
    customerPortal: "Customer Portal",
    totalSpent: "Total Spent",
    ordersPlaced: "Orders Placed",
    productsBought: "Products Bought",
    availableProducts: "Available Products",
    purchaseHistory: "Purchase History",
    weatherUpdates: "Weather Updates",
    farmingTips: "Farming Tips",
    items: "items",
    transactions: "transactions",
    new: "New",
    logout: "Logout",
    confirmLogout: "Are you sure you want to logout?",
    cancel: "Cancel",
    yes: "Logout",
    welcome: "Welcome back",
  },
  fr: {
    customerPortal: "Portail Client",
    totalSpent: "Total Dépensé",
    ordersPlaced: "Commandes",
    productsBought: "Produits Achetés",
    availableProducts: "Produits Disponibles",
    purchaseHistory: "Historique d'Achat",
    weatherUpdates: "Météo",
    farmingTips: "Conseils Agricoles",
    items: "articles",
    transactions: "transactions",
    new: "Nouveau",
    logout: "Déconnexion",
    confirmLogout: "Êtes-vous sûr de vouloir vous déconnecter ?",
    cancel: "Annuler",
    yes: "Déconnecter",
    welcome: "Bienvenue",
  },
  rw: {
    customerPortal: "Urubuga rw'Abaguzi",
    totalSpent: "Amafaranga Yakoreshejwe",
    ordersPlaced: "Ibyaguzwe",
    productsBought: "Ibicuruzwa Byaguzwe",
    availableProducts: "Ibicuruzwa Bihari",
    purchaseHistory: "Amateka y'Ibyaguzwe",
    weatherUpdates: "Ikirere",
    farmingTips: "Inama z'Ubuhinzi",
    items: "ibicuruzwa",
    transactions: "ibyaguzwe",
    new: "Gishya",
    logout: "Sohoka",
    confirmLogout: "Uremeza ko ushaka gusohoka?",
    cancel: "Oya",
    yes: "Sohoka",
    welcome: "Murakaza neza",
  },
};

const LANG_OPTIONS = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "rw", label: "Kinyarwanda", flag: "🇷🇼" },
];

const NAV_ITEMS = [
  { icon: "🏠", key: "home", active: true },
  { icon: "🛒", key: "shop" },
  { icon: "📋", key: "orders" },
  { icon: "🌤️", key: "weather" },
  { icon: "🌱", key: "tips" },
];

const WEATHER_ICON = { Sunny: "☀️", Rainy: "🌧️", "Partly Cloudy": "⛅" };

/* ─── SUB-COMPONENTS ───────────────────────────────────────── */
const StatCard = ({ label, value, icon, variant = "accent" }) => (
  <div className={`cd-stat cd-stat-${variant}`}>
    <div className={`cd-stat-glow cd-stat-glow-${variant}`} />
    <div className="cd-stat-label">{label}</div>
    <div className="cd-stat-value">{value}</div>
    <div className="cd-stat-icon">{icon}</div>
  </div>
);

const ProductTable = ({ products }) => (
  <div className="cd-overflow">
    <table className="cd-table">
      <thead>
        <tr>
          <th>Product</th>
          <th>Price</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {products.map((p, i) => (
          <tr key={p.product_id || i}>
            <td className="bold">{p.name}</td>
            <td className="accent">RWF {p.price?.toLocaleString()}</td>
            <td>
              <button className="cd-buy-btn">Buy</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const TransactionTable = ({ transactions }) => (
  <div className="cd-overflow">
    <table className="cd-table">
      <thead>
        <tr>
          <th>Product</th>
          <th>Qty</th>
          <th>Total</th>
          <th>Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((t, i) => {
          const pill =
            t.status === "Completed"
              ? "cd-pill-ok"
              : t.status === "Pending"
              ? "cd-pill-pending"
              : "cd-pill-fail";
          return (
            <tr key={t.transaction_id || i}>
              <td className="bold">{t.product_name || "Product"}</td>
              <td>{t.quantity}</td>
              <td className="accent">RWF {t.total_price?.toLocaleString()}</td>
              <td>{t.date}</td>
              <td>
                <span className={`cd-pill ${pill}`}>
                  {t.status || "Completed"}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

/* ─── MAIN COMPONENT ───────────────────────────────────────── */
export default function CustomerDashboardContent() {
  const { user, logout } = useAuth();

  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [weather, setWeather] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("en");
  const [showLangDD, setShowLangDD] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [activeNav, setActiveNav] = useState("home");

  const t = TRANSLATIONS[language];
  const currentLang = LANG_OPTIONS.find((o) => o.code === language);

  useEffect(() => {
    injectStyles();
    (async () => {
      try {
        const [p, tx, w, a] = await Promise.all([
          getProducts(),
          getMyTransactions(),
          getWeather(),
          getArticles(),
        ]);
        setProducts(p?.data ?? []);
        setTransactions(tx?.data ?? []);
        setWeather(w?.data ?? []);
        setArticles(a?.data?.slice(0, 4) ?? []);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    })();
  }, []);

  const totalSpent = transactions.reduce(
    (s, t) => s + Number(t.total_price || 0),
    0
  );
  const distinctProducts = new Set(transactions.map((t) => t.product_id)).size;

  if (loading) {
    return (
      <div className="cd-root" style={{ marginLeft: 72 }}>
        <div className="cd-loader">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="cd-skel" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="cd-root">
      {/* ── SIDEBAR ── */}
      <nav className="cd-sidebar">
        <div className="cd-logo">A</div>
        {NAV_ITEMS.map((n) => (
          <div
            key={n.key}
            className={`cd-nav-item${activeNav === n.key ? " active" : ""}`}
            onClick={() => setActiveNav(n.key)}
            title={n.key}
          >
            {n.icon}
          </div>
        ))}
        <div className="cd-nav-spacer" />
        <div
          className="cd-nav-item"
          onClick={() => setShowLogout(true)}
          title="Logout"
        >
          🚪
        </div>
      </nav>

      {/* ── MAIN ── */}
      <div className="cd-main">
        {/* ── TOPBAR ── */}
        <header className="cd-topbar">
          <div className="cd-topbar-title">
            {t.welcome},{" "}
            <span>{user?.name?.split(" ")[0] || "User"}</span>
          </div>

          {/* Language switcher */}
          <div style={{ position: "relative" }}>
            <button className="cd-lang-btn" onClick={() => setShowLangDD(!showLangDD)}>
              {currentLang?.flag} {currentLang?.label}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {showLangDD && (
              <div className="cd-lang-dropdown">
                {LANG_OPTIONS.map((o) => (
                  <div
                    key={o.code}
                    className={`cd-lang-option${o.code === language ? " sel" : ""}`}
                    onClick={() => { setLanguage(o.code); setShowLangDD(false); }}
                  >
                    {o.flag} {o.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User pill */}
          <div className="cd-user-pill">
            <span className="cd-user-email">{user?.email}</span>
            <button className="cd-logout-btn" onClick={() => setShowLogout(true)} title="Logout">
              🚪
            </button>
            <img
              src={
                user?.profilePicture ||
                `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user?.name || "User")}&backgroundColor=2f54eb`
              }
              alt="avatar"
              className="cd-avatar"
            />
          </div>
        </header>

        {/* ── PAGE BODY ── */}
        <div className="cd-body">

          {/* STATS */}
          <div className="cd-stats cd-fade cd-delay-1">
            <StatCard
              label={t.totalSpent}
              value={`RWF ${totalSpent.toLocaleString()}`}
              icon="💰"
              variant="accent"
            />
            <StatCard
              label={t.ordersPlaced}
              value={transactions.length}
              icon="📦"
              variant="accent2"
            />
            <StatCard
              label={t.productsBought}
              value={distinctProducts}
              icon="🛍️"
              variant="warn"
            />
          </div>

          {/* PRODUCTS + TRANSACTIONS */}
          <div className="cd-fade cd-delay-2" style={{ marginBottom: 24 }}>
            <div className="cd-card" style={{ marginBottom: 20 }}>
              <div className="cd-section-header">
                <div className="cd-section-title">
                  <span className="ico">🌽</span> {t.availableProducts}
                </div>
                <span className="cd-badge">{products.length} {t.items}</span>
              </div>
              <ProductTable products={products.slice(0, 5)} />
            </div>

            <div className="cd-card">
              <div className="cd-section-header">
                <div className="cd-section-title">
                  <span className="ico">📋</span> {t.purchaseHistory}
                </div>
                <span className="cd-badge">{transactions.length} {t.transactions}</span>
              </div>
              <TransactionTable transactions={transactions.slice(0, 5)} />
            </div>
          </div>

          {/* WEATHER + ARTICLES */}
          <div className="cd-grid-2 cd-fade cd-delay-3">
            {/* Weather */}
            <div className="cd-card">
              <div className="cd-section-header">
                <div className="cd-section-title">
                  <span className="ico">🌤️</span> {t.weatherUpdates}
                </div>
              </div>
              {weather.map((w, i) => (
                <div className="cd-weather-item" key={i}>
                  <div className="wi-left">
                    <span style={{ fontSize: 22 }}>
                      {WEATHER_ICON[w.condition] || "☁️"}
                    </span>
                    <div>
                      <div className="wi-district">{w.district}</div>
                      <div className="wi-cond">{w.condition}</div>
                    </div>
                  </div>
                  <div>
                    <div className="wi-temp">{w.temperature}°C</div>
                    <div className="wi-rain">{w.rainfall_probability}% rain</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Articles */}
            <div className="cd-card">
              <div className="cd-section-header">
                <div className="cd-section-title">
                  <span className="ico">🌱</span> {t.farmingTips}
                </div>
              </div>
              {articles.map((a, i) => (
                <a
                  key={i}
                  href={`/advisory/${a.article_id}`}
                  className="cd-article-item"
                >
                  <span className="art-title">{a.title}</span>
                  <span className="cd-article-date">{a.date || t.new}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer className="cd-footer">
          <a href="mailto:mordekai893@gmail.com">📧 mordekai893@gmail.com</a>
          <span className="cd-footer-sep" />
          <span>👤 Mordekai</span>
          <span className="cd-footer-sep" />
          <a href="https://mordekai.vercel.app" target="_blank" rel="noreferrer">🌐 Portfolio</a>
          <span className="cd-footer-sep" />
          <a href="https://instagram.com/Mordekai_320" target="_blank" rel="noreferrer">📸 Instagram</a>
          <span className="cd-footer-sep" />
          <a href="https://twitter.com/Mordekai668896" target="_blank" rel="noreferrer">🐦 Twitter</a>
          <span className="cd-footer-sep" />
          <a href="https://facebook.com/UM.Mordekai" target="_blank" rel="noreferrer">👍 Facebook</a>
          <span className="cd-footer-sep" />
          <a href="https://tiktok.com/@Mordekai320" target="_blank" rel="noreferrer">🎵 TikTok</a>
          <span className="cd-footer-sep" />
          <a href="https://wa.me/250796381024" target="_blank" rel="noreferrer" style={{ color: "#4ade80" }}>📱 WhatsApp</a>
        </footer>
      </div>

      {/* ── LOGOUT MODAL ── */}
      {showLogout && (
        <div
          className="cd-modal-overlay"
          onClick={() => setShowLogout(false)}
        >
          <div className="cd-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{t.logout}</h3>
            <p>{t.confirmLogout}</p>
            <div className="cd-modal-btns">
              <button className="cd-modal-yes" onClick={async () => await logout()}>
                {t.yes}
              </button>
              <button className="cd-modal-cancel" onClick={() => setShowLogout(false)}>
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}