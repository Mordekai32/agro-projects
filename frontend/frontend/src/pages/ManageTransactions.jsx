// ManageTransactions.jsx — Dark theme (matches ManageProducts)
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { getTransactions, updateTransaction, deleteTransaction, createTransaction } from '../services/api';

/* ─── INJECT DARK THEME STYLES ───────────────────────────────── */
const injectStyles = () => {
  if (document.getElementById('mt-css-dark')) return;
  const s = document.createElement('style');
  s.id = 'mt-css-dark';
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@600;700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:        #0a0a0a;        /* near black background */
      --bg-2:      #1a1a1a;        /* cards / elevated surfaces */
      --bg-3:      #2a2a2a;        /* inputs / subtle contrast */
      --border:    #333333;
      --border-2:  #444444;
      --ink:       #ffffff;         /* primary text – white */
      --ink-2:     #cccccc;         /* secondary text – light gray */
      --ink-3:     #888888;         /* tertiary / labels – medium gray */
      --primary:   #ffffff;         /* accent – white (buttons, highlights) */
      --primary-dim: #dddddd;
      --primary-lt: rgba(255,255,255,0.1);
      --primary-glow: rgba(255,255,255,0.15);
      --red:       #ef4444;
      --red-lt:    #442222;
      --red-2:     #ff6b6b;
      --green:     #10b981;
      --green-lt:  #1a3a2a;
      --amber:     #f59e0b;
      --amber-lt:  #3a2e1a;
      --radius:    12px;
      --radius-lg: 18px;
      --radius-xl: 24px;
      --shadow-sm: 0 1px 6px rgba(0,0,0,0.5);
      --shadow:    0 4px 20px rgba(0,0,0,0.6);
      --shadow-lg: 0 16px 48px rgba(0,0,0,0.8);
    }

    html, body { background: var(--bg); }
    .mt-root {
      font-family: 'Plus Jakarta Sans', sans-serif;
      color: var(--ink);
      min-height: 100vh;
      background: var(--bg);
      padding: clamp(20px, 4vw, 36px);
    }

    /* ── TOPBAR ── */
    .mt-topbar {
      display: flex; align-items: center; justify-content: space-between;
      flex-wrap: wrap; gap: 16px;
      margin-bottom: 28px;
      animation: mt-up .4s ease forwards;
    }
    .mt-topbar-left { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
    .mt-back-btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 8px 18px; border-radius: 100px;
      border: 1.5px solid var(--border-2);
      background: var(--bg-2); color: var(--ink-2);
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 13px; font-weight: 600;
      text-decoration: none; transition: all .18s;
    }
    .mt-back-btn:hover { background: var(--bg-3); border-color: var(--ink-2); color: var(--ink); }
    .mt-page-title {
      font-family: 'Syne', sans-serif;
      font-size: clamp(20px, 4vw, 28px);
      font-weight: 800; color: var(--ink);
    }

    /* ── USER PILL ── */
    .mt-user-pill {
      display: flex; align-items: center; gap: 10px;
      background: var(--bg-2); border: 1px solid var(--border);
      border-radius: 100px; padding: 5px 5px 5px 16px;
      box-shadow: var(--shadow-sm); flex-wrap: wrap;
    }
    .mt-email { font-size: 13px; font-weight: 500; color: var(--ink-2); max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .mt-lang-wrap { position: relative; }
    .mt-lang-btn, .mt-logout-btn {
      height: 34px; padding: 0 14px; border-radius: 100px;
      border: 1.5px solid var(--border); background: var(--bg-3);
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 12px; font-weight: 700; cursor: pointer;
      display: flex; align-items: center; gap: 5px;
      transition: all .18s; color: var(--ink-2);
    }
    .mt-lang-btn:hover { border-color: var(--ink); color: var(--ink); background: var(--bg-2); }
    .mt-logout-btn:hover { border-color: var(--red); color: var(--red-2); background: var(--red-lt); }
    .mt-lang-dropdown {
      position: absolute; top: calc(100% + 8px); right: 0;
      width: 150px; background: var(--bg-2);
      border: 1.5px solid var(--border); border-radius: var(--radius-lg);
      padding: 6px; box-shadow: var(--shadow-lg); z-index: 100;
    }
    .mt-lang-opt {
      display: flex; align-items: center; gap: 8px;
      padding: 9px 12px; border-radius: 10px;
      font-size: 13px; font-weight: 500; cursor: pointer;
      transition: all .13s; color: var(--ink-2);
    }
    .mt-lang-opt:hover, .mt-lang-opt.sel { background: var(--bg-3); color: var(--ink); }
    .mt-avatar {
      width: 34px; height: 34px; border-radius: 100%;
      background: var(--ink); color: var(--bg);
      font-weight: 800; font-size: 14px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }

    /* ── STATS ── */
    .mt-stats {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px; margin-bottom: 24px;
      animation: mt-up .4s ease .05s forwards; opacity: 0;
    }
    .mt-stat {
      background: var(--bg-2); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 20px 22px;
      box-shadow: var(--shadow-sm); position: relative; overflow: hidden;
      transition: all .22s;
    }
    .mt-stat:hover { transform: translateY(-3px); box-shadow: var(--shadow); }
    .mt-stat::after {
      content: ''; position: absolute;
      top: 0; left: 0; right: 0; height: 3px;
      border-radius: var(--radius-lg) var(--radius-lg) 0 0;
      background: var(--ink);
    }
    .mt-stat-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: var(--ink-3); margin-bottom: 6px; }
    .mt-stat-value { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; color: var(--ink); }
    .mt-stat-icon { font-size: 22px; margin-bottom: 10px; }

    /* ── CARD ── */
    .mt-card {
      background: var(--bg-2); border: 1px solid var(--border);
      border-radius: var(--radius-xl); padding: clamp(18px, 3vw, 28px);
      box-shadow: var(--shadow-sm);
      animation: mt-up .4s ease .1s forwards; opacity: 0;
    }
    .mt-card-header {
      display: flex; align-items: center; justify-content: space-between;
      flex-wrap: wrap; gap: 12px;
      padding-bottom: 18px; border-bottom: 1px solid var(--border);
      margin-bottom: 20px;
    }
    .mt-card-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: var(--ink); }
    .mt-add-btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 10px 20px; border-radius: 100px;
      background: var(--ink); border: none; color: var(--bg);
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 13px; font-weight: 700; cursor: pointer;
      transition: all .18s; box-shadow: 0 4px 14px var(--primary-glow);
    }
    .mt-add-btn:hover { background: var(--primary-dim); transform: translateY(-1px); box-shadow: 0 6px 20px var(--primary-glow); }
    .mt-add-btn:disabled { opacity: 0.5; cursor: not-allowed; pointer-events: none; }

    /* ── TABLE ── */
    .mt-table-wrap { overflow-x: auto; }
    .mt-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
    .mt-table thead tr { border-bottom: 2px solid var(--border); }
    .mt-table thead th {
      text-align: left; padding: 0 14px 12px;
      font-size: 11px; font-weight: 700; text-transform: uppercase;
      letter-spacing: .08em; color: var(--ink-3); white-space: nowrap;
    }
    .mt-table tbody tr { border-bottom: 1px solid var(--bg-3); transition: background .14s; }
    .mt-table tbody tr:last-child { border-bottom: none; }
    .mt-table tbody tr:hover { background: var(--bg-3); }
    .mt-table td { padding: 13px 14px; color: var(--ink-2); vertical-align: middle; }
    .mt-table td.bold { font-weight: 700; color: var(--ink); }
    .mt-table td.mono { font-family: 'Syne', sans-serif; font-weight: 700; color: var(--ink); }
    .mt-status-badge {
      display: inline-flex; align-items: center;
      padding: 3px 12px; border-radius: 100px;
      font-size: 12px; font-weight: 700; border: 1.5px solid;
    }
    .mt-status-badge.pending { background: var(--amber-lt); color: var(--amber); border-color: #5a4a2a; }
    .mt-status-badge.delivered { background: var(--green-lt); color: var(--green); border-color: #2a5a3a; }
    .mt-status-badge.cancelled { background: var(--red-lt); color: var(--red-2); border-color: #5a2a2a; }
    .mt-btn-edit, .mt-btn-delete {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 6px 13px; border-radius: 100px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 12px; font-weight: 700; cursor: pointer; border: 1.5px solid;
      transition: all .15s;
    }
    .mt-btn-edit { color: var(--ink); border-color: var(--border-2); background: var(--bg-3); }
    .mt-btn-edit:hover { background: var(--ink); color: var(--bg); border-color: var(--ink); }
    .mt-btn-delete { color: var(--red-2); border-color: #5a2a2a; background: var(--red-lt); }
    .mt-btn-delete:hover { background: var(--red); color: #fff; border-color: var(--red); }
    .mt-empty { text-align: center; padding: 48px 0; color: var(--ink-3); font-size: 14px; }

    /* ── MODAL ── */
    .mt-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.8); backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
      z-index: 999; animation: mt-fade .2s ease;
    }
    .mt-modal {
      background: var(--bg-2); border: 1px solid var(--border);
      border-radius: var(--radius-xl); padding: clamp(24px, 4vw, 36px);
      width: 90%; max-width: 500px;
      box-shadow: var(--shadow-lg);
      animation: mt-scale .25s cubic-bezier(.34,1.56,.64,1);
    }
    .mt-modal-title {
      font-family: 'Syne', sans-serif;
      font-size: 20px; font-weight: 800; color: var(--ink);
      margin-bottom: 20px;
    }

    /* ── FORM ── */
    .mt-form-group { margin-bottom: 18px; }
    .mt-label { display: block; font-size: 12px; font-weight: 700; color: var(--ink-2); margin-bottom: 7px; text-transform: uppercase; letter-spacing: .07em; }
    .mt-input, .mt-select {
      width: 100%; padding: 11px 16px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 14px; color: var(--ink);
      border: 1.5px solid var(--border);
      border-radius: var(--radius);
      background: var(--bg-3);
      outline: none; transition: all .18s;
    }
    .mt-input:focus, .mt-select:focus {
      border-color: var(--ink); background: var(--bg-2);
      box-shadow: 0 0 0 3px rgba(255,255,255,0.1);
    }
    .mt-select {
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23cccccc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 16px center;
    }
    .mt-error { font-size: 11px; color: var(--red-2); font-weight: 600; margin-top: 5px; display: flex; align-items: center; gap: 4px; }

    /* ── MODAL BUTTONS ── */
    .mt-modal-btns { display: flex; gap: 10px; justify-content: flex-end; margin-top: 24px; flex-wrap: wrap; }
    .mt-btn-primary, .mt-btn-secondary, .mt-btn-danger {
      padding: 10px 24px; border-radius: 100px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 13px; font-weight: 700; cursor: pointer;
      transition: all .18s; border: 1.5px solid;
    }
    .mt-btn-primary { background: var(--ink); color: var(--bg); border-color: var(--ink); box-shadow: 0 4px 12px var(--primary-glow); }
    .mt-btn-primary:hover { background: var(--primary-dim); transform: translateY(-1px); box-shadow: 0 6px 18px var(--primary-glow); }
    .mt-btn-secondary { background: var(--bg-3); color: var(--ink-2); border-color: var(--border); }
    .mt-btn-secondary:hover { border-color: var(--border-2); color: var(--ink); }
    .mt-btn-danger { background: var(--red-lt); color: var(--red-2); border-color: #5a2a2a; }
    .mt-btn-danger:hover { background: var(--red); color: #fff; border-color: var(--red); }

    /* ── CONFIRM MODAL ── */
    .mt-confirm-modal {
      background: var(--bg-2); border: 1px solid var(--border);
      border-radius: var(--radius-xl); padding: clamp(28px, 4vw, 40px);
      width: 90%; max-width: 380px; text-align: center;
      box-shadow: var(--shadow-lg);
      animation: mt-scale .25s cubic-bezier(.34,1.56,.64,1);
    }
    .mt-confirm-icon { font-size: 40px; margin-bottom: 12px; }
    .mt-confirm-title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: var(--ink); margin-bottom: 8px; }
    .mt-confirm-text { font-size: 14px; color: var(--ink-3); margin-bottom: 24px; line-height: 1.5; }
    .mt-confirm-btns { display: flex; gap: 10px; justify-content: center; }

    /* ── LOADER ── */
    .mt-loader {
      min-height: 100vh; display: flex; flex-direction: column;
      align-items: center; justify-content: center; background: var(--bg); gap: 16px;
    }
    .mt-spinner {
      width: 44px; height: 44px; border: 3px solid var(--border);
      border-top-color: var(--ink); border-radius: 100%;
      animation: mt-spin .8s linear infinite;
    }
    .mt-loader-text { font-family: 'Syne', sans-serif; font-size: 13px; color: var(--ink-3); font-weight: 700; letter-spacing: .06em; }

    /* ── KEYFRAMES ── */
    @keyframes mt-spin { to { transform: rotate(360deg); } }
    @keyframes mt-fade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes mt-scale { from { opacity:0; transform:scale(.93); } to { opacity:1; transform:scale(1); } }
    @keyframes mt-up { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
  `;
  document.head.appendChild(s);
};

/* ─── TRANSLATIONS (unchanged) ───────────────────────────────── */
const translations = {
  en: {
    manageTransactions: 'Manage Transactions',
    totalTransactions: 'Total Transactions',
    addTransaction: 'Add Transaction',
    edit: 'Edit',
    delete: 'Delete',
    buyer: 'Buyer ID',
    product: 'Product ID',
    quantity: 'Quantity',
    totalPrice: 'Total Price',
    status: 'Status',
    date: 'Date',
    actions: 'Actions',
    save: 'Save',
    cancel: 'Cancel',
    confirmDelete: 'Are you sure you want to delete this transaction?',
    yes: 'Yes',
    no: 'No',
    logout: 'Logout',
    confirmLogout: 'Are you sure you want to logout?',
    welcome: 'Welcome',
    loading: 'Loading...',
    backToDashboard: '← Back to Dashboard',
    buyerRequired: 'Buyer ID is required',
    productRequired: 'Product ID is required',
    quantityRequired: 'Quantity is required',
    totalPriceRequired: 'Total price is required',
    statusRequired: 'Status is required',
    dateRequired: 'Date is required',
    noTransactions: 'No transactions found',
  },
  fr: {
    manageTransactions: 'Gérer les transactions',
    totalTransactions: 'Total transactions',
    addTransaction: 'Ajouter transaction',
    edit: 'Modifier',
    delete: 'Supprimer',
    buyer: 'Acheteur ID',
    product: 'Produit ID',
    quantity: 'Quantité',
    totalPrice: 'Prix total',
    status: 'Statut',
    date: 'Date',
    actions: 'Actions',
    save: 'Enregistrer',
    cancel: 'Annuler',
    confirmDelete: 'Êtes-vous sûr de vouloir supprimer cette transaction ?',
    yes: 'Oui',
    no: 'Non',
    logout: 'Déconnexion',
    confirmLogout: 'Êtes-vous sûr de vouloir vous déconnecter ?',
    welcome: 'Bienvenue',
    loading: 'Chargement...',
    backToDashboard: '← Retour au tableau de bord',
    buyerRequired: "L'ID acheteur est requis",
    productRequired: "L'ID produit est requis",
    quantityRequired: 'La quantité est requise',
    totalPriceRequired: 'Le prix total est requis',
    statusRequired: 'Le statut est requis',
    dateRequired: 'La date est requise',
    noTransactions: 'Aucune transaction trouvée',
  },
  rw: {
    manageTransactions: 'Gereri ibikorwa',
    totalTransactions: 'Ibikorwa byose',
    addTransaction: 'Ongeraho igikorwa',
    edit: 'Hindura',
    delete: 'Siba',
    buyer: 'Indangamuntu y\'umuguzi',
    product: 'Indangabicuruzwa',
    quantity: 'Ingano',
    totalPrice: 'Igiciro cyose',
    status: 'Imimerere',
    date: 'Itariki',
    actions: 'Ibikorwa',
    save: 'Bika',
    cancel: 'Reka',
    confirmDelete: 'Wiringiye ko ushaka gusiba iki gikorwa?',
    yes: 'Yego',
    no: 'Oya',
    logout: 'Sohoka',
    confirmLogout: 'Wiringiye ko ushaka gusohoka?',
    welcome: 'Murakaza neza',
    loading: 'Biratwara...',
    backToDashboard: '← Subira kuri dashubode',
    buyerRequired: 'Indangamuntu y\'umuguzi irakenewe',
    productRequired: 'Indangabicuruzwa irakenewe',
    quantityRequired: 'Ingano irakenewe',
    totalPriceRequired: 'Igiciro cyose gikenewe',
    statusRequired: 'Imimerere irakenerwa',
    dateRequired: 'Itariki irakenewe',
    noTransactions: 'Nta bikorwa byabonetse',
  },
};

const languageOptions = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'rw', label: 'Kinyarwanda', flag: '🇷🇼' },
];

export default function ManageTransactions() {
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('en');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [formData, setFormData] = useState({
    buyer_id: '',
    product_id: '',
    quantity: '',
    total_price: '',
    status: 'pending',
    date: '',
  });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [errors, setErrors] = useState({});

  const t = translations[language] || translations.en;

  useEffect(() => {
    injectStyles();
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await getTransactions();
      setTransactions(res.data || []);
    } catch (err) {
      console.error('Failed to fetch transactions', err);
      alert('Failed to load transactions. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingTransaction(null);
    setFormData({
      buyer_id: '',
      product_id: '',
      quantity: '',
      total_price: '',
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
    });
    setErrors({});
    setShowTransactionModal(true);
  };

  const handleOpenEditModal = (tx) => {
    setEditingTransaction(tx);
    setFormData({
      buyer_id: tx.buyer_id,
      product_id: tx.product_id,
      quantity: tx.quantity,
      total_price: tx.total_price,
      status: tx.status,
      date: tx.date.split('T')[0],
    });
    setErrors({});
    setShowTransactionModal(true);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.buyer_id) newErrors.buyer_id = t.buyerRequired;
    if (!formData.product_id) newErrors.product_id = t.productRequired;
    if (!formData.quantity) newErrors.quantity = t.quantityRequired;
    if (!formData.total_price) newErrors.total_price = t.totalPriceRequired;
    if (!formData.status) newErrors.status = t.statusRequired;
    if (!formData.date) newErrors.date = t.dateRequired;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveTransaction = async () => {
    if (!validateForm()) return;
    try {
      const payload = {
        buyer_id: formData.buyer_id,
        product_id: formData.product_id,
        quantity: Number(formData.quantity),
        total_price: Number(formData.total_price),
        status: formData.status,
        date: formData.date,
      };
      if (!editingTransaction) {
        await createTransaction(payload);
      } else {
        await updateTransaction(editingTransaction.transaction_id, payload);
      }
      setShowTransactionModal(false);
      fetchTransactions();
    } catch (err) {
      console.error('Save failed', err);
      alert(`Save failed: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
      setDeleteConfirm(null);
      fetchTransactions();
    } catch (err) {
      console.error('Delete failed', err);
      alert(`Delete failed: ${err.response?.data?.message || err.message}`);
    }
  };

  const totalTransactions = transactions.length;

  if (loading) {
    return (
      <div className="mt-loader">
        <div className="mt-spinner" />
        <div className="mt-loader-text">LOADING TRANSACTIONS...</div>
      </div>
    );
  }

  return (
    <div className="mt-root">
      <header className="mt-topbar">
        <div className="mt-topbar-left">
          <Link to="/" className="mt-back-btn">
            ← {t.backToDashboard}
          </Link>
          <h1 className="mt-page-title">{t.manageTransactions}</h1>
        </div>

        <div className="mt-user-pill">
          <span className="mt-email">{user?.email || t.welcome}</span>

          {/* Language */}
          <div className="mt-lang-wrap">
            <button className="mt-lang-btn" onClick={() => setShowLanguageDropdown(v => !v)}>
              🌐 {language.toUpperCase()} ▾
            </button>
            {showLanguageDropdown && (
              <div className="mt-lang-dropdown">
                {languageOptions.map(opt => (
                  <div
                    key={opt.code}
                    className={`mt-lang-opt${opt.code === language ? ' sel' : ''}`}
                    onClick={() => { setLanguage(opt.code); setShowLanguageDropdown(false); }}
                  >
                    {opt.flag} {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Logout */}
          <button className="mt-logout-btn" onClick={() => setShowLogoutModal(true)}>
            🚪 {t.logout}
          </button>

          <div className="mt-avatar">
            {user?.full_name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="mt-stats">
        <div className="mt-stat">
          <div className="mt-stat-icon">📦</div>
          <div className="mt-stat-label">{t.totalTransactions}</div>
          <div className="mt-stat-value">{totalTransactions}</div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="mt-card">
        <div className="mt-card-header">
          <h2 className="mt-card-title">📋 {t.manageTransactions}</h2>
          <button className="mt-add-btn" onClick={handleOpenAddModal}>
            + {t.addTransaction}
          </button>
        </div>

        <div className="mt-table-wrap">
          <table className="mt-table">
            <thead>
              <tr>
                <th>{t.buyer}</th>
                <th>{t.product}</th>
                <th>{t.quantity}</th>
                <th>{t.totalPrice}</th>
                <th>{t.status}</th>
                <th>{t.date}</th>
                <th>{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="mt-empty">{t.noTransactions}</td>
                </tr>
              ) : (
                transactions.map(tx => (
                  <tr key={tx.transaction_id || tx.id}>
                    <td>{tx.buyer_id}</td>
                    <td>{tx.product_id}</td>
                    <td>{tx.quantity}</td>
                    <td className="mono">RWF {tx.total_price?.toLocaleString()}</td>
                    <td>
                      <span className={`mt-status-badge ${tx.status}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td>{new Date(tx.date).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <button className="mt-btn-edit" onClick={() => handleOpenEditModal(tx)}>
                          ✏️ {t.edit}
                        </button>
                        <button className="mt-btn-delete" onClick={() => setDeleteConfirm(tx)}>
                          🗑 {t.delete}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showTransactionModal && (
        <div className="mt-overlay" onClick={() => setShowTransactionModal(false)}>
          <div className="mt-modal" onClick={e => e.stopPropagation()}>
            <h2 className="mt-modal-title">
              {editingTransaction ? `✏️ ${t.edit}` : `➕ ${t.addTransaction}`}
            </h2>

            <div className="mt-form-group">
              <label className="mt-label">{t.buyer}</label>
              <input
                className="mt-input"
                type="number"
                value={formData.buyer_id}
                onChange={e => setFormData({ ...formData, buyer_id: e.target.value })}
              />
              {errors.buyer_id && <div className="mt-error">⚠ {errors.buyer_id}</div>}
            </div>

            <div className="mt-form-group">
              <label className="mt-label">{t.product}</label>
              <input
                className="mt-input"
                type="number"
                value={formData.product_id}
                onChange={e => setFormData({ ...formData, product_id: e.target.value })}
              />
              {errors.product_id && <div className="mt-error">⚠ {errors.product_id}</div>}
            </div>

            <div className="mt-form-group">
              <label className="mt-label">{t.quantity}</label>
              <input
                className="mt-input"
                type="number"
                value={formData.quantity}
                onChange={e => setFormData({ ...formData, quantity: e.target.value })}
              />
              {errors.quantity && <div className="mt-error">⚠ {errors.quantity}</div>}
            </div>

            <div className="mt-form-group">
              <label className="mt-label">{t.totalPrice}</label>
              <input
                className="mt-input"
                type="number"
                value={formData.total_price}
                onChange={e => setFormData({ ...formData, total_price: e.target.value })}
              />
              {errors.total_price && <div className="mt-error">⚠ {errors.total_price}</div>}
            </div>

            <div className="mt-form-group">
              <label className="mt-label">{t.status}</label>
              <select
                className="mt-select"
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="pending">Pending</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              {errors.status && <div className="mt-error">⚠ {errors.status}</div>}
            </div>

            <div className="mt-form-group">
              <label className="mt-label">{t.date}</label>
              <input
                className="mt-input"
                type="date"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
              />
              {errors.date && <div className="mt-error">⚠ {errors.date}</div>}
            </div>

            <div className="mt-modal-btns">
              <button className="mt-btn-secondary" onClick={() => setShowTransactionModal(false)}>
                {t.cancel}
              </button>
              <button className="mt-btn-primary" onClick={handleSaveTransaction}>
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="mt-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="mt-confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="mt-confirm-icon">🗑️</div>
            <h3 className="mt-confirm-title">{t.delete}</h3>
            <p className="mt-confirm-text">{t.confirmDelete}</p>
            <div className="mt-confirm-btns">
              <button
                className="mt-btn-danger"
                onClick={() => handleDelete(deleteConfirm.transaction_id || deleteConfirm.id)}
              >
                {t.yes}
              </button>
              <button className="mt-btn-secondary" onClick={() => setDeleteConfirm(null)}>
                {t.no}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="mt-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="mt-confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="mt-confirm-icon">🚪</div>
            <h3 className="mt-confirm-title">{t.logout}</h3>
            <p className="mt-confirm-text">{t.confirmLogout}</p>
            <div className="mt-confirm-btns">
              <button
                className="mt-btn-primary"
                onClick={async () => {
                  setShowLogoutModal(false);
                  try { await logout(); } catch (err) { console.error(err); }
                }}
              >
                {t.yes}
              </button>
              <button className="mt-btn-secondary" onClick={() => setShowLogoutModal(false)}>
                {t.no}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}