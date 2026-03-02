// AdminDashboardContent.jsx — Dark Industrial Redesign (title changed to "Admin Dashboard")
import { useEffect, useState, useMemo, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getProducts,
  getAllTransactions,
  getFarmers,
  getWeather,
  getArticles,
} from '../services/api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart,
} from 'recharts';
import toast, { Toaster } from 'react-hot-toast';

/* ─── INJECT STYLES ──────────────────────────────────────────── */
const injectStyles = () => {
  if (document.getElementById('adm-css')) return;
  const s = document.createElement('style');
  s.id = 'adm-css';
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Outfit:wght@300;400;500;600;700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:       #0d0f14;
      --bg-2:     #13161e;
      --bg-3:     #1a1d27;
      --bg-4:     #21253300;
      --border:   rgba(255,255,255,.07);
      --border-2: rgba(255,255,255,.12);
      --ink:      #f0f2f8;
      --ink-2:    #9ba3b8;
      --ink-3:    #5c6480;
      --amber:    #f5a623;
      --amber-lt: rgba(245,166,35,.12);
      --amber-glow: rgba(245,166,35,.3);
      --teal:     #00d4aa;
      --teal-lt:  rgba(0,212,170,.1);
      --rose:     #ff5e78;
      --rose-lt:  rgba(255,94,120,.1);
      --blue:     #4d8bff;
      --blue-lt:  rgba(77,139,255,.1);
      --violet:   #a78bfa;
      --radius:   14px;
      --radius-lg: 20px;
      --shadow:   0 4px 24px rgba(0,0,0,.4);
      --shadow-lg: 0 12px 48px rgba(0,0,0,.5);
      --sidebar-w: 240px;
      --topbar-h: 64px;
    }

    html { background: var(--bg); }
    body { background: var(--bg); font-family: 'Outfit', sans-serif; color: var(--ink); }

    /* ── ROOT ── */
    .adm { display: flex; min-height: 100vh; background: var(--bg); position: relative; }

    /* ── SIDEBAR ── */
    .adm-sidebar {
      width: var(--sidebar-w); min-height: 100vh;
      background: var(--bg-2);
      border-right: 1px solid var(--border);
      display: flex; flex-direction: column;
      position: fixed; top: 0; left: 0; bottom: 0; z-index: 100;
      transition: transform .3s cubic-bezier(.4,0,.2,1);
    }
    .adm-sidebar.collapsed { transform: translateX(calc(-1 * var(--sidebar-w))); }
    .adm-sidebar-logo {
      height: var(--topbar-h);
      display: flex; align-items: center; gap: 10px;
      padding: 0 22px;
      border-bottom: 1px solid var(--border);
      flex-shrink: 0;
    }
    .adm-logo-mark {
      width: 32px; height: 32px; border-radius: 9px;
      background: var(--amber);
      display: flex; align-items: center; justify-content: center;
      font-family: 'Space Mono', monospace;
      font-weight: 700; font-size: 14px; color: #000;
      box-shadow: 0 0 16px var(--amber-glow);
    }
    .adm-logo-text {
      font-family: 'Space Mono', monospace;
      font-weight: 700; font-size: 14px; color: var(--ink);
      letter-spacing: .04em;
    }
    .adm-logo-text span { color: var(--amber); }

    .adm-nav { flex: 1; padding: 16px 10px; display: flex; flex-direction: column; gap: 2px; overflow-y: auto; }
    .adm-nav-section { font-size: 10px; font-weight: 700; letter-spacing: .12em; color: var(--ink-3); text-transform: uppercase; padding: 12px 12px 6px; }
    .adm-nav-link {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 14px; border-radius: 10px;
      font-size: 13.5px; font-weight: 500; color: var(--ink-2);
      text-decoration: none; cursor: pointer;
      transition: all .18s; position: relative;
      border: 1px solid transparent;
    }
    .adm-nav-link:hover { background: var(--bg-3); color: var(--ink); border-color: var(--border); }
    .adm-nav-link.active {
      background: var(--amber-lt);
      color: var(--amber);
      border-color: rgba(245,166,35,.2);
      font-weight: 600;
    }
    .adm-nav-link.active::before {
      content: '';
      position: absolute; left: 0; top: 50%;
      transform: translateY(-50%);
      width: 3px; height: 18px;
      background: var(--amber);
      border-radius: 0 3px 3px 0;
    }
    .adm-nav-icon { font-size: 15px; width: 20px; text-align: center; }

    .adm-sidebar-footer {
      padding: 16px 10px;
      border-top: 1px solid var(--border);
    }
    .adm-user-card {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 12px; border-radius: 10px;
      background: var(--bg-3); border: 1px solid var(--border);
    }
    .adm-avatar {
      width: 32px; height: 32px; border-radius: 8px;
      background: var(--amber);
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 13px; color: #000;
      flex-shrink: 0;
    }
    .adm-user-name { font-size: 13px; font-weight: 600; color: var(--ink); }
    .adm-user-role { font-size: 11px; color: var(--ink-3); }
    .adm-logout-mini {
      margin-left: auto; background: none; border: none;
      color: var(--ink-3); font-size: 16px; cursor: pointer;
      padding: 4px; border-radius: 6px; transition: all .15s;
      display: flex; align-items: center;
    }
    .adm-logout-mini:hover { color: var(--rose); background: var(--rose-lt); }

    /* ── MAIN ── */
    .adm-main {
      flex: 1;
      margin-left: var(--sidebar-w);
      display: flex; flex-direction: column;
      min-height: 100vh;
      transition: margin .3s cubic-bezier(.4,0,.2,1);
    }
    .adm-main.full { margin-left: 0; }

    /* ── TOPBAR ── */
    .adm-topbar {
      height: var(--topbar-h);
      background: var(--bg-2);
      border-bottom: 1px solid var(--border);
      display: flex; align-items: center;
      padding: 0 28px; gap: 16px;
      position: sticky; top: 0; z-index: 50;
    }
    .adm-hamburger {
      width: 36px; height: 36px; border-radius: 9px;
      background: var(--bg-3); border: 1px solid var(--border);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: var(--ink-2); font-size: 16px;
      transition: all .15s; flex-shrink: 0;
    }
    .adm-hamburger:hover { border-color: var(--amber); color: var(--amber); }
    .adm-topbar-title {
      font-family: 'Space Mono', monospace;
      font-size: 13px; font-weight: 700;
      color: var(--ink-3); letter-spacing: .08em; text-transform: uppercase;
    }
    .adm-topbar-title span { color: var(--amber); }
    .adm-topbar-spacer { flex: 1; }
    .adm-topbar-actions { display: flex; align-items: center; gap: 10px; }
    .adm-icon-btn {
      width: 36px; height: 36px; border-radius: 9px;
      background: var(--bg-3); border: 1px solid var(--border);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; font-size: 15px;
      transition: all .15s; color: var(--ink-2);
    }
    .adm-icon-btn:hover { border-color: var(--border-2); color: var(--ink); }
    .adm-logout-btn {
      height: 36px; padding: 0 16px;
      border-radius: 9px; background: var(--bg-3);
      border: 1px solid var(--border);
      font-family: 'Outfit', sans-serif;
      font-size: 13px; font-weight: 600; color: var(--ink-2);
      cursor: pointer; display: flex; align-items: center; gap: 6px;
      transition: all .15s;
    }
    .adm-logout-btn:hover { border-color: var(--rose); color: var(--rose); background: var(--rose-lt); }

    /* ── BODY ── */
    .adm-body { padding: 28px 28px 40px; flex: 1; }

    /* ── PAGE HEADER ── */
    .adm-page-header { margin-bottom: 28px; }
    .adm-page-eyebrow {
      font-size: 11px; font-weight: 700; letter-spacing: .12em;
      text-transform: uppercase; color: var(--amber); margin-bottom: 6px;
      display: flex; align-items: center; gap: 8px;
    }
    .adm-page-eyebrow::after { content: ''; flex: 0 0 32px; height: 1px; background: var(--amber); opacity: .5; }
    .adm-page-title {
      font-family: 'Space Mono', monospace;
      font-size: 28px; font-weight: 700; color: var(--ink);
      line-height: 1.2;
    }
    .adm-page-sub { font-size: 13.5px; color: var(--ink-3); margin-top: 4px; }

    /* ── STAT CARDS ── */
    .adm-stats { display: grid; grid-template-columns: repeat(5,1fr); gap: 16px; margin-bottom: 24px; }
    @media(max-width:1200px) { .adm-stats { grid-template-columns: repeat(3,1fr); } }
    @media(max-width:800px) { .adm-stats { grid-template-columns: repeat(2,1fr); } }
    @media(max-width:500px) { .adm-stats { grid-template-columns: 1fr; } }

    .adm-stat {
      background: var(--bg-2);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 20px 22px 18px;
      position: relative; overflow: hidden;
      transition: all .22s;
      cursor: default;
    }
    .adm-stat::before {
      content: ''; position: absolute;
      top: 0; left: 0; right: 0; height: 2px;
    }
    .adm-stat.amber::before { background: var(--amber); }
    .adm-stat.teal::before { background: var(--teal); }
    .adm-stat.rose::before { background: var(--rose); }
    .adm-stat.blue::before { background: var(--blue); }
    .adm-stat.violet::before { background: var(--violet); }
    .adm-stat:hover { border-color: var(--border-2); transform: translateY(-2px); box-shadow: var(--shadow); }
    .adm-stat-icon {
      width: 38px; height: 38px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-size: 17px; margin-bottom: 14px;
    }
    .adm-stat.amber .adm-stat-icon { background: var(--amber-lt); }
    .adm-stat.teal .adm-stat-icon { background: var(--teal-lt); }
    .adm-stat.rose .adm-stat-icon { background: var(--rose-lt); }
    .adm-stat.blue .adm-stat-icon { background: var(--blue-lt); }
    .adm-stat.violet .adm-stat-icon { background: rgba(167,139,250,.1); }
    .adm-stat-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: var(--ink-3); margin-bottom: 6px; }
    .adm-stat-value { font-family: 'Space Mono', monospace; font-size: 22px; font-weight: 700; color: var(--ink); line-height: 1; }
    .adm-stat-glow {
      position: absolute; bottom: -20px; right: -20px;
      width: 70px; height: 70px; border-radius: 100%;
      opacity: .06;
    }
    .adm-stat.amber .adm-stat-glow { background: var(--amber); }
    .adm-stat.teal .adm-stat-glow { background: var(--teal); }
    .adm-stat.rose .adm-stat-glow { background: var(--rose); }
    .adm-stat.blue .adm-stat-glow { background: var(--blue); }
    .adm-stat.violet .adm-stat-glow { background: var(--violet); }

    /* ── GRID LAYOUT ── */
    .adm-grid-73 { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 20px; }
    @media(max-width:1100px) { .adm-grid-73 { grid-template-columns: 1fr; } }
    .adm-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
    @media(max-width:900px) { .adm-grid-2 { grid-template-columns: 1fr; } }

    /* ── CARD ── */
    .adm-card {
      background: var(--bg-2);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 24px 26px;
    }
    .adm-card-title {
      font-family: 'Space Mono', monospace;
      font-size: 13px; font-weight: 700;
      color: var(--ink); margin-bottom: 20px;
      display: flex; align-items: center; justify-content: space-between;
      padding-bottom: 14px;
      border-bottom: 1px solid var(--border);
    }
    .adm-card-title-left { display: flex; align-items: center; gap: 8px; }
    .adm-card-icon { font-size: 16px; }
    .adm-card-badge {
      font-size: 10px; font-weight: 700;
      padding: 2px 8px; border-radius: 100px;
      background: var(--amber-lt); color: var(--amber);
      border: 1px solid rgba(245,166,35,.2);
      letter-spacing: .06em; text-transform: uppercase;
    }

    /* ── CHART TOOLTIP ── */
    .adm-chart-tooltip {
      background: var(--bg-3) !important;
      border: 1px solid var(--border-2) !important;
      border-radius: 10px !important;
      font-family: 'Space Mono', monospace !important;
      font-size: 11px !important;
    }

    /* ── WEATHER ROW ── */
    .adm-weather-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 14px; border-radius: 10px;
      border: 1px solid var(--border);
      background: var(--bg-3);
      margin-bottom: 8px; transition: all .15s;
    }
    .adm-weather-row:last-child { margin-bottom: 0; }
    .adm-weather-row:hover { border-color: var(--border-2); background: rgba(255,255,255,.04); }
    .adm-weather-left { display: flex; align-items: center; gap: 10px; }
    .adm-weather-badge { width: 28px; height: 28px; border-radius: 7px; background: var(--bg-2); display: flex; align-items: center; justify-content: center; font-size: 14px; }
    .adm-weather-district { font-size: 13px; font-weight: 600; color: var(--ink); }
    .adm-weather-cond { font-size: 11px; color: var(--ink-3); }
    .adm-weather-temp { font-family: 'Space Mono', monospace; font-size: 14px; font-weight: 700; color: var(--amber); }
    .adm-weather-rain { font-size: 11px; color: var(--ink-3); text-align: right; }

    /* ── ARTICLE ROW ── */
    .adm-article-row {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 14px; border-radius: 10px;
      border: 1px solid var(--border);
      background: var(--bg-3);
      margin-bottom: 8px; transition: all .15s;
      text-decoration: none;
    }
    .adm-article-row:last-child { margin-bottom: 0; }
    .adm-article-row:hover { border-color: var(--teal); background: var(--teal-lt); }
    .adm-article-dot { width: 6px; height: 6px; border-radius: 100%; background: var(--teal); flex-shrink: 0; }
    .adm-article-title { font-size: 13px; font-weight: 500; color: var(--ink-2); line-height: 1.4; }
    .adm-article-row:hover .adm-article-title { color: var(--ink); }

    /* ── QUICK ACTIONS ── */
    .adm-actions { display: flex; flex-wrap: wrap; gap: 10px; }
    .adm-action-btn {
      display: flex; align-items: center; gap: 7px;
      padding: 10px 18px; border-radius: 10px;
      font-family: 'Outfit', sans-serif;
      font-size: 13px; font-weight: 600;
      text-decoration: none;
      border: 1px solid var(--border);
      background: var(--bg-3);
      color: var(--ink-2);
      transition: all .2s;
    }
    .adm-action-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,.35); }
    .adm-action-btn.amber { color: var(--amber); border-color: rgba(245,166,35,.25); }
    .adm-action-btn.amber:hover { background: var(--amber-lt); border-color: var(--amber); box-shadow: 0 6px 20px var(--amber-glow); }
    .adm-action-btn.teal { color: var(--teal); border-color: rgba(0,212,170,.25); }
    .adm-action-btn.teal:hover { background: var(--teal-lt); border-color: var(--teal); }
    .adm-action-btn.rose { color: var(--rose); border-color: rgba(255,94,120,.25); }
    .adm-action-btn.rose:hover { background: var(--rose-lt); border-color: var(--rose); }
    .adm-action-btn.blue { color: var(--blue); border-color: rgba(77,139,255,.25); }
    .adm-action-btn.blue:hover { background: var(--blue-lt); border-color: var(--blue); }
    .adm-action-btn.violet { color: var(--violet); border-color: rgba(167,139,250,.25); }
    .adm-action-btn.violet:hover { background: rgba(167,139,250,.1); border-color: var(--violet); }

    /* ── MODAL ── */
    .adm-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,.65);
      backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
      z-index: 999;
      animation: adm-fade .2s ease;
    }
    .adm-modal {
      background: var(--bg-2);
      border: 1px solid var(--border-2);
      border-radius: 24px;
      padding: 36px 40px;
      width: 90%; max-width: 380px;
      box-shadow: var(--shadow-lg);
      animation: adm-scale .25s cubic-bezier(.34,1.56,.64,1);
      text-align: center;
    }
    .adm-modal-icon { font-size: 40px; margin-bottom: 16px; }
    .adm-modal h3 { font-family: 'Space Mono', monospace; font-size: 20px; font-weight: 700; color: var(--ink); margin-bottom: 8px; }
    .adm-modal p { font-size: 14px; color: var(--ink-3); margin-bottom: 28px; }
    .adm-modal-btns { display: flex; gap: 12px; }
    .adm-modal-confirm {
      flex: 1; padding: 13px; border-radius: 12px;
      background: var(--rose); color: #fff;
      border: none; font-family: 'Outfit', sans-serif;
      font-weight: 700; font-size: 14px; cursor: pointer;
      transition: all .2s;
    }
    .adm-modal-confirm:hover { background: #e8455a; box-shadow: 0 4px 16px rgba(255,94,120,.35); }
    .adm-modal-cancel {
      flex: 1; padding: 13px; border-radius: 12px;
      background: var(--bg-3); color: var(--ink-2);
      border: 1px solid var(--border); font-family: 'Outfit', sans-serif;
      font-weight: 700; font-size: 14px; cursor: pointer;
      transition: all .2s;
    }
    .adm-modal-cancel:hover { border-color: var(--border-2); color: var(--ink); }

    /* ── MOBILE OVERLAY ── */
    .adm-mob-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,.5);
      backdrop-filter: blur(4px); z-index: 90;
    }

    /* ── LOADER ── */
    .adm-loader {
      min-height: 100vh; display: flex; flex-direction: column;
      align-items: center; justify-content: center; background: var(--bg); gap: 20px;
    }
    .adm-spinner {
      width: 44px; height: 44px;
      border: 3px solid var(--border-2);
      border-top-color: var(--amber);
      border-radius: 100%;
      animation: adm-spin .8s linear infinite;
    }
    .adm-loader-text { font-family: 'Space Mono', monospace; font-size: 12px; color: var(--ink-3); letter-spacing: .1em; }

    /* ── NO DATA ── */
    .adm-empty { text-align: center; padding: 32px 0; color: var(--ink-3); font-size: 13px; }

    /* ── KEYFRAMES ── */
    @keyframes adm-spin { to { transform: rotate(360deg); } }
    @keyframes adm-fade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes adm-scale { from { opacity:0; transform:scale(.9); } to { opacity:1; transform:scale(1); } }
    @keyframes adm-up { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
    .adm-anim { animation: adm-up .4s ease forwards; opacity: 0; }
    .adm-d1 { animation-delay: .05s; }
    .adm-d2 { animation-delay: .1s; }
    .adm-d3 { animation-delay: .15s; }
    .adm-d4 { animation-delay: .2s; }
    .adm-d5 { animation-delay: .25s; }

    /* custom scrollbar */
    .adm-sidebar::-webkit-scrollbar { width: 4px; }
    .adm-sidebar::-webkit-scrollbar-thumb { background: var(--border-2); border-radius: 4px; }
  `;
  document.head.appendChild(s);
};

/* ─── CONSTANTS ─────────────────────────────────────────────── */
const WEATHER_ICON = { Sunny: '☀️', Rainy: '🌧️', 'Partly Cloudy': '⛅', Cloudy: '☁️' };

const NAV_LINKS = [
  { to: '/admin', label: 'Dashboard', icon: '⊞' },
  { to: '/admin/users', label: 'Users', icon: '👥' },
  { to: '/admin/products', label: 'Products', icon: '📦' },
  { to: '/admin/transactions', label: 'Transactions', icon: '🔄' },
  { to: '/admin/weather', label: 'Weather', icon: '🌤️' },
  { to: '/admin/advisory', label: 'Advisory', icon: '📰' },
];

const QUICK_ACTIONS = [
  { to: '/admin/users', label: 'Manage Users', icon: '👥', color: 'amber' },
  { to: '/admin/products', label: 'Products', icon: '📦', color: 'teal' },
  { to: '/admin/transactions', label: 'Transactions', icon: '🔄', color: 'blue' },
  { to: '/admin/weather', label: 'Weather', icon: '🌤️', color: 'violet' },
  { to: '/admin/advisory', label: 'Advisory', icon: '📰', color: 'rose' },
];

/* ─── CUSTOM TOOLTIP ─────────────────────────────────────────── */
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-3)', border: '1px solid var(--border-2)',
      borderRadius: 10, padding: '10px 14px', fontFamily: 'Space Mono, monospace', fontSize: 11,
    }}>
      <div style={{ color: 'var(--ink-3)', marginBottom: 6, fontSize: 10 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontWeight: 700 }}>
          {p.name}: RWF {Number(p.value).toLocaleString()}
        </div>
      ))}
    </div>
  );
};

/* ─── MAIN COMPONENT ─────────────────────────────────────────── */
export default function AdminDashboardContent() {
  const { logout, user } = useAuth();
  const location = useLocation();

  const [stats, setStats] = useState({ farmers: 0, products: 0, transactions: 0, totalRevenue: 0, totalCommission: 0 });
  const [weather, setWeather] = useState([]);
  const [articles, setArticles] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => { injectStyles(); }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [farmersRes, productsRes, txRes, weatherRes, artRes] = await Promise.allSettled([
        getFarmers(), getProducts(), getAllTransactions(), getWeather(), getArticles(),
      ]);

      if (farmersRes.status === 'fulfilled')
        setStats(p => ({ ...p, farmers: farmersRes.value.data.length }));
      if (productsRes.status === 'fulfilled')
        setStats(p => ({ ...p, products: productsRes.value.data.length }));
      if (txRes.status === 'fulfilled') {
        const tx = txRes.value.data;
        const rev = tx.reduce((s, t) => s + parseFloat(t.total_price || 0), 0);
        const com = tx.reduce((s, t) => s + parseFloat(t.commission_fee || 0), 0);
        setStats(p => ({ ...p, transactions: tx.length, totalRevenue: rev, totalCommission: com }));
        const last7 = [...Array(7)].map((_, i) => {
          const d = new Date(); d.setDate(d.getDate() - i);
          return d.toISOString().split('T')[0];
        }).reverse();
        setChartData(last7.map(day => {
          const dayTx = tx.filter(t => new Date(t.created_at).toISOString().split('T')[0] === day);
          return {
            date: day.slice(5),
            revenue: dayTx.reduce((s, t) => s + parseFloat(t.total_price || 0), 0),
            commission: dayTx.reduce((s, t) => s + parseFloat(t.commission_fee || 0), 0),
          };
        }));
      }
      if (weatherRes.status === 'fulfilled') setWeather(weatherRes.value.data);
      if (artRes.status === 'fulfilled') setArticles(artRes.value.data);
    } catch (e) {
      toast.error('Failed to load data');
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleLogout = useCallback(async () => {
    setShowLogout(false);
    await logout().catch(() => toast.error('Logout failed'));
  }, [logout]);

  if (loading) {
    return (
      <div className="adm-loader">
        <div className="adm-spinner" />
        <div className="adm-loader-text">LOADING DASHBOARD...</div>
      </div>
    );
  }

  return (
    <div className="adm">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-3)', color: 'var(--ink)',
            border: '1px solid var(--border-2)',
            fontFamily: 'Outfit, sans-serif', fontSize: 13,
          },
        }}
      />

      {/* ── SIDEBAR ── */}
      <aside className={`adm-sidebar${sidebarOpen ? '' : ' collapsed'}`}>
        <div className="adm-sidebar-logo">
          <div className="adm-logo-mark">A</div>
          <div className="adm-logo-text">Agri<span>Admin</span></div>
        </div>

        <nav className="adm-nav">
          <div className="adm-nav-section">Navigation</div>
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`adm-nav-link${location.pathname === link.to ? ' active' : ''}`}
            >
              <span className="adm-nav-icon">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="adm-sidebar-footer">
          <div className="adm-user-card">
            <div className="adm-avatar">{user?.name?.charAt(0) || 'A'}</div>
            <div>
              <div className="adm-user-name">{user?.name || 'Admin'}</div>
              <div className="adm-user-role">Administrator</div>
            </div>
            <button className="adm-logout-mini" onClick={() => setShowLogout(true)} title="Logout">
              ⎋
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && window.innerWidth < 768 && (
        <div className="adm-mob-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── MAIN ── */}
      <div className={`adm-main${sidebarOpen ? '' : ' full'}`}>

        {/* ── TOPBAR ── */}
        <header className="adm-topbar">
          <div
            className="adm-hamburger"
            onClick={() => setSidebarOpen(v => !v)}
            role="button"
            aria-label="Toggle sidebar"
          >
            ☰
          </div>
          <div className="adm-topbar-title">
            Agri<span>Admin</span> / Dashboard
          </div>
          <div className="adm-topbar-spacer" />
          <div className="adm-topbar-actions">
            <div className="adm-icon-btn" onClick={fetchData} title="Refresh" role="button">↻</div>
            <button className="adm-logout-btn" onClick={() => setShowLogout(true)}>
              🚪 Logout
            </button>
          </div>
        </header>

        {/* ── BODY ── */}
        <div className="adm-body">

          {/* Page header */}
          <div className="adm-page-header adm-anim adm-d1">
            <div className="adm-page-eyebrow">Overview</div>
            <div className="adm-page-title">Admin Dashboard</div> {/* 👈 Changed from "Dashboard" to "Admin Dashboard" */}
            <div className="adm-page-sub">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>

          {/* STAT CARDS */}
          <div className="adm-stats adm-anim adm-d2">
            {[
              { label: 'Farmers', value: stats.farmers, icon: '👨‍🌾', color: 'amber' },
              { label: 'Products', value: stats.products, icon: '📦', color: 'teal' },
              { label: 'Transactions', value: stats.transactions, icon: '🔄', color: 'blue' },
              { label: 'Revenue', value: `RWF ${stats.totalRevenue.toLocaleString()}`, icon: '💰', color: 'rose' },
              { label: 'Commission', value: `RWF ${stats.totalCommission.toLocaleString()}`, icon: '⚖️', color: 'violet' },
            ].map(s => (
              <div key={s.label} className={`adm-stat ${s.color}`}>
                <div className="adm-stat-glow" />
                <div className="adm-stat-icon">{s.icon}</div>
                <div className="adm-stat-label">{s.label}</div>
                <div className="adm-stat-value">{s.value}</div>
              </div>
            ))}
          </div>

          {/* CHART + SIDE PANELS */}
          <div className="adm-grid-73 adm-anim adm-d3">
            {/* Revenue Area Chart */}
            <div className="adm-card">
              <div className="adm-card-title">
                <div className="adm-card-title-left">
                  <span className="adm-card-icon">📈</span>
                  Revenue & Commission
                </div>
                <span className="adm-card-badge">Last 7 days</span>
              </div>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={270}>
                  <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f5a623" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f5a623" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gCom" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00d4aa" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#00d4aa" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)" />
                    <XAxis dataKey="date" stroke="#5c6480" tick={{ fontSize: 11, fontFamily: 'Space Mono' }} />
                    <YAxis stroke="#5c6480" tick={{ fontSize: 10, fontFamily: 'Space Mono' }} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area type="monotone" dataKey="revenue" name="Revenue"
                      stroke="#f5a623" strokeWidth={2.5} fill="url(#gRev)"
                      dot={{ r: 3, fill: '#f5a623' }} activeDot={{ r: 5 }} />
                    <Area type="monotone" dataKey="commission" name="Commission"
                      stroke="#00d4aa" strokeWidth={2.5} fill="url(#gCom)"
                      dot={{ r: 3, fill: '#00d4aa' }} activeDot={{ r: 5 }} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="adm-empty">No transaction data available</div>
              )}
            </div>

            {/* Right: weather + articles stacked */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Weather */}
              <div className="adm-card" style={{ flex: 1 }}>
                <div className="adm-card-title">
                  <div className="adm-card-title-left">
                    <span className="adm-card-icon">🌤️</span> Weather
                  </div>
                </div>
                {weather.length > 0 ? weather.slice(0, 4).map((w, i) => (
                  <div className="adm-weather-row" key={i}>
                    <div className="adm-weather-left">
                      <div className="adm-weather-badge">{WEATHER_ICON[w.condition] || '☁️'}</div>
                      <div>
                        <div className="adm-weather-district">{w.district}</div>
                        <div className="adm-weather-cond">{w.condition}</div>
                      </div>
                    </div>
                    <div>
                      <div className="adm-weather-temp">{w.temperature}°C</div>
                      <div className="adm-weather-rain">{w.rainfall_probability}% rain</div>
                    </div>
                  </div>
                )) : <div className="adm-empty">No weather data</div>}
              </div>

              {/* Articles */}
              <div className="adm-card" style={{ flex: 1 }}>
                <div className="adm-card-title">
                  <div className="adm-card-title-left">
                    <span className="adm-card-icon">📰</span> Advisory
                  </div>
                </div>
                {articles.length > 0 ? articles.slice(0, 4).map((a, i) => (
                  <Link key={i} to={`/advisory/${a.article_id}`} className="adm-article-row">
                    <div className="adm-article-dot" />
                    <div className="adm-article-title">{a.title}</div>
                  </Link>
                )) : <div className="adm-empty">No articles found</div>}
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="adm-card adm-anim adm-d4">
            <div className="adm-card-title">
              <div className="adm-card-title-left">
                <span className="adm-card-icon">⚡</span> Quick Management
              </div>
            </div>
            <div className="adm-actions">
              {QUICK_ACTIONS.map(a => (
                <Link key={a.to} to={a.to} className={`adm-action-btn ${a.color}`}>
                  <span>{a.icon}</span> {a.label}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── LOGOUT MODAL ── */}
      {showLogout && (
        <div className="adm-overlay" onClick={() => setShowLogout(false)}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-icon">🚪</div>
            <h3>End Session</h3>
            <p>Are you sure you want to logout from your admin account?</p>
            <div className="adm-modal-btns">
              <button className="adm-modal-confirm" onClick={handleLogout}>
                Yes, Logout
              </button>
              <button className="adm-modal-cancel" onClick={() => setShowLogout(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}