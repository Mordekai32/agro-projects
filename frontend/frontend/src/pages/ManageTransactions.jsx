import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { getTransactions, updateTransaction, deleteTransaction, createTransaction } from '../services/api';

export default function ManageTransactions() {
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('en');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [languageHovered, setLanguageHovered] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutHovered, setLogoutHovered] = useState(false);

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

  const t = translations[language] || translations.en;

  const languageOptions = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'rw', label: 'Kinyarwanda', flag: '🇷🇼' },
  ];

  useEffect(() => {
    fetchTransactions();
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
      date: tx.date.split('T')[0], // assuming ISO date
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
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          {/* Back to dashboard – fixed path to "/" */}
          <Link to="/" className="back-btn" style={styles.backButton}>
            ← {t.backToDashboard}
          </Link>
          <h1 style={styles.pageTitle}>{t.manageTransactions}</h1>
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

      {/* Stats */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>{t.totalTransactions}</p>
          <p style={styles.statValue}>{totalTransactions}</p>
        </div>
      </div>

      {/* Transactions Table */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>{t.manageTransactions}</h2>
          <button className="add-btn" style={styles.addButton} onClick={handleOpenAddModal}>
            + {t.addTransaction}
          </button>
        </div>

        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>{t.buyer}</th>
                <th style={styles.th}>{t.product}</th>
                <th style={styles.th}>{t.quantity}</th>
                <th style={styles.th}>{t.totalPrice}</th>
                <th style={styles.th}>{t.status}</th>
                <th style={styles.th}>{t.date}</th>
                <th style={styles.th}>{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="7" style={styles.emptyRow}>
                    {t.noTransactions}
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.transaction_id || tx.id}>
                    <td style={styles.td}>{tx.buyer_id}</td>
                    <td style={styles.td}>{tx.product_id}</td>
                    <td style={styles.td}>{tx.quantity}</td>
                    <td style={styles.td}>RWF {tx.total_price?.toLocaleString()}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: '30px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          backgroundColor:
                            tx.status === 'delivered'
                              ? '#dcfce7'
                              : tx.status === 'pending'
                              ? '#fff3cd'
                              : tx.status === 'cancelled'
                              ? '#f8d7da'
                              : theme.blue50,
                          color:
                            tx.status === 'delivered'
                              ? '#166534'
                              : tx.status === 'pending'
                              ? '#856404'
                              : tx.status === 'cancelled'
                              ? '#721c24'
                              : theme.blue600,
                        }}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td style={styles.td}>{new Date(tx.date).toLocaleDateString()}</td>
                    <td style={styles.td}>
                      <div style={styles.actionCell}>
                        <button
                          className="edit-btn"
                          style={styles.editBtn}
                          onClick={() => handleOpenEditModal(tx)}
                        >
                          {t.edit}
                        </button>
                        <button
                          className="delete-btn"
                          style={styles.deleteBtn}
                          onClick={() => setDeleteConfirm(tx)}
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

      {/* Add/Edit Modal */}
      {showTransactionModal && (
        <div style={styles.modalOverlay} onClick={() => setShowTransactionModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>
              {editingTransaction ? t.edit : t.addTransaction}
            </h2>

            <div style={styles.formGroup}>
              <label style={styles.label}>{t.buyer}</label>
              <input
                style={styles.input}
                type="number"
                value={formData.buyer_id}
                onChange={(e) => setFormData({ ...formData, buyer_id: e.target.value })}
              />
              {errors.buyer_id && <p style={styles.error}>{errors.buyer_id}</p>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>{t.product}</label>
              <input
                style={styles.input}
                type="number"
                value={formData.product_id}
                onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
              />
              {errors.product_id && <p style={styles.error}>{errors.product_id}</p>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>{t.quantity}</label>
              <input
                style={styles.input}
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
              {errors.quantity && <p style={styles.error}>{errors.quantity}</p>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>{t.totalPrice}</label>
              <input
                style={styles.input}
                type="number"
                value={formData.total_price}
                onChange={(e) => setFormData({ ...formData, total_price: e.target.value })}
              />
              {errors.total_price && <p style={styles.error}>{errors.total_price}</p>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>{t.status}</label>
              <select
                style={styles.select}
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="pending">Pending</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              {errors.status && <p style={styles.error}>{errors.status}</p>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>{t.date}</label>
              <input
                style={styles.input}
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
              {errors.date && <p style={styles.error}>{errors.date}</p>}
            </div>

            <div style={styles.modalButtons}>
              <button className="cancel-btn" style={styles.cancelBtn} onClick={() => setShowTransactionModal(false)}>
                {t.cancel}
              </button>
              <button className="save-btn" style={styles.saveBtn} onClick={handleSaveTransaction}>
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
                onClick={() => handleDelete(deleteConfirm.transaction_id || deleteConfirm.id)}
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