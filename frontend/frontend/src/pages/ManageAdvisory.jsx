import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { getAdvisory, createAdvisory, updateAdvisory, deleteAdvisory } from '../services/api';

/* ─── INJECT DARK THEME STYLES (matches ManageProducts) ───────────────── */
const injectStyles = () => {
  if (document.getElementById('ma-css-dark')) return;
  const s = document.createElement('style');
  s.id = 'ma-css-dark';
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
      --primary:   #ffffff;
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
    .ma-root {
      font-family: 'Plus Jakarta Sans', sans-serif;
      color: var(--ink);
      min-height: 100vh;
      background: var(--bg);
      padding: clamp(20px, 4vw, 36px);
    }

    /* ── TOPBAR ── */
    .ma-topbar {
      display: flex; align-items: center; justify-content: space-between;
      flex-wrap: wrap; gap: 16px;
      margin-bottom: 28px;
      animation: ma-up .4s ease forwards;
    }
    .ma-topbar-left { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
    .ma-back-btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 8px 18px; border-radius: 100px;
      border: 1.5px solid var(--border-2);
      background: var(--bg-2); color: var(--ink-2);
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 13px; font-weight: 600;
      text-decoration: none; transition: all .18s;
    }
    .ma-back-btn:hover { background: var(--bg-3); border-color: var(--ink-2); color: var(--ink); }
    .ma-page-title {
      font-family: 'Syne', sans-serif;
      font-size: clamp(20px, 4vw, 28px);
      font-weight: 800; color: var(--ink);
    }

    /* ── USER PILL ── */
    .ma-user-pill {
      display: flex; align-items: center; gap: 10px;
      background: var(--bg-2); border: 1px solid var(--border);
      border-radius: 100px; padding: 5px 5px 5px 16px;
      box-shadow: var(--shadow-sm); flex-wrap: wrap;
    }
    .ma-email { font-size: 13px; font-weight: 500; color: var(--ink-2); max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .ma-lang-wrap { position: relative; }
    .ma-lang-btn, .ma-logout-btn {
      height: 34px; padding: 0 14px; border-radius: 100px;
      border: 1.5px solid var(--border); background: var(--bg-3);
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 12px; font-weight: 700; cursor: pointer;
      display: flex; align-items: center; gap: 5px;
      transition: all .18s; color: var(--ink-2);
    }
    .ma-lang-btn:hover { border-color: var(--ink); color: var(--ink); background: var(--bg-2); }
    .ma-logout-btn:hover { border-color: var(--red); color: var(--red-2); background: var(--red-lt); }
    .ma-lang-dropdown {
      position: absolute; top: calc(100% + 8px); right: 0;
      width: 150px; background: var(--bg-2);
      border: 1.5px solid var(--border); border-radius: var(--radius-lg);
      padding: 6px; box-shadow: var(--shadow-lg); z-index: 100;
    }
    .ma-lang-opt {
      display: flex; align-items: center; gap: 8px;
      padding: 9px 12px; border-radius: 10px;
      font-size: 13px; font-weight: 500; cursor: pointer;
      transition: all .13s; color: var(--ink-2);
    }
    .ma-lang-opt:hover, .ma-lang-opt.sel { background: var(--bg-3); color: var(--ink); }
    .ma-avatar {
      width: 34px; height: 34px; border-radius: 100%;
      background: var(--ink); color: var(--bg);
      font-weight: 800; font-size: 14px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }

    /* ── STATS ── */
    .ma-stats {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px; margin-bottom: 24px;
      animation: ma-up .4s ease .05s forwards; opacity: 0;
    }
    .ma-stat {
      background: var(--bg-2); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 20px 22px;
      box-shadow: var(--shadow-sm); position: relative; overflow: hidden;
      transition: all .22s;
    }
    .ma-stat:hover { transform: translateY(-3px); box-shadow: var(--shadow); }
    .ma-stat::after {
      content: ''; position: absolute;
      top: 0; left: 0; right: 0; height: 3px;
      border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    }
    .ma-stat.blue::after { background: var(--ink); }
    .ma-stat.amber::after { background: var(--amber); }
    .ma-stat.green::after { background: var(--green); }
    .ma-stat-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: var(--ink-3); margin-bottom: 6px; }
    .ma-stat-value { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; color: var(--ink); }
    .ma-stat-icon { font-size: 22px; margin-bottom: 10px; }

    /* ── CARD ── */
    .ma-card {
      background: var(--bg-2); border: 1px solid var(--border);
      border-radius: var(--radius-xl); padding: clamp(18px, 3vw, 28px);
      box-shadow: var(--shadow-sm);
      animation: ma-up .4s ease .1s forwards; opacity: 0;
    }
    .ma-card-header {
      display: flex; align-items: center; justify-content: space-between;
      flex-wrap: wrap; gap: 12px;
      padding-bottom: 18px; border-bottom: 1px solid var(--border);
      margin-bottom: 20px;
    }
    .ma-card-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: var(--ink); }
    .ma-add-btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 10px 20px; border-radius: 100px;
      background: var(--ink); border: none; color: var(--bg);
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 13px; font-weight: 700; cursor: pointer;
      transition: all .18s; box-shadow: 0 4px 14px var(--primary-glow);
    }
    .ma-add-btn:hover { background: var(--primary-dim); transform: translateY(-1px); box-shadow: 0 6px 20px var(--primary-glow); }

    /* ── TABLE ── */
    .ma-table-wrap { overflow-x: auto; }
    .ma-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
    .ma-table thead tr { border-bottom: 2px solid var(--border); }
    .ma-table thead th {
      text-align: left; padding: 0 14px 12px;
      font-size: 11px; font-weight: 700; text-transform: uppercase;
      letter-spacing: .08em; color: var(--ink-3); white-space: nowrap;
    }
    .ma-table tbody tr { border-bottom: 1px solid var(--bg-3); transition: background .14s; }
    .ma-table tbody tr:last-child { border-bottom: none; }
    .ma-table tbody tr:hover { background: var(--bg-3); }
    .ma-table td { padding: 13px 14px; color: var(--ink-2); vertical-align: middle; }
    .ma-table td.bold { font-weight: 700; color: var(--ink); }
    .ma-tag-badge {
      display: inline-flex; align-items: center;
      padding: 3px 10px; border-radius: 100px;
      font-size: 12px; font-weight: 700; border: 1.5px solid;
    }
    .ma-tag-badge.farming { background: var(--green-lt); color: var(--green); border-color: #2a5a3a; }
    .ma-tag-badge.environment { background: var(--primary-lt); color: var(--ink-2); border-color: var(--border-2); }
    .ma-tag-badge.market { background: var(--amber-lt); color: var(--amber); border-color: #5a4a2a; }
    .ma-tag-badge.default { background: var(--bg-3); color: var(--ink-2); border-color: var(--border); }
    .ma-btn-edit, .ma-btn-delete {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 6px 13px; border-radius: 100px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 12px; font-weight: 700; cursor: pointer; border: 1.5px solid;
      transition: all .15s;
    }
    .ma-btn-edit { color: var(--ink); border-color: var(--border-2); background: var(--bg-3); }
    .ma-btn-edit:hover { background: var(--ink); color: var(--bg); border-color: var(--ink); }
    .ma-btn-delete { color: var(--red-2); border-color: #5a2a2a; background: var(--red-lt); }
    .ma-btn-delete:hover { background: var(--red); color: #fff; border-color: var(--red); }
    .ma-empty { text-align: center; padding: 48px 0; color: var(--ink-3); font-size: 14px; }

    /* ── MODAL ── */
    .ma-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.8); backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
      z-index: 999; animation: ma-fade .2s ease;
    }
    .ma-modal {
      background: var(--bg-2); border: 1px solid var(--border);
      border-radius: var(--radius-xl); padding: clamp(24px, 4vw, 36px);
      width: 90%; max-width: 500px;
      box-shadow: var(--shadow-lg);
      animation: ma-scale .25s cubic-bezier(.34,1.56,.64,1);
    }
    .ma-modal-title {
      font-family: 'Syne', sans-serif;
      font-size: 20px; font-weight: 800; color: var(--ink);
      margin-bottom: 20px;
    }

    /* ── FORM ── */
    .ma-form-group { margin-bottom: 18px; }
    .ma-label {
      display: block; font-size: 12px; font-weight: 700; color: var(--ink-2);
      margin-bottom: 7px; text-transform: uppercase; letter-spacing: .07em;
    }
    .ma-input, .ma-textarea, .ma-select {
      width: 100%; padding: 11px 16px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 14px; color: var(--ink);
      border: 1.5px solid var(--border);
      border-radius: var(--radius);
      background: var(--bg-3);
      outline: none; transition: all .18s;
    }
    .ma-input:focus, .ma-textarea:focus, .ma-select:focus {
      border-color: var(--ink); background: var(--bg-2);
      box-shadow: 0 0 0 3px rgba(255,255,255,0.1);
    }
    .ma-textarea { min-height: 90px; resize: vertical; border-radius: var(--radius); }
    .ma-select {
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23888888' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 16px center;
    }
    .ma-error { font-size: 11px; color: var(--red-2); font-weight: 600; margin-top: 5px; display: flex; align-items: center; gap: 4px; }

    /* ── MODAL BUTTONS ── */
    .ma-modal-btns {
      display: flex; gap: 10px; justify-content: flex-end;
      margin-top: 24px; flex-wrap: wrap;
    }
    .ma-btn-primary, .ma-btn-secondary, .ma-btn-danger {
      padding: 10px 24px; border-radius: 100px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 13px; font-weight: 700; cursor: pointer;
      transition: all .18s; border: 1.5px solid;
    }
    .ma-btn-primary {
      background: var(--ink); color: var(--bg);
      border-color: var(--ink); box-shadow: 0 4px 12px var(--primary-glow);
    }
    .ma-btn-primary:hover {
      background: var(--primary-dim); transform: translateY(-1px);
      box-shadow: 0 6px 18px var(--primary-glow);
    }
    .ma-btn-secondary {
      background: var(--bg-3); color: var(--ink-2);
      border-color: var(--border);
    }
    .ma-btn-secondary:hover { border-color: var(--border-2); color: var(--ink); }
    .ma-btn-danger {
      background: var(--red-lt); color: var(--red-2);
      border-color: #5a2a2a;
    }
    .ma-btn-danger:hover { background: var(--red); color: #fff; border-color: var(--red); }

    /* ── CONFIRM MODAL ── */
    .ma-confirm-modal {
      background: var(--bg-2); border: 1px solid var(--border);
      border-radius: var(--radius-xl); padding: clamp(28px, 4vw, 40px);
      width: 90%; max-width: 380px; text-align: center;
      box-shadow: var(--shadow-lg);
      animation: ma-scale .25s cubic-bezier(.34,1.56,.64,1);
    }
    .ma-confirm-icon { font-size: 40px; margin-bottom: 12px; }
    .ma-confirm-title {
      font-family: 'Syne', sans-serif; font-size: 20px;
      font-weight: 800; color: var(--ink); margin-bottom: 8px;
    }
    .ma-confirm-text { font-size: 14px; color: var(--ink-3); margin-bottom: 24px; line-height: 1.5; }
    .ma-confirm-btns { display: flex; gap: 10px; justify-content: center; }

    /* ── LOADER ── */
    .ma-loader {
      min-height: 100vh; display: flex; flex-direction: column;
      align-items: center; justify-content: center; background: var(--bg); gap: 16px;
    }
    .ma-spinner {
      width: 44px; height: 44px; border: 3px solid var(--border);
      border-top-color: var(--ink); border-radius: 100%;
      animation: ma-spin .8s linear infinite;
    }
    .ma-loader-text {
      font-family: 'Syne', sans-serif; font-size: 13px;
      color: var(--ink-3); font-weight: 700; letter-spacing: .06em;
    }

    /* ── KEYFRAMES ── */
    @keyframes ma-spin { to { transform: rotate(360deg); } }
    @keyframes ma-fade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ma-scale { from { opacity:0; transform:scale(.93); } to { opacity:1; transform:scale(1); } }
    @keyframes ma-up { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
  `;
  document.head.appendChild(s);
};

/* ─── TRANSLATIONS (unchanged) ────────────────────────────────────── */
const translations = {
  en: {
    manageAdvisory: 'Manage Advisory',
    totalArticles: 'Total Articles',
    addArticle: 'Add Article',
    edit: 'Edit',
    delete: 'Delete',
    title: 'Title',
    content: 'Content',
    tag: 'Tag',
    actions: 'Actions',
    save: 'Save',
    cancel: 'Cancel',
    confirmDelete: 'Are you sure you want to delete this article?',
    yes: 'Yes',
    no: 'No',
    logout: 'Logout',
    confirmLogout: 'Are you sure you want to logout?',
    welcome: 'Welcome',
    loading: 'Loading...',
    backToDashboard: '← Back to Dashboard',
    titleRequired: 'Title is required',
    contentRequired: 'Content is required',
    tagRequired: 'Tag is required',
    noArticles: 'No articles found',
    errorSaving: 'Save failed:',
  },
  fr: {
    manageAdvisory: 'Gérer les conseils',
    totalArticles: 'Total articles',
    addArticle: 'Ajouter article',
    edit: 'Modifier',
    delete: 'Supprimer',
    title: 'Titre',
    content: 'Contenu',
    tag: 'Étiquette',
    actions: 'Actions',
    save: 'Enregistrer',
    cancel: 'Annuler',
    confirmDelete: 'Êtes-vous sûr de vouloir supprimer cet article ?',
    yes: 'Oui',
    no: 'Non',
    logout: 'Déconnexion',
    confirmLogout: 'Êtes-vous sûr de vouloir vous déconnecter ?',
    welcome: 'Bienvenue',
    loading: 'Chargement...',
    backToDashboard: '← Retour au tableau de bord',
    titleRequired: 'Le titre est requis',
    contentRequired: 'Le contenu est requis',
    tagRequired: "L'étiquette est requise",
    noArticles: 'Aucun article trouvé',
    errorSaving: 'Échec de la sauvegarde :',
  },
  rw: {
    manageAdvisory: 'Gerer inama',
    totalArticles: 'Ingingo zose',
    addArticle: 'Ongeraho ingingo',
    edit: 'Hindura',
    delete: 'Siba',
    title: 'Umutwe',
    content: 'Ibirimo',
    tag: 'Ikibazo',
    actions: 'Ibikorwa',
    save: 'Bika',
    cancel: 'Reka',
    confirmDelete: 'Wiringiye ko ushaka gusiba iyi ngingo?',
    yes: 'Yego',
    no: 'Oya',
    logout: 'Sohoka',
    confirmLogout: 'Wiringiye ko ushaka gusohoka?',
    welcome: 'Murakaza neza',
    loading: 'Biratwara...',
    backToDashboard: '← Subira kuri dashubode',
    titleRequired: 'Umutwe urakenewe',
    contentRequired: 'Ibirimo birakenewe',
    tagRequired: 'Ikibazo gikenewe',
    noArticles: 'Nta ngingo zabonetse',
    errorSaving: 'Kubika byananiranye:',
  },
};

const languageOptions = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'rw', label: 'Kinyarwanda', flag: '🇷🇼' },
];

export default function ManageAdvisory() {
  const { user, logout } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('en');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [showArticleModal, setShowArticleModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', tag: '' });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [errors, setErrors] = useState({});

  const t = translations[language] || translations.en;

  // Inject dark styles once
  useEffect(() => {
    injectStyles();
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await getAdvisory();
      setArticles(res.data || []);
    } catch (err) {
      console.error('Failed to fetch advisory articles', err);
      alert('Failed to load advisory articles. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingArticle(null);
    setFormData({ title: '', content: '', tag: '' });
    setErrors({});
    setShowArticleModal(true);
  };

  const handleOpenEditModal = (a) => {
    setEditingArticle(a);
    setFormData({
      title: a.title,
      content: a.content,
      tag: a.tag,
    });
    setErrors({});
    setShowArticleModal(true);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = t.titleRequired;
    if (!formData.content.trim()) newErrors.content = t.contentRequired;
    if (!formData.tag.trim()) newErrors.tag = t.tagRequired;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveArticle = async () => {
    if (!validateForm()) return;
    try {
      const payload = {
        title: formData.title,
        content: formData.content,
        tag: formData.tag,
      };
      if (!editingArticle) {
        await createAdvisory(payload);
      } else {
        await updateAdvisory(editingArticle.article_id || editingArticle.id, payload);
      }
      setShowArticleModal(false);
      fetchArticles();
    } catch (err) {
      console.error('Save failed', err);
      let errorMsg = t.errorSaving;
      if (err.response?.data?.message) errorMsg += ` ${err.response.data.message}`;
      else if (err.message) errorMsg += ` ${err.message}`;
      alert(errorMsg);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAdvisory(id);
      setDeleteConfirm(null);
      fetchArticles();
    } catch (err) {
      console.error('Delete failed', err);
      alert(`Delete failed: ${err.response?.data?.message || err.message}`);
    }
  };

  const getTagClass = (tag) => {
    const t = tag?.toLowerCase() || '';
    if (t === 'farming') return 'farming';
    if (t === 'environment') return 'environment';
    if (t === 'market') return 'market';
    return 'default';
  };

  if (loading) {
    return (
      <div className="ma-loader">
        <div className="ma-spinner" />
        <div className="ma-loader-text">LOADING ADVISORY...</div>
      </div>
    );
  }

  return (
    <div className="ma-root">
      {/* Header */}
      <header className="ma-topbar">
        <div className="ma-topbar-left">
          <Link to="/" className="ma-back-btn">
            ← {t.backToDashboard}
          </Link>
          <h1 className="ma-page-title">{t.manageAdvisory}</h1>
        </div>

        <div className="ma-user-pill">
          <span className="ma-email">{user?.email || t.welcome}</span>

          {/* Language dropdown */}
          <div className="ma-lang-wrap">
            <button
              className="ma-lang-btn"
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            >
              <span>🌐</span> {language.toUpperCase()}
            </button>
            {showLanguageDropdown && (
              <div className="ma-lang-dropdown">
                {languageOptions.map((opt) => (
                  <div
                    key={opt.code}
                    className={`ma-lang-opt ${opt.code === language ? 'sel' : ''}`}
                    onClick={() => {
                      setLanguage(opt.code);
                      setShowLanguageDropdown(false);
                    }}
                  >
                    <span>{opt.flag}</span> {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Logout button */}
          <button className="ma-logout-btn" onClick={() => setShowLogoutModal(true)}>
            🚪 {t.logout}
          </button>

          <div className="ma-avatar">
            {user?.full_name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
        </div>
      </header>

      {/* Stats Card */}
      <div className="ma-stats">
        <div className="ma-stat blue">
          <div className="ma-stat-icon">📄</div>
          <div className="ma-stat-label">{t.totalArticles}</div>
          <div className="ma-stat-value">{articles.length}</div>
        </div>
      </div>

      {/* Articles Table Section */}
      <div className="ma-card">
        <div className="ma-card-header">
          <h2 className="ma-card-title">📚 {t.manageAdvisory}</h2>
          <button className="ma-add-btn" onClick={handleOpenAddModal}>
            + {t.addArticle}
          </button>
        </div>

        <div className="ma-table-wrap">
          <table className="ma-table">
            <thead>
              <tr>
                <th>{t.title}</th>
                <th>{t.content}</th>
                <th>{t.tag}</th>
                <th>{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {articles.length === 0 ? (
                <tr>
                  <td colSpan="4" className="ma-empty">{t.noArticles}</td>
                </tr>
              ) : (
                articles.map((a) => (
                  <tr key={a.article_id || a.id}>
                    <td className="bold">{a.title}</td>
                    <td>
                      {a.content.length > 50 ? a.content.substring(0, 50) + '…' : a.content}
                    </td>
                    <td>
                      <span className={`ma-tag-badge ${getTagClass(a.tag)}`}>
                        {a.tag}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <button
                          className="ma-btn-edit"
                          onClick={() => handleOpenEditModal(a)}
                        >
                          ✏️ {t.edit}
                        </button>
                        <button
                          className="ma-btn-delete"
                          onClick={() => setDeleteConfirm(a)}
                        >
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

      {/* Add/Edit Article Modal */}
      {showArticleModal && (
        <div className="ma-overlay" onClick={() => setShowArticleModal(false)}>
          <div className="ma-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="ma-modal-title">
              {editingArticle ? `✏️ ${t.edit}` : `➕ ${t.addArticle}`}
            </h2>

            <div className="ma-form-group">
              <label className="ma-label">{t.title}</label>
              <input
                className="ma-input"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Optimal Harvesting Periods"
              />
              {errors.title && <div className="ma-error">⚠ {errors.title}</div>}
            </div>

            <div className="ma-form-group">
              <label className="ma-label">{t.content}</label>
              <textarea
                className="ma-textarea"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write the article content here..."
              />
              {errors.content && <div className="ma-error">⚠ {errors.content}</div>}
            </div>

            <div className="ma-form-group">
              <label className="ma-label">{t.tag}</label>
              <select
                className="ma-select"
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
              >
                <option value="">Select a tag</option>
                <option value="Farming">Farming</option>
                <option value="Environment">Environment</option>
                <option value="Market">Market</option>
                <option value="Agronomy">Agronomy</option>
              </select>
              {errors.tag && <div className="ma-error">⚠ {errors.tag}</div>}
            </div>

            <div className="ma-modal-btns">
              <button className="ma-btn-secondary" onClick={() => setShowArticleModal(false)}>
                {t.cancel}
              </button>
              <button className="ma-btn-primary" onClick={handleSaveArticle}>
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="ma-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="ma-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ma-confirm-icon">🗑️</div>
            <h3 className="ma-confirm-title">{t.delete}</h3>
            <p className="ma-confirm-text">{t.confirmDelete}</p>
            <div className="ma-confirm-btns">
              <button
                className="ma-btn-danger"
                onClick={() => handleDelete(deleteConfirm.article_id || deleteConfirm.id)}
              >
                {t.yes}
              </button>
              <button className="ma-btn-secondary" onClick={() => setDeleteConfirm(null)}>
                {t.no}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="ma-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="ma-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ma-confirm-icon">🚪</div>
            <h3 className="ma-confirm-title">{t.logout}</h3>
            <p className="ma-confirm-text">{t.confirmLogout}</p>
            <div className="ma-confirm-btns">
              <button
                className="ma-btn-primary"
                onClick={async () => {
                  setShowLogoutModal(false);
                  try {
                    await logout();
                  } catch (err) {
                    console.error(err);
                  }
                }}
              >
                {t.yes}
              </button>
              <button className="ma-btn-secondary" onClick={() => setShowLogoutModal(false)}>
                {t.no}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}