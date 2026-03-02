import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { getAdvisory, createAdvisory, updateAdvisory, deleteAdvisory } from '../services/api';

export default function ManageAdvisory() {
  const { user, logout } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('en');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [languageHovered, setLanguageHovered] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutHovered, setLogoutHovered] = useState(false);

  const [showArticleModal, setShowArticleModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tag: '',
  });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [errors, setErrors] = useState({});

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
    },
  };

  const t = translations[language] || translations.en;

  const languageOptions = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'rw', label: 'Kinyarwanda', flag: '🇷🇼' },
  ];

  useEffect(() => {
    fetchArticles();
  }, []);

  // Inject global styles (keyframes + button hover classes)
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }

      .back-btn, .action-btn, .add-btn, .edit-btn, .delete-btn, .save-btn, .cancel-btn {
        transition: all 0.2s ease;
      }
      .back-btn:hover {
        background: #eff6ff;
        border-color: #3b82f6;
      }
      .add-btn:hover {
        background: #1d4ed8;
        transform: translateY(-2px);
      }
      .edit-btn:hover {
        background: #dbeafe;
        border-color: #3b82f6;
        color: #2563eb;
      }
      .delete-btn:hover {
        background: #fee2e2;
        border-color: #ef4444;
        color: #dc2626;
      }
      .save-btn:hover {
        background: #1d4ed8;
        transform: translateY(-2px);
      }
      .cancel-btn:hover {
        background: #f1f5f9;
        border-color: #94a3b8;
        color: #0f172a;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
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
      alert(`Save failed: ${err.response?.data?.message || err.message}`);
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

  // ===== THEME & STYLES (consistent with other management pages) =====
  const theme = {
    pageBg: '#f0f7ff',
    white: '#ffffff',
    blue50: '#eff6ff',
    blue100: '#dbeafe',
    blue200: '#bfdbfe',
    blue500: '#3b82f6',
    blue600: '#2563eb',
    blue700: '#1d4ed8',
    blue800: '#1e40af',
    red500: '#ef4444',
    red600: '#dc2626',
    green500: '#10b981',
    textPrimary: '#0f172a',
    textSecondary: '#334155',
    textMuted: '#64748b',
    border: '#e2e8f0',
  };

  const styles = {
    page: {
      minHeight: '100vh',
      background: `radial-gradient(ellipse at 30% 40%, #ffffff 0%, ${theme.pageBg} 80%)`,
      fontFamily: 'Inter, system-ui, sans-serif',
      color: theme.textPrimary,
      padding: 'clamp(20px, 5vw, 40px)',
      position: 'relative',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1rem',
      marginBottom: '2rem',
      animation: 'slideUp 0.5s ease',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    backButton: {
      background: 'transparent',
      border: `1px solid ${theme.blue200}`,
      borderRadius: '40px',
      padding: '8px 20px',
      fontSize: '0.95rem',
      fontWeight: 600,
      color: theme.blue600,
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
    },
    pageTitle: {
      fontSize: 'clamp(2rem, 6vw, 2.5rem)',
      fontWeight: 800,
      color: theme.blue800,
      margin: 0,
      lineHeight: 1.2,
    },
    userPill: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      background: 'rgba(255,255,255,0.7)',
      backdropFilter: 'blur(12px)',
      padding: '0.5rem 1rem 0.5rem 1.5rem',
      borderRadius: '60px',
      border: '1px solid rgba(255,255,255,0.9)',
      boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
      flexWrap: 'wrap',
    },
    email: {
      fontSize: '0.9rem',
      fontWeight: 500,
      color: theme.textSecondary,
    },
    actionBtn: {
      background: 'rgba(255,255,255,0.8)',
      border: '1px solid rgba(203,213,225,0.6)',
      borderRadius: '40px',
      padding: '6px 16px',
      fontSize: '0.9rem',
      fontWeight: 600,
      color: theme.textSecondary,
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
    },
    avatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: `linear-gradient(135deg, ${theme.blue500}, ${theme.blue700})`,
      color: 'white',
      fontWeight: 700,
      fontSize: '1.2rem',
      display: 'grid',
      placeItems: 'center',
      boxShadow: `0 8px 20px ${theme.blue500}60`,
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem',
    },
    statCard: {
      background: 'rgba(255,255,255,0.7)',
      backdropFilter: 'blur(12px)',
      borderRadius: '28px',
      padding: '1.5rem',
      border: '1px solid rgba(255,255,255,0.9)',
      boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'default',
    },
    statValue: {
      fontSize: '2rem',
      fontWeight: 800,
      color: theme.blue800,
      margin: '0.5rem 0 0',
    },
    statLabel: {
      fontSize: '0.9rem',
      fontWeight: 600,
      color: theme.textMuted,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    section: {
      background: 'rgba(255,255,255,0.7)',
      backdropFilter: 'blur(12px)',
      borderRadius: '32px',
      padding: 'clamp(20px, 4vw, 32px)',
      border: '1px solid rgba(255,255,255,0.9)',
      boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)',
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1rem',
      marginBottom: '1.5rem',
    },
    sectionTitle: {
      fontSize: '1.5rem',
      fontWeight: 700,
      color: theme.blue800,
      margin: 0,
    },
    addButton: {
      background: theme.blue600,
      border: 'none',
      borderRadius: '40px',
      padding: '10px 24px',
      fontSize: '1rem',
      fontWeight: 600,
      color: 'white',
      cursor: 'pointer',
    },
    tableContainer: {
      overflowX: 'auto',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '0.95rem',
    },
    th: {
      textAlign: 'left',
      padding: '12px 16px',
      fontSize: '0.8rem',
      fontWeight: 700,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      color: theme.blue600,
      borderBottom: `2px solid ${theme.blue200}`,
    },
    td: {
      padding: '14px 16px',
      borderBottom: `1px solid ${theme.border}`,
      color: theme.textSecondary,
    },
    actionCell: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
    },
    editBtn: {
      background: 'transparent',
      border: `1px solid ${theme.blue200}`,
      borderRadius: '30px',
      padding: '6px 14px',
      fontSize: '0.85rem',
      fontWeight: 600,
      color: theme.blue600,
      cursor: 'pointer',
    },
    deleteBtn: {
      background: 'transparent',
      border: `1px solid #fee2e2`,
      borderRadius: '30px',
      padding: '6px 14px',
      fontSize: '0.85rem',
      fontWeight: 600,
      color: theme.red500,
      cursor: 'pointer',
    },
    emptyRow: {
      textAlign: 'center',
      padding: '40px',
      color: theme.textMuted,
    },
    dropdown: {
      position: 'absolute',
      top: 'calc(100% + 8px)',
      right: 0,
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(20px)',
      border: `1px solid ${theme.border}`,
      borderRadius: '20px',
      boxShadow: '0 20px 40px -10px rgba(0,0,0,0.2)',
      padding: '8px',
      zIndex: 10,
      minWidth: '160px',
    },
    dropdownItem: {
      padding: '10px 16px',
      borderRadius: '12px',
      fontSize: '0.9rem',
      fontWeight: 500,
      color: theme.textPrimary,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.3)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.2s ease',
    },
    modal: {
      background: 'white',
      borderRadius: '40px',
      padding: 'clamp(24px, 5vw, 40px)',
      maxWidth: '500px',
      width: '90%',
      boxShadow: '0 30px 60px -15px rgba(0,0,0,0.3)',
      border: `1px solid ${theme.border}`,
      animation: 'scaleIn 0.3s ease',
    },
    modalTitle: {
      fontSize: '1.8rem',
      fontWeight: 700,
      color: theme.blue800,
      marginBottom: '1.5rem',
    },
    formGroup: {
      marginBottom: '1.5rem',
    },
    label: {
      display: 'block',
      fontSize: '0.9rem',
      fontWeight: 600,
      color: theme.textSecondary,
      marginBottom: '0.5rem',
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      fontSize: '1rem',
      border: `1px solid ${theme.border}`,
      borderRadius: '30px',
      outline: 'none',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    },
    select: {
      width: '100%',
      padding: '12px 16px',
      fontSize: '1rem',
      border: `1px solid ${theme.border}`,
      borderRadius: '30px',
      outline: 'none',
      background: 'white',
      appearance: 'none',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23334155' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 16px center',
    },
    error: {
      color: theme.red500,
      fontSize: '0.8rem',
      marginTop: '0.25rem',
    },
    modalButtons: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'flex-end',
      marginTop: '2rem',
    },
    saveBtn: {
      background: theme.blue600,
      border: 'none',
      borderRadius: '40px',
      padding: '12px 32px',
      fontSize: '1rem',
      fontWeight: 600,
      color: 'white',
      cursor: 'pointer',
    },
    cancelBtn: {
      background: 'transparent',
      border: `1px solid ${theme.border}`,
      borderRadius: '40px',
      padding: '12px 32px',
      fontSize: '1rem',
      fontWeight: 600,
      color: theme.textSecondary,
      cursor: 'pointer',
    },
    deleteConfirmModal: {
      background: 'white',
      borderRadius: '40px',
      padding: 'clamp(24px, 5vw, 40px)',
      maxWidth: '400px',
      width: '90%',
      boxShadow: '0 30px 60px -15px rgba(0,0,0,0.3)',
      textAlign: 'center',
    },
    deleteConfirmTitle: {
      fontSize: '1.5rem',
      fontWeight: 700,
      color: theme.red600,
      marginBottom: '1rem',
    },
    deleteConfirmText: {
      fontSize: '1.1rem',
      color: theme.textSecondary,
      marginBottom: '2rem',
    },
    deleteConfirmButtons: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
    },
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={{ textAlign: 'center', paddingTop: '20vh' }}>{t.loading}</div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          {/* Back button now points to "/" (admin dashboard) and uses CSS class for hover */}
          <Link to="/" className="back-btn" style={styles.backButton}>
            ← {t.backToDashboard}
          </Link>
          <h1 style={styles.pageTitle}>{t.manageAdvisory}</h1>
        </div>
        <div style={styles.userPill}>
          <span style={styles.email}>{user?.email || t.welcome}</span>

          {/* Language dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              style={{
                ...styles.actionBtn,
                ...(languageHovered
                  ? { background: '#ffffff', borderColor: theme.blue600, color: theme.blue600, boxShadow: `0 5px 15px ${theme.blue600}30` }
                  : {}),
              }}
              onMouseEnter={() => setLanguageHovered(true)}
              onMouseLeave={() => setLanguageHovered(false)}
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            >
              <span>🌐</span> {language.toUpperCase()}
            </button>
            {showLanguageDropdown && (
              <div style={styles.dropdown}>
                {languageOptions.map((opt) => (
                  <div
                    key={opt.code}
                    style={{
                      ...styles.dropdownItem,
                      background: opt.code === language ? theme.blue50 : 'transparent',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = theme.blue50)}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        opt.code === language ? theme.blue50 : 'transparent')
                    }
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
          <button
            style={{
              ...styles.actionBtn,
              ...(logoutHovered
                ? { background: '#ffffff', borderColor: theme.red500, color: theme.red500, boxShadow: `0 5px 15px ${theme.red500}30` }
                : {}),
            }}
            onMouseEnter={() => setLogoutHovered(true)}
            onMouseLeave={() => setLogoutHovered(false)}
            onClick={() => setShowLogoutModal(true)}
          >
            <span>🚪</span> {t.logout}
          </button>

          <div style={styles.avatar}>
            {user?.full_name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
        </div>
      </header>

      {/* Stats Card */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>{t.totalArticles}</p>
          <p style={styles.statValue}>{articles.length}</p>
        </div>
      </div>

      {/* Articles Table Section */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>{t.manageAdvisory}</h2>
          <button className="add-btn" style={styles.addButton} onClick={handleOpenAddModal}>
            + {t.addArticle}
          </button>
        </div>

        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>{t.title}</th>
                <th style={styles.th}>{t.content}</th>
                <th style={styles.th}>{t.tag}</th>
                <th style={styles.th}>{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {articles.length === 0 ? (
                <tr>
                  <td colSpan="4" style={styles.emptyRow}>
                    {t.noArticles}
                  </td>
                </tr>
              ) : (
                articles.map((a) => (
                  <tr key={a.article_id || a.id}>
                    <td style={styles.td}>{a.title}</td>
                    <td style={styles.td}>
                      {a.content.length > 50 ? a.content.substring(0, 50) + '...' : a.content}
                    </td>
                    <td style={styles.td}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: '30px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          backgroundColor:
                            a.tag === 'Farming'
                              ? '#dcfce7'
                              : a.tag === 'Environment'
                              ? '#dbeafe'
                              : a.tag === 'Market'
                              ? '#fef3c7'
                              : theme.blue50,
                          color:
                            a.tag === 'Farming'
                              ? '#166534'
                              : a.tag === 'Environment'
                              ? '#1e40af'
                              : a.tag === 'Market'
                              ? '#92400e'
                              : theme.blue600,
                        }}
                      >
                        {a.tag}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actionCell}>
                        <button
                          className="edit-btn"
                          style={styles.editBtn}
                          onClick={() => handleOpenEditModal(a)}
                        >
                          {t.edit}
                        </button>
                        <button
                          className="delete-btn"
                          style={styles.deleteBtn}
                          onClick={() => setDeleteConfirm(a)}
                        >
                          {t.delete}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add/Edit Article Modal */}
      {showArticleModal && (
        <div style={styles.modalOverlay} onClick={() => setShowArticleModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>
              {editingArticle ? t.edit : t.addArticle}
            </h2>

            {/* Title */}
            <div style={styles.formGroup}>
              <label style={styles.label}>{t.title}</label>
              <input
                style={styles.input}
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Optimal Harvesting Periods"
              />
              {errors.title && <p style={styles.error}>{errors.title}</p>}
            </div>

            {/* Content */}
            <div style={styles.formGroup}>
              <label style={styles.label}>{t.content}</label>
              <textarea
                style={{ ...styles.input, minHeight: '120px', borderRadius: '20px' }}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write the article content here..."
              />
              {errors.content && <p style={styles.error}>{errors.content}</p>}
            </div>

            {/* Tag */}
            <div style={styles.formGroup}>
              <label style={styles.label}>{t.tag}</label>
              <select
                style={styles.select}
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
              >
                <option value="">Select a tag</option>
                <option value="Farming">Farming</option>
                <option value="Environment">Environment</option>
                <option value="Market">Market</option>
                <option value="Agronomy">Agronomy</option>
              </select>
              {errors.tag && <p style={styles.error}>{errors.tag}</p>}
            </div>

            {/* Modal Buttons */}
            <div style={styles.modalButtons}>
              <button className="cancel-btn" style={styles.cancelBtn} onClick={() => setShowArticleModal(false)}>
                {t.cancel}
              </button>
              <button className="save-btn" style={styles.saveBtn} onClick={handleSaveArticle}>
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div style={styles.modalOverlay} onClick={() => setDeleteConfirm(null)}>
          <div style={styles.deleteConfirmModal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.deleteConfirmTitle}>{t.delete}</h3>
            <p style={styles.deleteConfirmText}>{t.confirmDelete}</p>
            <div style={styles.deleteConfirmButtons}>
              <button
                style={{ ...styles.saveBtn, background: theme.red500 }}
                onClick={() => handleDelete(deleteConfirm.article_id || deleteConfirm.id)}
              >
                {t.yes}
              </button>
              <button className="cancel-btn" style={styles.cancelBtn} onClick={() => setDeleteConfirm(null)}>
                {t.no}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div style={styles.modalOverlay} onClick={() => setShowLogoutModal(false)}>
          <div style={styles.deleteConfirmModal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.deleteConfirmTitle}>{t.logout}</h3>
            <p style={styles.deleteConfirmText}>{t.confirmLogout}</p>
            <div style={styles.deleteConfirmButtons}>
              <button
                style={{ ...styles.saveBtn, background: theme.blue600 }}
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
              <button className="cancel-btn" style={styles.cancelBtn} onClick={() => setShowLogoutModal(false)}>
                {t.no}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}