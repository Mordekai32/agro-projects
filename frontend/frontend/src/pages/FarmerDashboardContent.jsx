import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getProducts,
  getMyTransactions,
  getWeather,
  getArticles,
} from "../services/api";

/* ─── INJECT STYLES ────────────────────────────────────────────── */
const injectStyles = () => {
  if (document.getElementById("cd-modern-css")) return;
  const s = document.createElement("style");
  s.id = "cd-modern-css";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:        #0f172a;
      --bg-2:      #1a243a;
      --bg-3:      #233049;
      --border:    #334155;
      --border-2:  #475569;
      --ink:       #f1f5f9;
      --ink-2:     #cbd5e1;
      --ink-3:     #94a3b8;
      --primary:   #10b981;
      --primary-lt: rgba(16, 185, 129, 0.1);
      --primary-glow: rgba(16, 185, 129, 0.2);
      --accent:    #06b6d4;
      --accent-lt: rgba(6, 182, 212, 0.1);
      --accent-glow: rgba(6, 182, 212, 0.2);
      --warn:      #f59e0b;
      --warn-lt:   rgba(245, 158, 11, 0.1);
      --danger:    #ef4444;
      --danger-lt: rgba(239, 68, 68, 0.1);
      --radius:    14px;
      --radius-lg: 20px;
      --shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
      --shadow-lg: 0 40px 80px rgba(0, 0, 0, 0.5);
    }

    html, body { background: var(--bg); }

    .cd-root {
      font-family: 'DM Sans', sans-serif;
      color: var(--ink);
      min-height: 100vh;
      background: var(--bg);
      display: grid;
      grid-template-columns: 80px 1fr;
      gap: 0;
    }

    /* ── SIDEBAR ── */
    .cd-sidebar {
      grid-row: 1 / -1;
      background: linear-gradient(180deg, #0a0f1a 0%, #162137 100%);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px 0;
      gap: 12px;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .cd-logo {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Syne', sans-serif;
      font-weight: 800;
      color: #fff;
      font-size: 20px;
      margin-bottom: 16px;
      box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
    }

    .cd-nav-item {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      cursor: pointer;
      transition: all .25s cubic-bezier(.4, 0, .2, 1);
      color: var(--ink-3);
      position: relative;
    }

    .cd-nav-item:hover {
      background: var(--primary-lt);
      color: var(--primary);
      transform: translateY(-2px);
    }

    .cd-nav-item.active {
      background: linear-gradient(135deg, var(--primary-lt), var(--accent-lt));
      color: var(--primary);
      box-shadow: 0 0 20px var(--primary-glow);
    }

    .cd-nav-spacer { flex: 1; }

    /* ── MAIN LAYOUT ── */
    .cd-main {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    /* ── TOPBAR ── */
    .cd-topbar {
      height: 80px;
      background: linear-gradient(180deg, rgba(26, 36, 58, 0.8) 0%, rgba(26, 36, 58, 0.5) 100%);
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      padding: 0 32px;
      gap: 20px;
      position: sticky;
      top: 0;
      z-index: 50;
      backdrop-filter: blur(10px);
    }

    .cd-topbar-title {
      font-family: 'Syne', sans-serif;
      font-weight: 700;
      font-size: 22px;
      color: var(--ink);
      flex: 1;
    }

    .cd-topbar-title span { color: var(--primary); }

    .cd-lang-wrapper { position: relative; }

    .cd-lang-btn {
      height: 40px;
      padding: 0 16px;
      border-radius: 100px;
      border: 1.5px solid var(--border);
      background: rgba(255, 255, 255, 0.05);
      font-size: 13px;
      font-weight: 600;
      color: var(--ink-2);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all .25s;
      font-family: 'DM Sans', sans-serif;
      backdrop-filter: blur(10px);
    }

    .cd-lang-btn:hover {
      border-color: var(--primary);
      color: var(--primary);
      background: rgba(16, 185, 129, 0.1);
    }

    .cd-lang-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      width: 180px;
      background: var(--bg-2);
      border: 1.5px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 8px;
      box-shadow: var(--shadow-lg);
      z-index: 200;
      backdrop-filter: blur(10px);
    }

    .cd-lang-option {
      padding: 10px 14px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all .15s;
      color: var(--ink-2);
    }

    .cd-lang-option:hover {
      background: rgba(16, 185, 129, 0.1);
      color: var(--primary);
    }

    .cd-lang-option.sel {
      background: var(--primary-lt);
      color: var(--primary);
      font-weight: 600;
    }

    .cd-user-pill {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 6px 6px 6px 16px;
      border: 1.5px solid var(--border);
      border-radius: 100px;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
    }

    .cd-user-email {
      font-size: 13px;
      color: var(--ink-2);
      font-weight: 500;
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .cd-avatar {
      width: 40px;
      height: 40px;
      border-radius: 100%;
      object-fit: cover;
      border: 2px solid var(--primary);
      box-shadow: 0 0 12px var(--primary-glow);
    }

    .cd-logout-btn {
      width: 40px;
      height: 40px;
      border-radius: 100%;
      border: 1.5px solid var(--border);
      background: rgba(255, 255, 255, 0.05);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 18px;
      transition: all .25s;
      color: var(--ink-3);
    }

    .cd-logout-btn:hover {
      background: var(--danger-lt);
      border-color: var(--danger);
      color: var(--danger);
    }

    /* ── PAGE BODY ── */
    .cd-body {
      padding: 32px;
      flex: 1;
      overflow-y: auto;
    }

    /* ── STAT CARDS ── */
    .cd-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .cd-stat {
      background: linear-gradient(135deg, rgba(26, 36, 58, 0.8) 0%, rgba(35, 48, 73, 0.6) 100%);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 28px;
      position: relative;
      overflow: hidden;
      transition: all .3s cubic-bezier(.4, 0, .2, 1);
      backdrop-filter: blur(10px);
    }

    .cd-stat:hover {
      transform: translateY(-8px);
      border-color: var(--primary);
      box-shadow: 0 12px 40px var(--primary-glow);
    }

    .cd-stat::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--primary), var(--accent));
    }

    .cd-stat-glow {
      position: absolute;
      top: -30px;
      right: -30px;
      width: 100px;
      height: 100px;
      border-radius: 100%;
      opacity: 0.1;
      pointer-events: none;
    }

    .cd-stat-glow-primary { background: var(--primary); }
    .cd-stat-glow-accent { background: var(--accent); }
    .cd-stat-glow-warn { background: var(--warn); }

    .cd-stat-label {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .1em;
      color: var(--ink-3);
      margin-bottom: 12px;
    }

    .cd-stat-value {
      font-family: 'Syne', sans-serif;
      font-size: 32px;
      font-weight: 800;
      color: var(--ink);
      line-height: 1;
      margin-bottom: 12px;
    }

    .cd-stat-icon {
      position: absolute;
      bottom: 20px;
      right: 24px;
      font-size: 32px;
      opacity: 0.2;
    }

    /* ── GRID ── */
    .cd-grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 32px;
    }

    @media(max-width: 1200px) {
      .cd-grid-2 { grid-template-columns: 1fr; }
    }

    /* ── CARD ── */
    .cd-card {
      background: linear-gradient(135deg, rgba(26, 36, 58, 0.8) 0%, rgba(35, 48, 73, 0.6) 100%);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 28px;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(10px);
      transition: all .3s ease;
    }

    .cd-card:hover {
      border-color: var(--border-2);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
    }

    /* ── SECTION HEADER ── */
    .cd-section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border);
    }

    .cd-section-title {
      font-family: 'Syne', sans-serif;
      font-weight: 700;
      font-size: 16px;
      color: var(--ink);
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .cd-section-title .ico { font-size: 20px; }

    .cd-badge {
      padding: 4px 12px;
      border-radius: 100px;
      font-size: 12px;
      font-weight: 700;
      background: var(--primary-lt);
      color: var(--primary);
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    /* ── TABLE ── */
    .cd-overflow { overflow-x: auto; }

    .cd-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13.5px;
    }

    .cd-table thead tr { border-bottom: 2px solid var(--border); }

    .cd-table thead th {
      text-align: left;
      padding: 14px 12px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .08em;
      color: var(--ink-3);
    }

    .cd-table tbody tr {
      border-bottom: 1px solid rgba(52, 81, 121, 0.5);
      transition: all .2s;
    }

    .cd-table tbody tr:last-child { border-bottom: none; }

    .cd-table tbody tr:hover {
      background: rgba(16, 185, 129, 0.08);
      border-color: var(--primary);
    }

    .cd-table td {
      padding: 14px 12px;
      color: var(--ink-2);
      vertical-align: middle;
    }

    .cd-table td.bold {
      font-weight: 600;
      color: var(--ink);
    }

    .cd-table td.accent { color: var(--primary); font-weight: 600; }

    .cd-pill {
      display: inline-flex;
      align-items: center;
      padding: 4px 12px;
      border-radius: 100px;
      font-size: 11px;
      font-weight: 700;
      border: 1.5px solid;
    }

    .cd-pill-ok { background: var(--primary-lt); color: var(--primary); border-color: rgba(16, 185, 129, 0.3); }
    .cd-pill-pending { background: var(--warn-lt); color: var(--warn); border-color: rgba(245, 158, 11, 0.3); }
    .cd-pill-fail { background: var(--danger-lt); color: var(--danger); border-color: rgba(239, 68, 68, 0.3); }

    .cd-buy-btn {
      padding: 8px 16px;
      border-radius: 100px;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      color: #fff;
      font-size: 12px;
      font-weight: 700;
      border: none;
      cursor: pointer;
      font-family: 'DM Sans', sans-serif;
      transition: all .25s;
      box-shadow: 0 4px 12px var(--primary-glow);
    }

    .cd-buy-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px var(--primary-glow);
    }

    /* ── WEATHER ITEM ── */
    .cd-weather-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      border-radius: var(--radius);
      border: 1px solid var(--border);
      background: rgba(16, 185, 129, 0.05);
      margin-bottom: 10px;
      transition: all .25s;
    }

    .cd-weather-item:last-child { margin-bottom: 0; }

    .cd-weather-item:hover {
      background: var(--primary-lt);
      border-color: var(--primary);
    }

    .cd-weather-item .wi-left { display: flex; align-items: center; gap: 12px; }
    .cd-weather-item .wi-district { font-weight: 600; font-size: 14px; color: var(--ink); }
    .cd-weather-item .wi-cond { font-size: 12px; color: var(--ink-3); }
    .cd-weather-item .wi-temp { font-family: 'Syne', sans-serif; font-weight: 700; color: var(--primary); font-size: 16px; }
    .cd-weather-item .wi-rain { font-size: 12px; color: var(--ink-3); text-align: right; }

    /* ── ARTICLE ITEM ── */
    .cd-article-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      border-radius: var(--radius);
      border: 1px solid var(--border);
      background: rgba(6, 182, 212, 0.05);
      margin-bottom: 10px;
      text-decoration: none;
      transition: all .25s;
      color: inherit;
    }

    .cd-article-item:last-child { margin-bottom: 0; }

    .cd-article-item:hover {
      background: var(--accent-lt);
      border-color: var(--accent);
    }

    .cd-article-item .art-title { font-size: 14px; font-weight: 600; color: var(--ink); }
    .cd-article-date {
      font-size: 11px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 100px;
      background: var(--bg-3);
      border: 1px solid var(--border);
      color: var(--accent);
      white-space: nowrap;
      flex-shrink: 0;
    }

    /* ── FOOTER ── */
    .cd-footer {
      background: linear-gradient(180deg, #0a0f1a 0%, #162137 100%);
      color: var(--ink-3);
      padding: 24px 32px;
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      border-top: 1px solid var(--border);
    }

    .cd-footer a { color: var(--primary); text-decoration: none; transition: color .15s; }
    .cd-footer a:hover { color: var(--accent); }
    .cd-footer-sep { width: 2px; height: 2px; border-radius: 100%; background: var(--border); }

    /* ── MODAL ── */
    .cd-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999;
      animation: fadeOverlay .25s ease;
    }

    @keyframes fadeOverlay { from { opacity: 0; } to { opacity: 1; } }

    .cd-modal {
      background: linear-gradient(135deg, rgba(26, 36, 58, 0.95) 0%, rgba(35, 48, 73, 0.95) 100%);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 40px 44px;
      width: 90%;
      max-width: 420px;
      box-shadow: var(--shadow-lg);
      animation: scaleModal .3s cubic-bezier(.34, 1.56, .64, 1);
      backdrop-filter: blur(10px);
    }

    @keyframes scaleModal { from { opacity: 0; transform: scale(.92); } to { opacity: 1; transform: scale(1); } }

    .cd-modal h3 {
      font-family: 'Syne', sans-serif;
      font-size: 24px;
      font-weight: 800;
      color: var(--ink);
      margin: 0 0 10px;
    }

    .cd-modal p {
      color: var(--ink-3);
      font-size: 14px;
      margin: 0 0 32px;
      line-height: 1.6;
    }

    .cd-modal-btns { display: flex; gap: 12px; }

    .cd-modal-yes {
      flex: 1;
      padding: 14px;
      background: linear-gradient(135deg, var(--danger), #d93554);
      color: #fff;
      border: none;
      border-radius: 10px;
      font-family: 'Syne', sans-serif;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      transition: all .25s;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    }

    .cd-modal-yes:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
    }

    .cd-modal-cancel {
      flex: 1;
      padding: 14px;
      background: rgba(255, 255, 255, 0.05);
      color: var(--ink-2);
      border: 1.5px solid var(--border);
      border-radius: 10px;
      font-family: 'Syne', sans-serif;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      transition: all .25s;
    }

    .cd-modal-cancel:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: var(--border-2);
    }

    /* ── ANIMATIONS ── */
    .cd-fade {
      animation: fadeUp .5s ease forwards;
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .cd-delay-1 { animation-delay: .05s; opacity: 0; }
    .cd-delay-2 { animation-delay: .1s; opacity: 0; }
    .cd-delay-3 { animation-delay: .15s; opacity: 0; }

    /* ── LOADER ── */
    .cd-loader {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      padding: 32px;
    }

    .cd-skel {
      height: 140px;
      border-radius: var(--radius-lg);
      background: linear-gradient(90deg, rgba(52, 81, 121, 0.3) 25%, rgba(52, 81, 121, 0.5) 50%, rgba(52, 81, 121, 0.3) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.6s infinite;
    }

    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

    /* Scrollbar styling */
    .cd-body::-webkit-scrollbar { width: 8px; }
    .cd-body::-webkit-scrollbar-track { background: transparent; }
    .cd-body::-webkit-scrollbar-thumb {
      background: var(--border);
      border-radius: 4px;
    }
    .cd-body::-webkit-scrollbar-thumb:hover { background: var(--border-2); }
  `;
  document.head.appendChild(s);
};

/* ─── TRANSLATIONS ─────────────────────────────────────────────── */
const TRANSLATIONS = {
  en: {
    customerPortal: "Dashboard",
    totalSpent: "Total Spent",
    ordersPlaced: "Orders Placed",
    productsBought: "Products Bought",
    availableProducts: "Available Products",
    purchaseHistory: "Purchase History",
    weatherUpdates: "Weather Updates",
    farmingTips: "Farming Tips & Advice",
    items: "items",
    transactions: "transactions",
    new: "New",
    logout: "Logout",
    confirmLogout: "Are you sure you want to logout?",
    cancel: "Cancel",
    yes: "Logout",
    welcome: "Welcome",
  },
  fr: {
    customerPortal: "Tableau de Bord",
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
    customerPortal: "Dashubode",
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
  { icon: "📦", key: "orders" },
  { icon: "🌤️", key: "weather" },
  { icon: "🌱", key: "tips" },
];

const WEATHER_ICON = { Sunny: "☀️", Rainy: "🌧️", "Partly Cloudy": "⛅" };

/* ─── SUB-COMPONENTS ───────────────────────────────────────── */
const StatCard = ({ label, value, icon, variant = "primary" }) => (
  <div className="cd-stat cd-fade">
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
          <th style={{ width: "80px" }}></th>
        </tr>
      </thead>
      <tbody>
        {products.length === 0 ? (
          <tr><td colSpan="3" style={{ textAlign: "center", padding: "24px", color: "var(--ink-3)" }}>No products available</td></tr>
        ) : (
          products.map((p, i) => (
            <tr key={p.product_id || i}>
              <td className="bold">{p.product_name || p.name || "Product"}</td>
              <td className="accent">RWF {Number(p.price_per_unit || p.price || 0).toLocaleString()}</td>
              <td><button className="cd-buy-btn">Buy</button></td>
            </tr>
          ))
        )}
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
        {transactions.length === 0 ? (
          <tr><td colSpan="5" style={{ textAlign: "center", padding: "24px", color: "var(--ink-3)" }}>No transactions yet</td></tr>
        ) : (
          transactions.map((t, i) => {
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
                <td className="accent">RWF {Number(t.total_price || 0).toLocaleString()}</td>
                <td>{t.date || "N/A"}</td>
                <td>
                  <span className={`cd-pill ${pill}`}>
                    {t.status || "Completed"}
                  </span>
                </td>
              </tr>
            );
          })
        )}
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
      <div className="cd-root">
        <div className="cd-sidebar" />
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
        <div className="cd-logo">🌾</div>
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
          <div className="cd-lang-wrapper">
            <button className="cd-lang-btn" onClick={() => setShowLangDD(!showLangDD)}>
              {currentLang?.flag} {currentLang?.code.toUpperCase()}
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
                `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user?.name || "User")}&backgroundColor=10b981`
              }
              alt="avatar"
              className="cd-avatar"
            />
          </div>
        </header>

        {/* ── PAGE BODY ── */}
        <div className="cd-body">
          {/* STATS */}
          <div className="cd-stats">
            <StatCard
              label={t.totalSpent}
              value={`RWF ${totalSpent.toLocaleString()}`}
              icon="💰"
              variant="primary"
            />
            <StatCard
              label={t.ordersPlaced}
              value={transactions.length}
              icon="📦"
              variant="accent"
            />
            <StatCard
              label={t.productsBought}
              value={distinctProducts}
              icon="🛍️"
              variant="warn"
            />
          </div>

          {/* PRODUCTS + TRANSACTIONS */}
          <div className="cd-grid-2 cd-fade cd-delay-1">
            <div className="cd-card">
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
          <div className="cd-grid-2 cd-fade cd-delay-2">
            {/* Weather */}
            <div className="cd-card">
              <div className="cd-section-header">
                <div className="cd-section-title">
                  <span className="ico">🌤️</span> {t.weatherUpdates}
                </div>
              </div>
              {weather.length === 0 ? (
                <div style={{ padding: "20px", textAlign: "center", color: "var(--ink-3)" }}>No weather data available</div>
              ) : (
                weather.map((w, i) => (
                  <div className="cd-weather-item" key={i}>
                    <div className="wi-left">
                      <span style={{ fontSize: 24 }}>
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
                ))
              )}
            </div>

            {/* Articles */}
            <div className="cd-card">
              <div className="cd-section-header">
                <div className="cd-section-title">
                  <span className="ico">🌱</span> {t.farmingTips}
                </div>
              </div>
              {articles.length === 0 ? (
                <div style={{ padding: "20px", textAlign: "center", color: "var(--ink-3)" }}>No articles available</div>
              ) : (
                articles.map((a, i) => (
                  <a
                    key={i}
                    href={`/advisory/${a.article_id}`}
                    className="cd-article-item"
                  >
                    <span className="art-title">{a.title}</span>
                    <span className="cd-article-date">{a.date || t.new}</span>
                  </a>
                ))
              )}
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
        </footer>
      </div>

      {/* ── LOGOUT MODAL ── */}
      {showLogout && (
        <div
          className="cd-modal-overlay"
          onClick={() => setShowLogout(false)}
        >
          <div className="cd-modal" onClick={(e) => e.stopPropagation()}>
            <h3>🚪 {t.logout}</h3>
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