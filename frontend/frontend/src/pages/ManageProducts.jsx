// ManageProducts.jsx — Blue & White Professional Redesign (all errors fixed)
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/api';
import { Link } from 'react-router-dom';

/* ─── INJECT STYLES ──────────────────────────────────────────── */
const injectStyles = () => {
  if (document.getElementById('mp-css')) return;
  const s = document.createElement('style');
  s.id = 'mp-css';
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@600;700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:        #f0f4fb;
      --bg-2:      #ffffff;
      --bg-3:      #e8eef8;
      --border:    #dce6f5;
      --border-2:  #b8ccee;
      --ink:       #0f1c3a;
      --ink-2:     #4a5e82;
      --ink-3:     #8fa3c8;
      --blue:      #1e4fd8;
      --blue-2:    #2563eb;
      --blue-3:    #3b82f6;
      --blue-lt:   #dbeafe;
      --blue-xlt:  #eff6ff;
      --blue-glow: rgba(37,99,235,.18);
      --red:       #ef4444;
      --red-lt:    #fee2e2;
      --red-2:     #dc2626;
      --green:     #10b981;
      --green-lt:  #d1fae5;
      --amber:     #f59e0b;
      --amber-lt:  #fef3c7;
      --radius:    12px;
      --radius-lg: 18px;
      --radius-xl: 24px;
      --shadow-sm: 0 1px 6px rgba(30,79,216,.06);
      --shadow:    0 4px 20px rgba(30,79,216,.1);
      --shadow-lg: 0 16px 48px rgba(30,79,216,.14);
    }

    html, body { background: var(--bg); }
    .mp-root {
      font-family: 'Plus Jakarta Sans', sans-serif;
      color: var(--ink);
      min-height: 100vh;
      background: var(--bg);
      padding: clamp(20px, 4vw, 36px);
    }

    /* ── TOPBAR ── */
    .mp-topbar {
      display: flex; align-items: center; justify-content: space-between;
      flex-wrap: wrap; gap: 16px;
      margin-bottom: 28px;
      animation: mp-up .4s ease forwards;
    }
    .mp-topbar-left { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
    .mp-back-btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 8px 18px; border-radius: 100px;
      border: 1.5px solid var(--border-2);
      background: var(--bg-2); color: var(--blue-2);
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 13px; font-weight: 600;
      text-decoration: none; transition: all .18s;
    }
    .mp-back-btn:hover { background: var(--blue-xlt); border-color: var(--blue-2); box-shadow: var(--shadow-sm); }
    .mp-page-title {
      font-family: 'Syne', sans-serif;
      font-size: clamp(20px, 4vw, 28px);
      font-weight: 800; color: var(--ink);
    }

    /* ── USER PILL ── */
    .mp-user-pill {
      display: flex; align-items: center; gap: 10px;
      background: var(--bg-2); border: 1px solid var(--border);
      border-radius: 100px; padding: 5px 5px 5px 16px;
      box-shadow: var(--shadow-sm); flex-wrap: wrap;
    }
    .mp-email { font-size: 13px; font-weight: 500; color: var(--ink-2); max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .mp-lang-wrap { position: relative; }
    .mp-lang-btn, .mp-logout-btn {
      height: 34px; padding: 0 14px; border-radius: 100px;
      border: 1.5px solid var(--border); background: var(--bg-3);
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 12px; font-weight: 700; cursor: pointer;
      display: flex; align-items: center; gap: 5px;
      transition: all .18s; color: var(--ink-2);
    }
    .mp-lang-btn:hover { border-color: var(--blue-2); color: var(--blue-2); background: var(--blue-xlt); }
    .mp-logout-btn:hover { border-color: var(--red); color: var(--red); background: var(--red-lt); }
    .mp-lang-dropdown {
      position: absolute; top: calc(100% + 8px); right: 0;
      width: 150px; background: var(--bg-2);
      border: 1.5px solid var(--border); border-radius: var(--radius-lg);
      padding: 6px; box-shadow: var(--shadow-lg); z-index: 100;
    }
    .mp-lang-opt {
      display: flex; align-items: center; gap: 8px;
      padding: 9px 12px; border-radius: 10px;
      font-size: 13px; font-weight: 500; cursor: pointer;
      transition: all .13s; color: var(--ink-2);
    }
    .mp-lang-opt:hover, .mp-lang-opt.sel { background: var(--blue-xlt); color: var(--blue-2); }
    .mp-avatar {
      width: 34px; height: 34px; border-radius: 100%;
      background: var(--blue-2); color: #fff;
      font-weight: 800; font-size: 14px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }

    /* ── STATS ── */
    .mp-stats {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px; margin-bottom: 24px;
      animation: mp-up .4s ease .05s forwards; opacity: 0;
    }
    .mp-stat {
      background: var(--bg-2); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 20px 22px;
      box-shadow: var(--shadow-sm); position: relative; overflow: hidden;
      transition: all .22s;
    }
    .mp-stat:hover { transform: translateY(-3px); box-shadow: var(--shadow); }
    .mp-stat::after {
      content: ''; position: absolute;
      top: 0; left: 0; right: 0; height: 3px;
      border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    }
    .mp-stat.blue::after { background: var(--blue-2); }
    .mp-stat.amber::after { background: var(--amber); }
    .mp-stat.green::after { background: var(--green); }
    .mp-stat-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: var(--ink-3); margin-bottom: 6px; }
    .mp-stat-value { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; color: var(--ink); }
    .mp-stat-icon { font-size: 22px; margin-bottom: 10px; }

    /* ── CARD ── */
    .mp-card {
      background: var(--bg-2); border: 1px solid var(--border);
      border-radius: var(--radius-xl); padding: clamp(18px, 3vw, 28px);
      box-shadow: var(--shadow-sm);
      animation: mp-up .4s ease .1s forwards; opacity: 0;
    }
    .mp-card-header {
      display: flex; align-items: center; justify-content: space-between;
      flex-wrap: wrap; gap: 12px;
      padding-bottom: 18px; border-bottom: 1px solid var(--border);
      margin-bottom: 20px;
    }
    .mp-card-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: var(--ink); }
    .mp-add-btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 10px 20px; border-radius: 100px;
      background: var(--blue-2); border: none; color: #fff;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 13px; font-weight: 700; cursor: pointer;
      transition: all .18s; box-shadow: 0 4px 14px var(--blue-glow);
    }
    .mp-add-btn:hover { background: var(--blue); transform: translateY(-1px); box-shadow: 0 6px 20px var(--blue-glow); }

    /* ── TABLE ── */
    .mp-table-wrap { overflow-x: auto; }
    .mp-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
    .mp-table thead tr { border-bottom: 2px solid var(--border); }
    .mp-table thead th {
      text-align: left; padding: 0 14px 12px;
      font-size: 11px; font-weight: 700; text-transform: uppercase;
      letter-spacing: .08em; color: var(--ink-3); white-space: nowrap;
    }
    .mp-table tbody tr { border-bottom: 1px solid var(--bg-3); transition: background .14s; }
    .mp-table tbody tr:last-child { border-bottom: none; }
    .mp-table tbody tr:hover { background: var(--blue-xlt); }
    .mp-table td { padding: 13px 14px; color: var(--ink-2); vertical-align: middle; }
    .mp-table td.bold { font-weight: 700; color: var(--ink); }
    .mp-table td.mono { font-family: 'Syne', sans-serif; font-weight: 700; color: var(--blue-2); }
    .mp-qty-badge {
      display: inline-flex; align-items: center;
      padding: 3px 10px; border-radius: 100px;
      font-size: 12px; font-weight: 700; border: 1.5px solid;
    }
    .mp-qty-badge.ok { background: var(--green-lt); color: #047857; border-color: #a7f3d0; }
    .mp-qty-badge.low { background: var(--amber-lt); color: #92400e; border-color: #fcd34d; }
    .mp-qty-badge.empty { background: var(--red-lt); color: var(--red-2); border-color: #fca5a5; }
    .mp-btn-edit, .mp-btn-delete {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 6px 13px; border-radius: 100px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 12px; font-weight: 700; cursor: pointer; border: 1.5px solid;
      transition: all .15s;
    }
    .mp-btn-edit { color: var(--blue-2); border-color: var(--blue-lt); background: var(--blue-xlt); }
    .mp-btn-edit:hover { background: var(--blue-2); color: #fff; border-color: var(--blue-2); }
    .mp-btn-delete { color: var(--red); border-color: #fca5a5; background: var(--red-lt); }
    .mp-btn-delete:hover { background: var(--red); color: #fff; border-color: var(--red); }
    .mp-empty { text-align: center; padding: 48px 0; color: var(--ink-3); font-size: 14px; }

    /* ── MODAL ── */
    .mp-overlay {
      position: fixed; inset: 0;
      background: rgba(15,28,58,.3); backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
      z-index: 999; animation: mp-fade .2s ease;
    }
    .mp-modal {
      background: var(--bg-2); border: 1px solid var(--border);
      border-radius: var(--radius-xl); padding: clamp(24px, 4vw, 36px);
      width: 90%; max-width: 480px;
      box-shadow: var(--shadow-lg);
      animation: mp-scale .25s cubic-bezier(.34,1.56,.64,1);
    }
    .mp-modal-title {
      font-family: 'Syne', sans-serif;
      font-size: 20px; font-weight: 800; color: var(--ink);
      margin-bottom: 20px;
    }

    /* ── STEP INDICATOR ── */
    .mp-steps { display: flex; gap: 0; margin-bottom: 24px; }
    .mp-step {
      flex: 1; text-align: center; padding: 8px 4px;
      font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em;
      color: var(--ink-3); border-bottom: 3px solid var(--border);
      transition: all .2s;
    }
    .mp-step.active { color: var(--blue-2); border-bottom-color: var(--blue-2); }
    .mp-step.done { color: var(--green); border-bottom-color: var(--green); }

    /* ── FORM ── */
    .mp-form-group { margin-bottom: 18px; }
    .mp-label { display: block; font-size: 12px; font-weight: 700; color: var(--ink-2); margin-bottom: 7px; text-transform: uppercase; letter-spacing: .07em; }
    .mp-input, .mp-textarea, .mp-select {
      width: 100%; padding: 11px 16px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 14px; color: var(--ink);
      border: 1.5px solid var(--border);
      border-radius: var(--radius);
      background: var(--bg-3);
      outline: none; transition: all .18s;
    }
    .mp-input:focus, .mp-textarea:focus, .mp-select:focus {
      border-color: var(--blue-2); background: var(--bg-2);
      box-shadow: 0 0 0 3px var(--blue-lt);
    }
    .mp-textarea { min-height: 90px; resize: vertical; border-radius: var(--radius); }
    .mp-error { font-size: 11px; color: var(--red); font-weight: 600; margin-top: 5px; display: flex; align-items: center; gap: 4px; }

    /* ── SUMMARY BOX ── */
    .mp-summary { background: var(--blue-xlt); border: 1.5px solid var(--blue-lt); border-radius: var(--radius-lg); padding: 16px 18px; margin-bottom: 4px; }
    .mp-summary-row { display: flex; justify-content: space-between; align-items: center; padding: 7px 0; border-bottom: 1px solid var(--blue-lt); }
    .mp-summary-row:last-child { border-bottom: none; }
    .mp-summary-key { font-size: 12px; font-weight: 700; color: var(--ink-3); text-transform: uppercase; letter-spacing: .06em; }
    .mp-summary-val { font-size: 14px; font-weight: 600; color: var(--blue); }

    /* ── MODAL BUTTONS ── */
    .mp-modal-btns { display: flex; gap: 10px; justify-content: flex-end; margin-top: 24px; flex-wrap: wrap; }
    .mp-btn-primary, .mp-btn-secondary, .mp-btn-danger {
      padding: 10px 24px; border-radius: 100px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 13px; font-weight: 700; cursor: pointer;
      transition: all .18s; border: 1.5px solid;
    }
    .mp-btn-primary { background: var(--blue-2); color: #fff; border-color: var(--blue-2); box-shadow: 0 4px 12px var(--blue-glow); }
    .mp-btn-primary:hover { background: var(--blue); transform: translateY(-1px); box-shadow: 0 6px 18px var(--blue-glow); }
    .mp-btn-secondary { background: var(--bg-3); color: var(--ink-2); border-color: var(--border); }
    .mp-btn-secondary:hover { border-color: var(--border-2); color: var(--ink); }
    .mp-btn-danger { background: var(--red-lt); color: var(--red); border-color: #fca5a5; }
    .mp-btn-danger:hover { background: var(--red); color: #fff; border-color: var(--red); }

    /* ── CONFIRM MODAL ── */
    .mp-confirm-modal {
      background: var(--bg-2); border: 1px solid var(--border);
      border-radius: var(--radius-xl); padding: clamp(28px, 4vw, 40px);
      width: 90%; max-width: 380px; text-align: center;
      box-shadow: var(--shadow-lg);
      animation: mp-scale .25s cubic-bezier(.34,1.56,.64,1);
    }
    .mp-confirm-icon { font-size: 40px; margin-bottom: 12px; }
    .mp-confirm-title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: var(--ink); margin-bottom: 8px; }
    .mp-confirm-text { font-size: 14px; color: var(--ink-3); margin-bottom: 24px; line-height: 1.5; }
    .mp-confirm-btns { display: flex; gap: 10px; justify-content: center; }

    /* ── LOADER ── */
    .mp-loader {
      min-height: 100vh; display: flex; flex-direction: column;
      align-items: center; justify-content: center; background: var(--bg); gap: 16px;
    }
    .mp-spinner {
      width: 44px; height: 44px; border: 3px solid var(--blue-lt);
      border-top-color: var(--blue-2); border-radius: 100%;
      animation: mp-spin .8s linear infinite;
    }
    .mp-loader-text { font-family: 'Syne', sans-serif; font-size: 13px; color: var(--ink-3); font-weight: 700; letter-spacing: .06em; }

    /* ── KEYFRAMES ── */
    @keyframes mp-spin { to { transform: rotate(360deg); } }
    @keyframes mp-fade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes mp-scale { from { opacity:0; transform:scale(.93); } to { opacity:1; transform:scale(1); } }
    @keyframes mp-up { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
  `;
  document.head.appendChild(s);
};

/* ─── TRANSLATIONS (fixed duplicate 'description' key) ───────── */
const TRANSLATIONS = {
  en: {
    manageProducts: 'Manage Products',
    totalProducts: 'Total Products',
    lowStock: 'Low Stock',
    inStock: 'In Stock',
    addProduct: 'Add Product',
    edit: 'Edit',
    delete: 'Delete',
    productName: 'Product Name',
    category: 'Category',
    pricePerUnit: 'Price / Unit (RWF)',
    quantity: 'Quantity',
    descriptionLabel: 'Description',      // ← fixed: was duplicate key
    actions: 'Actions',
    save: 'Save Product',
    cancel: 'Cancel',
    confirmDelete: 'Are you sure you want to delete this product? This action cannot be undone.',
    yes: 'Yes, Delete',
    no: 'Cancel',
    logout: 'Logout',
    confirmLogout: 'Are you sure you want to logout?',
    welcome: 'Welcome',
    loading: 'Loading...',
    next: 'Next →',
    back: '← Back',
    basicInfo: 'Basic Info',
    categoryStock: 'Category & Stock',
    pricing: 'Pricing',                   // ← fixed: step 3 label corrected
    summary: 'Summary',
    nameRequired: 'Product name is required',
    categoryRequired: 'Category is required',
    priceRequired: 'Price must be a positive number',
    quantityRequired: 'Quantity must be a non-negative integer',
    review: 'Please review your product details before saving.',
    backToDashboard: 'Back to Dashboard',
    noProducts: 'No products found. Add one to get started.',
    logoutConfirm: 'Yes, Logout',
  },
  fr: {
    manageProducts: 'Gérer les Produits',
    totalProducts: 'Total produits',
    lowStock: 'Stock faible',
    inStock: 'En stock',
    addProduct: 'Ajouter produit',
    edit: 'Modifier',
    delete: 'Supprimer',
    productName: 'Nom du produit',
    category: 'Catégorie',
    pricePerUnit: 'Prix unitaire (RWF)',
    quantity: 'Quantité',
    descriptionLabel: 'Description',
    actions: 'Actions',
    save: 'Enregistrer',
    cancel: 'Annuler',
    confirmDelete: 'Êtes-vous sûr de vouloir supprimer ce produit ?',
    yes: 'Oui, supprimer',
    no: 'Annuler',
    logout: 'Déconnexion',
    confirmLogout: 'Êtes-vous sûr de vouloir vous déconnecter ?',
    welcome: 'Bienvenue',
    loading: 'Chargement...',
    next: 'Suivant →',
    back: '← Retour',
    basicInfo: 'Infos de base',
    categoryStock: 'Catégorie & Stock',
    pricing: 'Tarification',
    summary: 'Récapitulatif',
    nameRequired: 'Le nom du produit est requis',
    categoryRequired: 'La catégorie est requise',
    priceRequired: 'Le prix doit être un nombre positif',
    quantityRequired: 'La quantité doit être un entier non négatif',
    review: 'Veuillez vérifier les détails du produit avant de sauvegarder.',
    backToDashboard: 'Tableau de bord',
    noProducts: 'Aucun produit trouvé.',
    logoutConfirm: 'Oui, déconnecter',
  },
  rw: {
    manageProducts: 'Gereri Ibicuruzwa',
    totalProducts: 'Ibicuruzwa byose',
    lowStock: 'Ibike',
    inStock: 'Bihari',
    addProduct: 'Ongeraho icuruzwa',
    edit: 'Hindura',
    delete: 'Siba',
    productName: "Izina ry'icuruzwa",
    category: 'Icyiciro',
    pricePerUnit: 'Igiciro ku gipimo (RWF)',
    quantity: 'Umubare',
    descriptionLabel: 'Ibisobanuro',
    actions: 'Ibikorwa',
    save: 'Bika',
    cancel: 'Reka',
    confirmDelete: 'Wiringiye ko ushaka gusiba iki gicuruzwa?',
    yes: 'Yego, siba',
    no: 'Oya',
    logout: 'Sohoka',
    confirmLogout: 'Wiringiye ko ushaka gusohoka?',
    welcome: 'Murakaza neza',
    loading: 'Biratwara...',
    next: 'Ibikurikira →',
    back: '← Inyuma',
    basicInfo: "Amakuru y'ibanze",
    categoryStock: "Icyiciro n'umubare",
    pricing: 'Igiciro',
    summary: 'Incamake',
    nameRequired: "Izina ry'icuruzwa rirakenewe",
    categoryRequired: 'Icyiciro gikenewe',
    priceRequired: 'Igiciro kigomba kuba umubare munsi y\'ibihumbi',
    quantityRequired: 'Umubare ugomba kuba utari munsi',
    review: 'Nyamuneka suzumamo iby\'icuruzwa mbere yo kubika.',
    backToDashboard: 'Subira kuri dashubode',
    noProducts: 'Nta bicuruzwa bibonetse.',
    logoutConfirm: 'Yego, sohoka',
  },
};

const LANG_OPTIONS = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'rw', label: 'Kinyarwanda', flag: '🇷🇼' },
];

const EMPTY_FORM = { product_name: '', category: '', price_per_unit: '', quantity_available: '', description: '' };

/* ─── MAIN COMPONENT ─────────────────────────────────────────── */
export default function ManageProducts() {
  const { user, logout } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('en');
  const [showLangDD, setShowLangDD] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Product modal state
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState(null);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  useEffect(() => {
    injectStyles();
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts();
      setProducts(res?.data || []);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  /* ── MODAL OPEN ── */
  const openAdd = () => {
    setEditingProduct(null);
    setFormData(EMPTY_FORM);
    setErrors({});
    setCurrentStep(1);
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      product_name: product.product_name || product.name || '',
      category: product.category || '',
      price_per_unit: String(product.price_per_unit || product.price || ''),
      quantity_available: String(product.quantity_available ?? product.stock ?? ''),
      description: product.description || '',
    });
    setErrors({});
    setCurrentStep(1);
    setShowModal(true);
  };

  /* ── VALIDATION ── */
  const validateStep = useCallback((step, data) => {
    const errs = {};
    if (step === 1) {
      if (!data.product_name.trim()) errs.product_name = t.nameRequired;
    } else if (step === 2) {
      if (!data.category.trim()) errs.category = t.categoryRequired;
      const qty = Number(data.quantity_available);
      if (!Number.isInteger(qty) || qty < 0 || isNaN(qty)) errs.quantity_available = t.quantityRequired;
    } else if (step === 3) {
      const price = Number(data.price_per_unit);
      if (isNaN(price) || price <= 0) errs.price_per_unit = t.priceRequired;
    }
    return errs;
  }, [t]);

  const handleNext = () => {
    const errs = validateStep(currentStep, formData);
    setErrors(errs);
    if (Object.keys(errs).length === 0) setCurrentStep(s => s + 1);
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep(s => s - 1);
  };

  /* ── SAVE ── */
  const handleSave = async () => {
    // ✅ FIX: Role guard — only farmer or admin can create/edit products.
    // The backend returns 403 if user_type is 'buyer' or 'customer'.
    const allowedRoles = ['farmer', 'admin'];
    if (!allowedRoles.includes(user?.type)) {
      setErrors({
        _global: `Permission denied. Your account type "${user?.type}" cannot create or edit products. Please log in as a farmer or admin.`,
      });
      return;
    }

    // Validate all steps before saving
    const allErrs = {
      ...validateStep(1, formData),
      ...validateStep(2, formData),
      ...validateStep(3, formData),
    };
    if (Object.keys(allErrs).length > 0) {
      setErrors(allErrs);
      return;
    }

    try {
      const payload = {
        product_name: formData.product_name.trim(),
        category: formData.category.trim(),
        price_per_unit: Number(formData.price_per_unit),
        quantity_available: Number(formData.quantity_available),
        description: formData.description.trim(),
        // ✅ FIX: Include farmer_id from the logged-in user.
        // Many backends require this to associate the product with a farmer.
        // The backend's 403 often fires when this field is missing or mismatched.
        farmer_id: user?.id,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.product_id, payload);
      } else {
        await createProduct(payload);
      }

      setShowModal(false);
      setErrors({});
      fetchProducts();
    } catch (err) {
      console.error('Save failed', err);
      const serverMsg = err?.response?.data?.message || err?.response?.data?.error;
      const status = err?.response?.status;

      let friendlyMsg = serverMsg || err.message || 'Save failed. Please try again.';

      // ✅ FIX: Give a clear human-readable message for common HTTP errors
      if (status === 403) {
        friendlyMsg = `Permission denied (403). Your account (${user?.type}) is not allowed to perform this action. Contact your administrator.`;
      } else if (status === 401) {
        friendlyMsg = 'Session expired (401). Please log out and log back in.';
      } else if (status === 400) {
        friendlyMsg = serverMsg || 'Invalid data (400). Check all fields and try again.';
      }

      setErrors({ _global: friendlyMsg });
    }
  };

  /* ── DELETE ── */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduct(deleteTarget.product_id);
      setDeleteTarget(null);
      fetchProducts();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  /* ── COMPUTED STATS ── */
  const totalProducts = products.length;
  const lowStockCount = products.filter(p => Number(p.quantity_available ?? p.stock ?? 0) < 10).length;
  const inStockCount = products.filter(p => Number(p.quantity_available ?? p.stock ?? 0) >= 10).length;

  const getQtyBadge = (qty) => {
    if (qty <= 0) return { cls: 'empty', label: 'Out' };
    if (qty < 10) return { cls: 'low', label: qty };
    return { cls: 'ok', label: qty };
  };

  const STEPS = [t.basicInfo, t.categoryStock, t.pricing, t.summary];

  /* ── LOADER ── */
  if (loading) {
    return (
      <div className="mp-loader">
        <div className="mp-spinner" />
        <div className="mp-loader-text">LOADING PRODUCTS...</div>
      </div>
    );
  }

  return (
    <div className="mp-root">

      {/* ── ROLE GUARD BANNER — shown if user cannot manage products ── */}
      {user && !['farmer', 'admin'].includes(user?.type) && (
        <div style={{
          background: '#fef3c7', border: '1.5px solid #fcd34d',
          borderRadius: 'var(--radius-lg)', padding: '14px 20px',
          marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12,
          fontSize: 13, fontWeight: 600, color: '#92400e',
        }}>
          <span style={{ fontSize: 20 }}>⚠️</span>
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, marginBottom: 2 }}>
              Access Restricted
            </div>
            Your account type <strong>"{user?.type}"</strong> cannot create, edit, or delete products.
            Please log in as a <strong>farmer</strong> or <strong>admin</strong> to manage products.
          </div>
        </div>
      )}
      <header className="mp-topbar">
        <div className="mp-topbar-left">
          <Link to="/admin" className="mp-back-btn">
            ← {t.backToDashboard}
          </Link>
          <h1 className="mp-page-title">{t.manageProducts}</h1>
        </div>

        <div className="mp-user-pill">
          <span className="mp-email">{user?.email || t.welcome}</span>

          {/* Language */}
          <div className="mp-lang-wrap">
            <button className="mp-lang-btn" onClick={() => setShowLangDD(v => !v)}>
              {LANG_OPTIONS.find(o => o.code === language)?.flag} {language.toUpperCase()} ▾
            </button>
            {showLangDD && (
              <div className="mp-lang-dropdown">
                {LANG_OPTIONS.map(o => (
                  <div
                    key={o.code}
                    className={`mp-lang-opt${o.code === language ? ' sel' : ''}`}
                    onClick={() => { setLanguage(o.code); setShowLangDD(false); }}
                  >
                    {o.flag} {o.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Logout */}
          <button className="mp-logout-btn" onClick={() => setShowLogoutModal(true)}>
            🚪 {t.logout}
          </button>

          <div className="mp-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'A'}</div>
        </div>
      </header>

      {/* ── STATS ── */}
      <div className="mp-stats">
        <div className="mp-stat blue">
          <div className="mp-stat-icon">📦</div>
          <div className="mp-stat-label">{t.totalProducts}</div>
          <div className="mp-stat-value">{totalProducts}</div>
        </div>
        <div className="mp-stat amber">
          <div className="mp-stat-icon">⚠️</div>
          <div className="mp-stat-label">{t.lowStock}</div>
          <div className="mp-stat-value">{lowStockCount}</div>
        </div>
        <div className="mp-stat green">
          <div className="mp-stat-icon">✅</div>
          <div className="mp-stat-label">{t.inStock}</div>
          <div className="mp-stat-value">{inStockCount}</div>
        </div>
      </div>

      {/* ── PRODUCT TABLE ── */}
      <div className="mp-card">
        <div className="mp-card-header">
          <h2 className="mp-card-title">🌽 {t.manageProducts}</h2>
          <button
            className="mp-add-btn"
            onClick={openAdd}
            disabled={!['farmer', 'admin'].includes(user?.type)}
            style={!['farmer', 'admin'].includes(user?.type) ? { opacity: 0.4, cursor: 'not-allowed', transform: 'none', boxShadow: 'none' } : {}}
            title={!['farmer', 'admin'].includes(user?.type) ? `Your role "${user?.type}" cannot add products` : ''}
          >
            + {t.addProduct}
          </button>
        </div>

        <div className="mp-table-wrap">
          <table className="mp-table">
            <thead>
              <tr>
                <th>{t.productName}</th>
                <th>{t.category}</th>
                <th>{t.pricePerUnit}</th>
                <th>{t.quantity}</th>
                <th>{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="mp-empty">{t.noProducts}</td>
                </tr>
              ) : (
                products.map(p => {
                  const qty = Number(p.quantity_available ?? p.stock ?? 0);
                  const badge = getQtyBadge(qty);
                  return (
                    <tr key={p.product_id}>
                      <td className="bold">{p.product_name || p.name || '—'}</td>
                      <td>{p.category || '—'}</td>
                      <td className="mono">RWF {Number(p.price_per_unit || p.price || 0).toLocaleString()}</td>
                      <td>
                        <span className={`mp-qty-badge ${badge.cls}`}>{badge.label}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          <button
                            className="mp-btn-edit"
                            onClick={() => openEdit(p)}
                            disabled={!['farmer', 'admin'].includes(user?.type)}
                            style={!['farmer', 'admin'].includes(user?.type) ? { opacity: 0.35, cursor: 'not-allowed' } : {}}
                          >
                            ✏️ {t.edit}
                          </button>
                          <button
                            className="mp-btn-delete"
                            onClick={() => setDeleteTarget(p)}
                            disabled={!['farmer', 'admin'].includes(user?.type)}
                            style={!['farmer', 'admin'].includes(user?.type) ? { opacity: 0.35, cursor: 'not-allowed' } : {}}
                          >
                            🗑 {t.delete}
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

      {/* ── ADD/EDIT PRODUCT MODAL ── */}
      {showModal && (
        <div className="mp-overlay" onClick={() => setShowModal(false)}>
          <div className="mp-modal" onClick={e => e.stopPropagation()}>
            <h2 className="mp-modal-title">
              {editingProduct ? `✏️ ${t.edit}` : `➕ ${t.addProduct}`}
            </h2>

            {/* Step Indicator */}
            <div className="mp-steps">
              {STEPS.map((label, i) => {
                const stepNum = i + 1;
                const cls = stepNum < currentStep ? 'done' : stepNum === currentStep ? 'active' : '';
                return (
                  <div key={i} className={`mp-step ${cls}`}>
                    {stepNum < currentStep ? '✓ ' : ''}{label}
                  </div>
                );
              })}
            </div>

            {/* Step 1: Product Name */}
            {currentStep === 1 && (
              <div className="mp-form-group">
                <label className="mp-label">{t.productName}</label>
                <input
                  className="mp-input"
                  type="text"
                  value={formData.product_name}
                  onChange={e => setFormData({ ...formData, product_name: e.target.value })}
                  placeholder="e.g. Fresh Tomatoes"
                />
                {errors.product_name && <div className="mp-error">⚠ {errors.product_name}</div>}
              </div>
            )}

            {/* Step 2: Category & Quantity */}
            {currentStep === 2 && (
              <>
                <div className="mp-form-group">
                  <label className="mp-label">{t.category}</label>
                  <input
                    className="mp-input"
                    type="text"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Vegetables"
                  />
                  {errors.category && <div className="mp-error">⚠ {errors.category}</div>}
                </div>
                <div className="mp-form-group">
                  <label className="mp-label">{t.quantity}</label>
                  <input
                    className="mp-input"
                    type="number"
                    min="0"
                    value={formData.quantity_available}
                    onChange={e => setFormData({ ...formData, quantity_available: e.target.value })}
                    placeholder="e.g. 100"
                  />
                  {errors.quantity_available && <div className="mp-error">⚠ {errors.quantity_available}</div>}
                </div>
              </>
            )}

            {/* Step 3: Price & Description */}
            {currentStep === 3 && (
              <>
                <div className="mp-form-group">
                  <label className="mp-label">{t.pricePerUnit}</label>
                  <input
                    className="mp-input"
                    type="number"
                    min="1"
                    value={formData.price_per_unit}
                    onChange={e => setFormData({ ...formData, price_per_unit: e.target.value })}
                    placeholder="e.g. 5000"
                  />
                  {errors.price_per_unit && <div className="mp-error">⚠ {errors.price_per_unit}</div>}
                </div>
                <div className="mp-form-group">
                  <label className="mp-label">{t.descriptionLabel}</label>
                  <textarea
                    className="mp-textarea"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Optional product details..."
                  />
                </div>
              </>
            )}

            {/* Step 4: Summary */}
            {currentStep === 4 && (
              <div>
                <p style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 14 }}>{t.review}</p>
                <div className="mp-summary">
                  {[
                    [t.productName, formData.product_name],
                    [t.category, formData.category],
                    [t.quantity, formData.quantity_available],
                    [t.pricePerUnit, formData.price_per_unit ? `RWF ${Number(formData.price_per_unit).toLocaleString()}` : '—'],
                    [t.descriptionLabel, formData.description ? formData.description.substring(0, 40) + (formData.description.length > 40 ? '…' : '') : '—'],
                  ].map(([key, val]) => (
                    <div key={key} className="mp-summary-row">
                      <span className="mp-summary-key">{key}</span>
                      <span className="mp-summary-val">{val || '—'}</span>
                    </div>
                  ))}
                </div>
                {errors._global && <div className="mp-error" style={{ marginTop: 10 }}>⚠ {errors._global}</div>}
              </div>
            )}

            {/* Modal Buttons */}
            <div className="mp-modal-btns">
              <button className="mp-btn-secondary" onClick={() => setShowModal(false)}>{t.cancel}</button>
              {currentStep > 1 && (
                <button className="mp-btn-secondary" onClick={handleBack}>{t.back}</button>
              )}
              {currentStep < 4 ? (
                <button className="mp-btn-primary" onClick={handleNext}>{t.next}</button>
              ) : (
                <button className="mp-btn-primary" onClick={handleSave}>{t.save}</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ── */}
      {deleteTarget && (
        <div className="mp-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="mp-confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="mp-confirm-icon">🗑️</div>
            <h3 className="mp-confirm-title">{t.delete}</h3>
            <p className="mp-confirm-text">{t.confirmDelete}</p>
            <div className="mp-confirm-btns">
              <button className="mp-btn-danger" onClick={handleDelete}>{t.yes}</button>
              <button className="mp-btn-secondary" onClick={() => setDeleteTarget(null)}>{t.no}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── LOGOUT CONFIRM MODAL ── */}
      {showLogoutModal && (
        <div className="mp-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="mp-confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="mp-confirm-icon">🚪</div>
            <h3 className="mp-confirm-title">{t.logout}</h3>
            <p className="mp-confirm-text">{t.confirmLogout}</p>
            <div className="mp-confirm-btns">
              <button
                className="mp-btn-primary"
                onClick={async () => {
                  setShowLogoutModal(false);
                  try { await logout(); } catch (err) { console.error(err); }
                }}
              >
                {t.logoutConfirm}
              </button>
              <button className="mp-btn-secondary" onClick={() => setShowLogoutModal(false)}>{t.cancel}</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}