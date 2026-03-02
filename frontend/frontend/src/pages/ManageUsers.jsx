// ManageUsers.jsx — Dark Industrial Theme (matches AdminDashboard, ManageProducts, etc.)
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUsers, createUser, updateUser, deleteUser } from '../services/api';

/* ── Dark theme constants (reused from dashboard) ────────────────────── */
const DARK_THEME = {
  bg: '#0a0a0a',        // page background
  bg2: '#1a1a1a',       // cards / elevated surfaces
  bg3: '#2a2a2a',       // inputs / hover
  border: '#333333',
  border2: '#444444',
  ink: '#ffffff',        // primary text
  ink2: '#cccccc',       // secondary text
  ink3: '#888888',       // tertiary / labels
  amber: '#f5a623',
  amberLt: 'rgba(245,166,35,0.1)',
  teal: '#00d4aa',
  tealLt: 'rgba(0,212,170,0.1)',
  rose: '#ff5e78',
  roseLt: 'rgba(255,94,120,0.1)',
  blue: '#4d8bff',
  blueLt: 'rgba(77,139,255,0.1)',
  violet: '#a78bfa',
  violetLt: 'rgba(167,139,250,0.1)',
  red: '#ef4444',
  redLt: '#442222',
  red2: '#ff6b6b',
  green: '#10b981',
  greenLt: '#1a3a2a',
  radius: '12px',
  radiusLg: '18px',
  radiusXl: '24px',
  shadowSm: '0 1px 6px rgba(0,0,0,0.5)',
  shadow: '0 4px 20px rgba(0,0,0,0.6)',
  shadowLg: '0 16px 48px rgba(0,0,0,0.8)',
};

/* ── Language data (unchanged) ───────────────────────────────────────── */
const LANGS = [
  { code: 'en', flag: '🇬🇧', label: 'English' },
  { code: 'fr', flag: '🇫🇷', label: 'Français' },
  { code: 'rw', flag: '🇷🇼', label: 'Kinyarwanda' },
];

const T = {
  en: {
    manageUsers: 'Manage Users', totalUsers: 'Total Users', farmers: 'Farmers', buyers: 'Buyers',
    addUser: 'Add User', edit: 'Edit', delete: 'Delete', fullName: 'Full Name', email: 'Email',
    phone: 'Phone Number', userType: 'User Type', location: 'Location', actions: 'Actions',
    save: 'Save Changes', cancel: 'Cancel', confirmDelete: 'This user will be permanently removed.',
    yes: 'Yes, delete', no: 'Keep user', logout: 'Sign out', password: 'Password',
    newPassword: 'New Password (optional)', noUsers: 'No users found', back: 'Back to Dashboard',
    addTitle: 'Add New User', editTitle: 'Edit User', search: 'Search users…',
    all: 'All', admin: 'Admin', farmer: 'Farmer', buyer: 'Buyer',
    fullNameRequired: 'Full name is required', emailRequired: 'Email is required',
    emailInvalid: 'Invalid email format', passwordRequired: 'Password is required',
    passwordMin: 'Min 6 characters', signOutConfirm: 'Your admin session will end.',
  },
  fr: {
    manageUsers: 'Gérer les utilisateurs', totalUsers: 'Total', farmers: 'Agriculteurs', buyers: 'Acheteurs',
    addUser: 'Ajouter', edit: 'Modifier', delete: 'Supprimer', fullName: 'Nom complet', email: 'Email',
    phone: 'Téléphone', userType: 'Type', location: 'Emplacement', actions: 'Actions',
    save: 'Enregistrer', cancel: 'Annuler', confirmDelete: 'Cet utilisateur sera supprimé.',
    yes: 'Oui, supprimer', no: 'Annuler', logout: 'Déconnexion', password: 'Mot de passe',
    newPassword: 'Nouveau mot de passe (optionnel)', noUsers: 'Aucun utilisateur', back: 'Tableau de bord',
    addTitle: 'Ajouter un utilisateur', editTitle: "Modifier l'utilisateur", search: 'Rechercher…',
    all: 'Tous', admin: 'Admin', farmer: 'Agriculteur', buyer: 'Acheteur',
    fullNameRequired: 'Nom requis', emailRequired: 'Email requis',
    emailInvalid: 'Email invalide', passwordRequired: 'Mot de passe requis',
    passwordMin: '6 caractères minimum', signOutConfirm: 'Votre session se terminera.',
  },
  rw: {
    manageUsers: 'Gereri abakoresha', totalUsers: 'Bose', farmers: 'Abahinzi', buyers: 'Abaguzi',
    addUser: 'Ongeraho', edit: 'Hindura', delete: 'Siba', fullName: 'Izina ryuzuye', email: 'Imeli',
    phone: 'Telefone', userType: 'Ubwoko', location: 'Aho bari', actions: 'Ibikorwa',
    save: 'Bika', cancel: 'Reka', confirmDelete: 'Uyu mukoresha azasibwa.',
    yes: 'Yego, siba', no: 'Reka', logout: 'Sohoka', password: 'Ijambobanga',
    newPassword: 'Ijambobanga rishya', noUsers: 'Nta bakoresha', back: 'Subira',
    addTitle: 'Ongeraho umukoresha', editTitle: 'Hindura umukoresha', search: 'Shakisha…',
    all: 'Bose', admin: 'Admin', farmer: 'Umuhinzi', buyer: 'Umuguzi',
    fullNameRequired: 'Izina rirakenewe', emailRequired: 'Imeli irakenewe',
    emailInvalid: 'Imeli ifite ikosa', passwordRequired: 'Ijambobanga rirakenewe',
    passwordMin: 'Byibura inyuguti 6', signOutConfirm: 'Urubuga rwawe ruzarangira.',
  },
};

// User type colors (for badges) – now using dark‑theme friendly shades
const TYPE_CFG = {
  admin:  { bg: DARK_THEME.amberLt, color: DARK_THEME.amber },
  farmer: { bg: DARK_THEME.tealLt,  color: DARK_THEME.teal },
  buyer:  { bg: DARK_THEME.blueLt,  color: DARK_THEME.blue },
};

const EMPTY_FORM = {
  full_name: '', email: '', phone_number: '', user_type: 'buyer', location: '', password: '',
};

/* ── Field wrapper (unchanged, but uses theme colors via inline styles) ─ */
function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: 'block', fontSize: '.72rem', fontWeight: 800,
        textTransform: 'uppercase', letterSpacing: '.08em',
        color: DARK_THEME.ink3, marginBottom: 6,
      }}>{label}</label>
      {children}
      {error && (
        <p style={{ fontSize: '.7rem', color: DARK_THEME.red2, marginTop: 4, fontWeight: 600 }}>{error}</p>
      )}
    </div>
  );
}

/* ─── INJECT DARK THEME STYLES ───────────────────────────────────────── */
const injectStyles = () => {
  if (document.getElementById('mu-css-dark')) return;
  const s = document.createElement('style');
  s.id = 'mu-css-dark';
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@600;700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:        #0a0a0a;
      --bg-2:      #1a1a1a;
      --bg-3:      #2a2a2a;
      --border:    #333333;
      --border-2:  #444444;
      --ink:       #ffffff;
      --ink-2:     #cccccc;
      --ink-3:     #888888;
      --amber:     #f5a623;
      --amber-lt:  rgba(245,166,35,0.1);
      --teal:      #00d4aa;
      --teal-lt:   rgba(0,212,170,0.1);
      --rose:      #ff5e78;
      --rose-lt:   rgba(255,94,120,0.1);
      --blue:      #4d8bff;
      --blue-lt:   rgba(77,139,255,0.1);
      --violet:    #a78bfa;
      --violet-lt: rgba(167,139,250,0.1);
      --red:       #ef4444;
      --red-lt:    #442222;
      --red-2:     #ff6b6b;
      --green:     #10b981;
      --green-lt:  #1a3a2a;
      --radius:    12px;
      --radius-lg: 18px;
      --radius-xl: 24px;
      --shadow-sm: 0 1px 6px rgba(0,0,0,0.5);
      --shadow:    0 4px 20px rgba(0,0,0,0.6);
      --shadow-lg: 0 16px 48px rgba(0,0,0,0.8);
    }

    html, body { background: var(--bg); font-family: 'Plus Jakarta Sans', sans-serif; color: var(--ink); }

    /* ── PAGE CONTAINER ── */
    .mu-root {
      min-height: 100vh;
      background: var(--bg);
      padding: clamp(20px, 4vw, 36px);
    }

    /* ── TOPBAR ── */
    .mu-topbar {
      display: flex; align-items: center; justify-content: space-between;
      flex-wrap: wrap; gap: 16px;
      margin-bottom: 28px;
      animation: mu-up .4s ease forwards;
    }
    .mu-topbar-left { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
    .mu-back-btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 8px 18px; border-radius: 100px;
      border: 1.5px solid var(--border-2);
      background: var(--bg-2); color: var(--ink-2);
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 13px; font-weight: 600;
      text-decoration: none; transition: all .18s;
      cursor: pointer;
    }
    .mu-back-btn:hover { background: var(--bg-3); border-color: var(--ink-2); color: var(--ink); }
    .mu-page-title {
      font-family: 'Syne', sans-serif;
      font-size: clamp(20px, 4vw, 28px);
      font-weight: 800; color: var(--ink);
    }

    /* ── USER PILL ── */
    .mu-user-pill {
      display: flex; align-items: center; gap: 10px;
      background: var(--bg-2); border: 1px solid var(--border);
      border-radius: 100px; padding: 5px 5px 5px 16px;
      box-shadow: var(--shadow-sm); flex-wrap: wrap;
    }
    .mu-email { font-size: 13px; font-weight: 500; color: var(--ink-2); max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .mu-lang-wrap { position: relative; }
    .mu-lang-btn, .mu-logout-btn {
      height: 34px; padding: 0 14px; border-radius: 100px;
      border: 1.5px solid var(--border); background: var(--bg-3);
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 12px; font-weight: 700; cursor: pointer;
      display: flex; align-items: center; gap: 5px;
      transition: all .18s; color: var(--ink-2);
    }
    .mu-lang-btn:hover { border-color: var(--ink); color: var(--ink); background: var(--bg-2); }
    .mu-logout-btn:hover { border-color: var(--red); color: var(--red-2); background: var(--red-lt); }
    .mu-lang-dropdown {
      position: absolute; top: calc(100% + 8px); right: 0;
      width: 150px; background: var(--bg-2);
      border: 1.5px solid var(--border); border-radius: var(--radius-lg);
      padding: 6px; box-shadow: var(--shadow-lg); z-index: 100;
    }
    .mu-lang-opt {
      display: flex; align-items: center; gap: 8px;
      padding: 9px 12px; border-radius: 10px;
      font-size: 13px; font-weight: 500; cursor: pointer;
      transition: all .13s; color: var(--ink-2);
    }
    .mu-lang-opt:hover, .mu-lang-opt.sel { background: var(--bg-3); color: var(--ink); }
    .mu-avatar {
      width: 34px; height: 34px; border-radius: 100%;
      background: var(--ink); color: var(--bg);
      font-weight: 800; font-size: 14px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }

    /* ── STATS ── */
    .mu-stats {
      display: grid; grid-template-columns: repeat(3, 1fr);
      gap: 16px; margin-bottom: 24px;
      animation: mu-up .4s ease .05s forwards; opacity: 0;
    }
    .mu-stat {
      background: var(--bg-2); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 20px 22px;
      box-shadow: var(--shadow-sm); position: relative; overflow: hidden;
      transition: all .22s;
      display: flex; align-items: center; justify-content: space-between;
    }
    .mu-stat:hover { transform: translateY(-3px); box-shadow: var(--shadow); }
    .mu-stat::before {
      content: ''; position: absolute;
      top: 0; left: 0; right: 0; height: 3px;
      border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    }
    .mu-stat.blue::before { background: var(--blue); }
    .mu-stat.teal::before { background: var(--teal); }
    .mu-stat.amber::before { background: var(--amber); }
    .mu-stat-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: var(--ink-3); margin-bottom: 4px; }
    .mu-stat-value { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; color: var(--ink); line-height: 1; }
    .mu-stat-sub { font-size: 11px; color: var(--ink-3); margin-top: 4px; }
    .mu-stat-icon {
      width: 44px; height: 44px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      font-size: 20px; background: var(--bg-3);
    }

    /* ── CARD ── */
    .mu-card {
      background: var(--bg-2); border: 1px solid var(--border);
      border-radius: var(--radius-xl); padding: 0;
      box-shadow: var(--shadow-sm);
      animation: mu-up .4s ease .1s forwards; opacity: 0;
      overflow: hidden;
    }
    .mu-card-header {
      display: flex; align-items: center; justify-content: space-between;
      flex-wrap: wrap; gap: 12px;
      padding: 18px 24px;
      border-bottom: 1px solid var(--border);
    }
    .mu-card-header-left { display: flex; align-items: center; gap: 12px; }
    .mu-card-title {
      font-family: 'Syne', sans-serif;
      font-size: 16px; font-weight: 700; color: var(--ink);
    }
    .mu-card-badge {
      font-size: 10px; font-weight: 700; padding: 3px 8px;
      border-radius: 100px;
      background: var(--bg-3); color: var(--ink-2);
      border: 1px solid var(--border);
      text-transform: uppercase; letter-spacing: .06em;
    }
    .mu-add-btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 10px 20px; border-radius: 100px;
      background: var(--ink); border: none; color: var(--bg);
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 13px; font-weight: 700; cursor: pointer;
      transition: all .18s; box-shadow: 0 4px 14px rgba(255,255,255,0.15);
    }
    .mu-add-btn:hover { background: var(--ink-2); transform: translateY(-1px); }

    /* ── TOOLBAR ── */
    .mu-toolbar {
      display: flex; align-items: center; gap: 10px;
      flex-wrap: wrap; padding: 14px 24px;
      border-bottom: 1px solid var(--border);
    }
    .mu-search-wrap {
      position: relative; flex: 1; min-width: 200px;
    }
    .mu-search-icon {
      position: absolute; left: 12px; top: 50%;
      transform: translateY(-50%);
      color: var(--ink-3); pointer-events: none;
    }
    .mu-search-input {
      width: 100%; padding: 8px 12px 8px 36px;
      border-radius: 30px;
      border: 1.5px solid var(--border);
      background: var(--bg-3);
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 13px; color: var(--ink);
      outline: none; transition: all .18s;
    }
    .mu-search-input:focus {
      border-color: var(--ink); background: var(--bg-2);
      box-shadow: 0 0 0 3px rgba(255,255,255,0.1);
    }
    .mu-filter-tabs {
      display: flex; gap: 4px;
    }
    .mu-filter-tab {
      padding: 6px 14px; border-radius: 30px;
      font-size: 12px; font-weight: 600;
      background: none; border: none; color: var(--ink-2);
      cursor: pointer; transition: all .14s;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .mu-filter-tab:hover { background: var(--bg-3); color: var(--ink); }
    .mu-filter-tab.active {
      background: var(--ink); color: var(--bg);
    }

    /* ── TABLE ── */
    .mu-table-wrap { overflow-x: auto; }
    .mu-table {
      width: 100%; border-collapse: collapse;
      font-size: 13.5px;
    }
    .mu-table thead tr { border-bottom: 2px solid var(--border); }
    .mu-table thead th {
      text-align: left; padding: 12px 20px;
      font-size: 11px; font-weight: 700; text-transform: uppercase;
      letter-spacing: .08em; color: var(--ink-3); white-space: nowrap;
      background: var(--bg-2);
    }
    .mu-table tbody tr {
      border-bottom: 1px solid var(--border);
      transition: background .14s;
    }
    .mu-table tbody tr:last-child { border-bottom: none; }
    .mu-table tbody tr:hover { background: var(--bg-3); }
    .mu-table td {
      padding: 12px 20px; color: var(--ink-2);
      vertical-align: middle;
    }
    .mu-user-info {
      display: flex; align-items: center; gap: 10px;
    }
    .mu-user-avatar {
      width: 32px; height: 32px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 13px;
      background: var(--bg-3); color: var(--ink);
      flex-shrink: 0;
    }
    .mu-user-name {
      font-weight: 700; color: var(--ink);
    }
    .mu-email-cell {
      color: var(--ink-2); font-weight: 500;
    }
    .mu-muted {
      color: var(--ink-3); font-size: 12px;
    }
    .mu-type-badge {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 3px 10px; border-radius: 100px;
      font-size: 11px; font-weight: 700;
    }
    .mu-type-dot {
      width: 6px; height: 6px; border-radius: 50%;
    }
    .mu-actions {
      display: flex; gap: 6px;
    }
    .mu-btn-icon {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 5px 12px; border-radius: 30px;
      font-size: 11px; font-weight: 600;
      border: 1.5px solid var(--border);
      background: var(--bg-3);
      color: var(--ink-2);
      cursor: pointer; transition: all .15s;
    }
    .mu-btn-icon:hover { border-color: var(--ink); color: var(--ink); background: var(--bg-2); }
    .mu-btn-icon.danger:hover { border-color: var(--red); color: var(--red-2); background: var(--red-lt); }
    .mu-empty {
      text-align: center; padding: 60px 20px;
      color: var(--ink-3); font-size: 14px;
    }

    /* ── MODAL ── */
    .mu-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.8); backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
      z-index: 999; animation: mu-fade .2s ease;
    }
    .mu-modal {
      background: var(--bg-2); border: 1px solid var(--border);
      border-radius: var(--radius-xl); padding: 28px;
      width: 90%; max-width: 480px;
      box-shadow: var(--shadow-lg);
      animation: mu-scale .25s cubic-bezier(.34,1.56,.64,1);
    }
    .mu-modal-header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 20px; padding-bottom: 16px;
      border-bottom: 1px solid var(--border);
    }
    .mu-modal-title {
      font-family: 'Syne', sans-serif;
      font-size: 20px; font-weight: 800; color: var(--ink);
    }
    .mu-modal-close {
      width: 30px; height: 30px; border-radius: 8px;
      background: var(--bg-3); border: 1px solid var(--border);
      color: var(--ink-2); font-size: 16px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all .15s;
    }
    .mu-modal-close:hover { border-color: var(--ink); color: var(--ink); }
    .mu-form-row {
      display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
      margin-bottom: 0;
    }
    .mu-form-group { margin-bottom: 18px; }
    .mu-label {
      display: block; font-size: 11px; font-weight: 700;
      text-transform: uppercase; letter-spacing: .07em;
      color: var(--ink-3); margin-bottom: 6px;
    }
    .mu-input, .mu-select {
      width: 100%; padding: 10px 14px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 14px; color: var(--ink);
      border: 1.5px solid var(--border);
      border-radius: 30px;
      background: var(--bg-3);
      outline: none; transition: all .18s;
    }
    .mu-input:focus, .mu-select:focus {
      border-color: var(--ink); background: var(--bg-2);
      box-shadow: 0 0 0 3px rgba(255,255,255,0.1);
    }
    .mu-input.error { border-color: var(--red-2); }
    .mu-select {
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23888888' strokeWidth='2' strokeLinecap='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 14px center;
    }
    .mu-error-msg {
      font-size: 11px; color: var(--red-2); margin-top: 4px; font-weight: 600;
    }
    .mu-modal-footer {
      display: flex; gap: 10px; justify-content: flex-end;
      margin-top: 20px; padding-top: 16px;
      border-top: 1px solid var(--border);
    }
    .mu-btn {
      padding: 10px 24px; border-radius: 100px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 13px; font-weight: 700; cursor: pointer;
      transition: all .18s; border: 1.5px solid;
    }
    .mu-btn-primary {
      background: var(--ink); color: var(--bg);
      border-color: var(--ink);
      box-shadow: 0 4px 12px rgba(255,255,255,0.15);
    }
    .mu-btn-primary:hover { background: var(--ink-2); transform: translateY(-1px); }
    .mu-btn-secondary {
      background: var(--bg-3); color: var(--ink-2);
      border-color: var(--border);
    }
    .mu-btn-secondary:hover { border-color: var(--border-2); color: var(--ink); }
    .mu-btn-danger {
      background: var(--red-lt); color: var(--red-2);
      border-color: #5a2a2a;
    }
    .mu-btn-danger:hover { background: var(--red); color: #fff; border-color: var(--red); }

    /* ── CONFIRM MODAL ── */
    .mu-confirm-modal {
      background: var(--bg-2); border: 1px solid var(--border);
      border-radius: var(--radius-xl); padding: 36px 32px;
      width: 90%; max-width: 360px;
      box-shadow: var(--shadow-lg);
      animation: mu-scale .25s ease;
      text-align: center;
    }
    .mu-confirm-icon { font-size: 40px; margin-bottom: 16px; }
    .mu-confirm-title {
      font-family: 'Syne', sans-serif;
      font-size: 20px; font-weight: 800; color: var(--ink);
      margin-bottom: 8px;
    }
    .mu-confirm-text {
      font-size: 14px; color: var(--ink-3);
      margin-bottom: 24px; line-height: 1.5;
    }
    .mu-confirm-btns {
      display: flex; gap: 10px; justify-content: center;
    }

    /* ── LOADER ── */
    .mu-loader {
      min-height: 100vh; display: flex; flex-direction: column;
      align-items: center; justify-content: center; background: var(--bg); gap: 16px;
    }
    .mu-spinner {
      width: 44px; height: 44px;
      border: 3px solid var(--border);
      border-top-color: var(--ink);
      border-radius: 100%;
      animation: mu-spin .8s linear infinite;
    }
    .mu-loader-text {
      font-family: 'Syne', sans-serif;
      font-size: 13px; color: var(--ink-3);
      font-weight: 700; letter-spacing: .06em;
    }

    /* ── KEYFRAMES ── */
    @keyframes mu-spin { to { transform: rotate(360deg); } }
    @keyframes mu-fade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes mu-scale { from { opacity:0; transform:scale(.93); } to { opacity:1; transform:scale(1); } }
    @keyframes mu-up { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
  `;
  document.head.appendChild(s);
};

/* ── Helper: input inline style (for focus/blur) ───────────────────── */
const inputStyle = (hasError) => ({
  width: '100%',
  padding: '10px 14px',
  fontSize: '.85rem',
  fontWeight: 500,
  border: `1.5px solid ${hasError ? DARK_THEME.red2 : DARK_THEME.border}`,
  borderRadius: '30px',
  outline: 'none',
  fontFamily: 'Plus Jakarta Sans, sans-serif',
  background: DARK_THEME.bg3,
  color: DARK_THEME.ink,
  transition: 'border-color .15s, box-shadow .15s',
  boxSizing: 'border-box',
});

/* ── MAIN COMPONENT ──────────────────────────────────────────────────── */
export default function ManageUsers() {
  const { user, logout } = useAuth();

  const [users,        setUsers]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [lang,         setLang]         = useState('en');
  const [showLang,     setShowLang]     = useState(false);
  const [showLogout,   setShowLogout]   = useState(false);
  const [showModal,    setShowModal]    = useState(false);
  const [editingUser,  setEditingUser]  = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form,         setForm]         = useState(EMPTY_FORM);
  const [errors,       setErrors]       = useState({});
  const [search,       setSearch]       = useState('');
  const [filterType,   setFilterType]   = useState('all');

  const t       = T[lang] || T.en;
  const curLang = LANGS.find(l => l.code === lang);

  useEffect(() => {
    injectStyles();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const total   = users.length;
  const farmers = users.filter(u => u.user_type === 'farmer').length;
  const buyers  = users.filter(u => u.user_type === 'buyer').length;

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = !q
      || u.full_name?.toLowerCase()?.includes(q)
      || u.email?.toLowerCase()?.includes(q)
      || (u.location || '').toLowerCase().includes(q);
    const matchType = filterType === 'all' || u.user_type === filterType;
    return matchSearch && matchType;
  });

  const openAdd = () => {
    setEditingUser(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setShowModal(true);
  };
  const openEdit = (u) => {
    setEditingUser(u);
    setForm({
      full_name: u.full_name, email: u.email,
      phone_number: u.phone_number || '', user_type: u.user_type,
      location: u.location || '', password: '',
    });
    setErrors({});
    setShowModal(true);
  };

  const validate = () => {
    const e = {};
    if (!form.full_name.trim())                       e.full_name = t.fullNameRequired;
    if (!form.email.trim())                           e.email     = t.emailRequired;
    else if (!/^\S+@\S+\.\S+$/.test(form.email))     e.email     = t.emailInvalid;
    if (!editingUser && !form.password)               e.password  = t.passwordRequired;
    else if (!editingUser && form.password.length < 6) e.password = t.passwordMin;
    if (editingUser && form.password && form.password.length < 6) {
      e.password = t.passwordMin;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      const payload = {
        full_name: form.full_name, email: form.email,
        phone_number: form.phone_number, user_type: form.user_type,
        location: form.location,
      };
      if (!editingUser) {
        payload.password = form.password;
        await createUser(payload);
      } else {
        if (form.password) payload.password = form.password;
        await updateUser(editingUser.user_id, payload);
      }
      setShowModal(false);
      const res = await getUsers();
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
      alert(`Save failed: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(deleteTarget.user_id);
      setDeleteTarget(null);
      const res = await getUsers();
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
      alert(`Delete failed: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="mu-loader">
        <div className="mu-spinner" />
        <div className="mu-loader-text">LOADING USERS...</div>
      </div>
    );
  }

  return (
    <div className="mu-root">
      {/* ── TOPBAR ── */}
      <header className="mu-topbar">
        <div className="mu-topbar-left">
          <Link to="/" className="mu-back-btn">
            ← {t.back}
          </Link>
          <h1 className="mu-page-title">{t.manageUsers}</h1>
        </div>

        <div className="mu-user-pill">
          <span className="mu-email">{user?.email || t.welcome}</span>

          <div className="mu-lang-wrap">
            <button className="mu-lang-btn" onClick={() => setShowLang(v => !v)}>
              {curLang?.flag} {lang.toUpperCase()} ▾
            </button>
            {showLang && (
              <div className="mu-lang-dropdown">
                {LANGS.map(l => (
                  <div
                    key={l.code}
                    className={`mu-lang-opt ${l.code === lang ? 'sel' : ''}`}
                    onClick={() => { setLang(l.code); setShowLang(false); }}
                  >
                    {l.flag} {l.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button className="mu-logout-btn" onClick={() => setShowLogout(true)}>
            🚪 {t.logout}
          </button>

          <div className="mu-avatar">
            {user?.full_name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
        </div>
      </header>

      {/* ── STATS ── */}
      <div className="mu-stats">
        {[
          { ico: '👥', lbl: t.totalUsers, val: total,   sub: 'All accounts',   cls: 'blue' },
          { ico: '👨‍🌾', lbl: t.farmers,   val: farmers, sub: 'Registered',     cls: 'teal' },
          { ico: '🛒', lbl: t.buyers,    val: buyers,  sub: 'Registered',     cls: 'amber' },
        ].map((s, i) => (
          <div className={`mu-stat ${s.cls}`} key={i}>
            <div>
              <div className="mu-stat-label">{s.lbl}</div>
              <div className="mu-stat-value">{s.val}</div>
              <div className="mu-stat-sub">{s.sub}</div>
            </div>
            <div className="mu-stat-icon">{s.ico}</div>
          </div>
        ))}
      </div>

      {/* ── MAIN CARD ── */}
      <div className="mu-card">
        <div className="mu-card-header">
          <div className="mu-card-header-left">
            <span className="mu-card-title">{t.manageUsers}</span>
            <span className="mu-card-badge">{filtered.length} USERS</span>
          </div>
          <button className="mu-add-btn" onClick={openAdd}>
            + {t.addUser}
          </button>
        </div>

        <div className="mu-toolbar">
          <div className="mu-search-wrap">
            <span className="mu-search-icon">🔍</span>
            <input
              className="mu-search-input"
              placeholder={t.search}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="mu-filter-tabs">
            {['all', 'farmer', 'buyer', 'admin'].map(ft => (
              <button
                key={ft}
                className={`mu-filter-tab ${filterType === ft ? 'active' : ''}`}
                onClick={() => setFilterType(ft)}
              >
                {t[ft] || ft}
              </button>
            ))}
          </div>
        </div>

        <div className="mu-table-wrap">
          <table className="mu-table">
            <thead>
              <tr>
                <th>{t.fullName}</th>
                <th>{t.email}</th>
                <th>{t.phone}</th>
                <th>{t.userType}</th>
                <th>{t.location}</th>
                <th>{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="mu-empty">
                      <div style={{ fontSize: '2rem', marginBottom: 10 }}>🔍</div>
                      <div>{t.noUsers}</div>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((u, idx) => {
                  const tc = TYPE_CFG[u.user_type] || TYPE_CFG.buyer;
                  return (
                    <tr key={u.user_id}>
                      <td>
                        <div className="mu-user-info">
                          <div className="mu-user-avatar" style={{ background: tc.bg, color: tc.color }}>
                            {u.full_name?.charAt(0)?.toUpperCase()}
                          </div>
                          <span className="mu-user-name">{u.full_name}</span>
                        </div>
                      </td>
                      <td className="mu-email-cell">{u.email}</td>
                      <td className="mu-muted">{u.phone_number || '—'}</td>
                      <td>
                        <span className="mu-type-badge" style={{ background: tc.bg, color: tc.color }}>
                          <span className="mu-type-dot" style={{ background: tc.color }} />
                          {u.user_type}
                        </span>
                      </td>
                      <td className="mu-muted">{u.location || '—'}</td>
                      <td>
                        <div className="mu-actions">
                          <button className="mu-btn-icon" onClick={() => openEdit(u)}>
                            ✏️ {t.edit}
                          </button>
                          <button
                            className="mu-btn-icon danger"
                            onClick={() => setDeleteTarget(u)}
                            disabled={u.user_type === 'admin' && u.email === user?.email}
                          >
                            🗑️ {t.delete}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── ADD/EDIT MODAL ── */}
      {showModal && (
        <div className="mu-overlay" onClick={() => setShowModal(false)}>
          <div className="mu-modal" onClick={e => e.stopPropagation()}>
            <div className="mu-modal-header">
              <div className="mu-modal-title">
                {editingUser ? t.editTitle : t.addTitle}
              </div>
              <button className="mu-modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="mu-form-row">
              <div className="mu-form-group">
                <label className="mu-label">{t.fullName}</label>
                <input
                  className={`mu-input ${errors.full_name ? 'error' : ''}`}
                  style={inputStyle(!!errors.full_name)}
                  type="text"
                  value={form.full_name}
                  onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))}
                  onFocus={e => { e.target.style.borderColor = DARK_THEME.ink; e.target.style.background = DARK_THEME.bg2; }}
                  onBlur={e => { e.target.style.borderColor = errors.full_name ? DARK_THEME.red2 : DARK_THEME.border; e.target.style.background = DARK_THEME.bg3; }}
                />
                {errors.full_name && <div className="mu-error-msg">{errors.full_name}</div>}
              </div>
              <div className="mu-form-group">
                <label className="mu-label">{t.email}</label>
                <input
                  className={`mu-input ${errors.email ? 'error' : ''}`}
                  style={inputStyle(!!errors.email)}
                  type="email"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  onFocus={e => { e.target.style.borderColor = DARK_THEME.ink; e.target.style.background = DARK_THEME.bg2; }}
                  onBlur={e => { e.target.style.borderColor = errors.email ? DARK_THEME.red2 : DARK_THEME.border; e.target.style.background = DARK_THEME.bg3; }}
                />
                {errors.email && <div className="mu-error-msg">{errors.email}</div>}
              </div>
            </div>

            <div className="mu-form-row">
              <div className="mu-form-group">
                <label className="mu-label">{t.phone}</label>
                <input
                  className="mu-input"
                  style={inputStyle(false)}
                  type="tel"
                  value={form.phone_number}
                  onChange={e => setForm(p => ({ ...p, phone_number: e.target.value }))}
                  onFocus={e => { e.target.style.borderColor = DARK_THEME.ink; e.target.style.background = DARK_THEME.bg2; }}
                  onBlur={e => { e.target.style.borderColor = DARK_THEME.border; e.target.style.background = DARK_THEME.bg3; }}
                />
              </div>
              <div className="mu-form-group">
                <label className="mu-label">{t.userType}</label>
                <select
                  className="mu-select"
                  value={form.user_type}
                  onChange={e => setForm(p => ({ ...p, user_type: e.target.value }))}
                >
                  <option value="buyer">Buyer</option>
                  <option value="farmer">Farmer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="mu-form-group">
              <label className="mu-label">{t.location}</label>
              <input
                className="mu-input"
                style={inputStyle(false)}
                type="text"
                value={form.location}
                onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                onFocus={e => { e.target.style.borderColor = DARK_THEME.ink; e.target.style.background = DARK_THEME.bg2; }}
                onBlur={e => { e.target.style.borderColor = DARK_THEME.border; e.target.style.background = DARK_THEME.bg3; }}
              />
            </div>

            <div className="mu-form-group">
              <label className="mu-label">{editingUser ? t.newPassword : t.password}</label>
              <input
                className={`mu-input ${errors.password ? 'error' : ''}`}
                style={inputStyle(!!errors.password)}
                type="password"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                onFocus={e => { e.target.style.borderColor = DARK_THEME.ink; e.target.style.background = DARK_THEME.bg2; }}
                onBlur={e => { e.target.style.borderColor = errors.password ? DARK_THEME.red2 : DARK_THEME.border; e.target.style.background = DARK_THEME.bg3; }}
              />
              {errors.password && <div className="mu-error-msg">{errors.password}</div>}
            </div>

            <div className="mu-modal-footer">
              <button className="mu-btn mu-btn-secondary" onClick={() => setShowModal(false)}>{t.cancel}</button>
              <button className="mu-btn mu-btn-primary" onClick={handleSave}>{t.save}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ── */}
      {deleteTarget && (
        <div className="mu-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="mu-confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="mu-confirm-icon">🗑️</div>
            <div className="mu-confirm-title">{t.delete}?</div>
            <p className="mu-confirm-text">
              <strong>{deleteTarget.full_name}</strong><br />
              {t.confirmDelete}
            </p>
            <div className="mu-confirm-btns">
              <button className="mu-btn mu-btn-danger" onClick={handleDelete}>{t.yes}</button>
              <button className="mu-btn mu-btn-secondary" onClick={() => setDeleteTarget(null)}>{t.no}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── LOGOUT CONFIRM MODAL ── */}
      {showLogout && (
        <div className="mu-overlay" onClick={() => setShowLogout(false)}>
          <div className="mu-confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="mu-confirm-icon">👋</div>
            <div className="mu-confirm-title">{t.logout}?</div>
            <p className="mu-confirm-text">{t.signOutConfirm}</p>
            <div className="mu-confirm-btns">
              <button className="mu-btn mu-btn-danger" onClick={async () => {
                setShowLogout(false);
                await logout().catch(console.error);
              }}>
                {t.logout}
              </button>
              <button className="mu-btn mu-btn-secondary" onClick={() => setShowLogout(false)}>{t.cancel}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}