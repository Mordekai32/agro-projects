import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUsers, createUser, updateUser, deleteUser } from '../services/api';

/* ── Constants ─────────────────────────────────────────────────────────── */
const LANGS = [
  { code: 'en', flag: '🇬🇧', label: 'English'     },
  { code: 'fr', flag: '🇫🇷', label: 'Français'    },
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

const TYPE_CFG = {
  admin:  { bg: '#DBEAFE', color: '#1D4ED8' },
  farmer: { bg: '#D1FAE5', color: '#065F46' },
  buyer:  { bg: '#EDE9FE', color: '#5B21B6' },
};

const EMPTY_FORM = {
  full_name: '', email: '', phone_number: '', user_type: 'buyer', location: '', password: '',
};

/* ── Field wrapper ─────────────────────────────────────────────────────── */
function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: 'block', fontSize: '.72rem', fontWeight: 800,
        textTransform: 'uppercase', letterSpacing: '.08em',
        color: '#6B7280', marginBottom: 6,
      }}>{label}</label>
      {children}
      {error && (
        <p style={{ fontSize: '.7rem', color: '#EF4444', marginTop: 4, fontWeight: 600 }}>{error}</p>
      )}
    </div>
  );
}

/* ── Main component ────────────────────────────────────────────────────── */
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

  /* ── Data fetching ── */
  useEffect(() => {
    (async () => {
      try {
        const res = await getUsers();
        setUsers(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ── Derived stats ── */
  const total   = users.length;
  const farmers = users.filter(u => u.user_type === 'farmer').length;
  const buyers  = users.filter(u => u.user_type === 'buyer').length;

  /* ── Filtered list ── */
  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = !q
      || u.full_name?.toLowerCase()?.includes(q)
      || u.email?.toLowerCase()?.includes(q)
      || (u.location || '').toLowerCase().includes(q);
    const matchType = filterType === 'all' || u.user_type === filterType;
    return matchSearch && matchType;
  });

  /* ── Modal helpers ── */
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

  /* ── Validation ── */
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

  /* ── Save ── */
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

  /* ── Delete ── */
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

  /* ── Shared input style ── */
  const inputStyle = (hasError) => ({
    width: '100%', padding: '10px 14px', fontSize: '.85rem', fontWeight: 500,
    border: `1.5px solid ${hasError ? '#EF4444' : '#E5E7EB'}`,
    borderRadius: 10, outline: 'none', fontFamily: 'Nunito, sans-serif',
    background: '#F9FAFB', color: '#1F2937',
    transition: 'border-color .15s, box-shadow .15s',
    boxSizing: 'border-box',
  });

  /* ── Loading screen ── */
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#F9FAFB',
        fontFamily: 'Nunito, sans-serif',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            border: '3px solid #DBEAFE', borderTopColor: '#3B82F6',
            animation: 'spin .8s linear infinite', margin: '0 auto 16px',
          }} />
          <p style={{ color: '#6B7280', fontWeight: 700, fontSize: '.88rem' }}>Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ── Global styles (unchanged) ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --pri: #3B82F6; --pri-l: #93C5FD; --pri-xl: #DBEAFE; --pri-d: #1D4ED8;
          --dg: #1F2937;  --sg: #E5E7EB;    --bg: #F9FAFB;      --white: #ffffff;
          --acc: #10B981; --t1: #1F2937;    --t2: #374151;       --t3: #6B7280;
          --bd: #E5E7EB;  --bd2: #F3F4F6;
        }
        html, body { background: var(--bg); font-family: 'Nunito', sans-serif; color: var(--t1); }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-thumb { background: var(--pri-l); border-radius: 99px; }
        @keyframes fi  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes su  { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes row { from { opacity: 0; transform: translateX(8px)  } to { opacity: 1; transform: translateX(0) } }
        @keyframes spin { to { transform: rotate(360deg) } }

        .pg { min-height: 100vh; background: var(--bg); padding: 28px 32px 48px; }

        /* topbar */
        .topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; gap: 16px; flex-wrap: wrap; animation: su .4s ease; }
        .topbar-l { display: flex; align-items: center; gap: 14px; }
        .topbar-r { display: flex; align-items: center; gap: 8px; }

        /* back btn */
        .back-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 16px; border-radius: 9px; font-size: .78rem; font-weight: 800;
          background: var(--white); border: 1.5px solid var(--bd); color: var(--pri);
          cursor: pointer; text-decoration: none; transition: all .15s;
          font-family: 'Nunito', sans-serif;
        }
        .back-btn:hover { border-color: var(--pri-l); background: var(--pri-xl); box-shadow: 0 4px 14px rgba(59,130,246,.1); }
        .page-title { font-size: clamp(1.3rem,3vw,1.8rem); font-weight: 900; color: var(--dg); letter-spacing: -.025em; }

        /* buttons */
        .btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 16px; border-radius: 9px; font-size: .78rem; font-weight: 800;
          cursor: pointer; font-family: 'Nunito', sans-serif; transition: all .15s;
          white-space: nowrap; border: none; letter-spacing: .01em;
        }
        .btn-out  { background: var(--white); color: var(--t2); border: 1.5px solid var(--bd); }
        .btn-out:hover { border-color: var(--pri-l); color: var(--pri); background: var(--pri-xl); }
        .btn-out.danger:hover { border-color: #FCA5A5 !important; color: #EF4444 !important; background: #FEF2F2 !important; }
        .btn-pri  { background: var(--pri); color: #fff; box-shadow: 0 2px 8px rgba(59,130,246,.28); }
        .btn-pri:hover  { background: var(--pri-d); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(59,130,246,.38); }
        .btn-red  { background: #EF4444; color: #fff; box-shadow: 0 2px 8px rgba(239,68,68,.25); }
        .btn-red:hover  { background: #DC2626; transform: translateY(-1px); }
        .btn-ghost { background: transparent; border: 1.5px solid var(--bd); color: var(--t2); padding: 6px 13px; font-size: .74rem; }
        .btn-ghost:hover { border-color: var(--pri-l); color: var(--pri); background: var(--pri-xl); }
        .btn-ghost.del  { border-color: #FEE2E2; color: #EF4444; }
        .btn-ghost.del:hover { border-color: #FCA5A5; background: #FEF2F2; color: #DC2626; }
        .btn-ghost:disabled { opacity: .35; cursor: not-allowed; }

        /* lang dropdown */
        .ldw { position: relative; }
        .ldd {
          position: absolute; top: calc(100% + 8px); right: 0;
          background: #fff; border: 1.5px solid var(--bd); border-radius: 12px; padding: 5px;
          box-shadow: 0 16px 40px rgba(31,41,55,.1); min-width: 150px; z-index: 300;
          animation: fi .12s ease;
        }
        .lo { display: flex; align-items: center; gap: 9px; padding: 8px 12px; border-radius: 8px; cursor: pointer; font-size: .8rem; font-weight: 600; color: var(--t1); transition: background .1s; }
        .lo:hover, .lo.s { background: var(--pri-xl); color: var(--pri); }
        .av { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg,var(--pri),var(--acc)); color: #fff; font-weight: 800; font-size: .88rem; display: grid; place-items: center; flex-shrink: 0; cursor: pointer; border: 2px solid rgba(255,255,255,.6); }

        /* stats */
        .stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; margin-bottom: 24px; animation: su .4s ease .06s both; }
        .stat {
          background: var(--white); border: 1.5px solid var(--bd); border-radius: 14px;
          padding: 18px 20px; display: flex; align-items: center; justify-content: space-between;
          transition: box-shadow .18s, transform .18s, border-color .18s;
          position: relative; overflow: hidden;
        }
        .stat::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--stat-col, var(--pri)); }
        .stat:hover { box-shadow: 0 8px 24px rgba(59,130,246,.1); border-color: var(--pri-l); transform: translateY(-2px); }
        .stat-ico { width: 44px; height: 44px; border-radius: 12px; display: grid; place-items: center; font-size: 1.2rem; flex-shrink: 0; }
        .stat-lbl { font-size: .66rem; font-weight: 800; text-transform: uppercase; letter-spacing: .1em; color: var(--t3); margin-bottom: 4px; }
        .stat-val { font-size: 1.9rem; font-weight: 900; color: var(--dg); line-height: 1; letter-spacing: -.03em; }
        .stat-sub { font-size: .7rem; font-weight: 700; margin-top: 4px; }

        /* main card */
        .card { background: var(--white); border: 1.5px solid var(--bd); border-radius: 16px; overflow: hidden; animation: su .4s ease .12s both; }
        .card-head { padding: 16px 22px; border-bottom: 1.5px solid var(--bd2); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; background: var(--bg); }
        .card-head-l { display: flex; align-items: center; gap: 12px; }
        .card-title { font-size: .9rem; font-weight: 900; color: var(--t1); }
        .card-badge { background: var(--pri-xl); color: var(--pri); border: 1px solid var(--pri-l); font-size: .64rem; font-weight: 800; padding: 3px 9px; border-radius: 20px; letter-spacing: .06em; }

        /* toolbar */
        .toolbar { padding: 14px 22px; border-bottom: 1.5px solid var(--bd2); display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .search-wrap { position: relative; flex: 1; min-width: 180px; }
        .search-ico { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: var(--t3); pointer-events: none; }
        .search-ico svg { width: 15px; height: 15px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; }
        .search-inp {
          width: 100%; padding: 8px 12px 8px 34px; border-radius: 9px;
          border: 1.5px solid var(--bd); background: var(--bg);
          font-size: .8rem; font-weight: 600; font-family: 'Nunito', sans-serif;
          color: var(--t1); outline: none; transition: border-color .15s, box-shadow .15s;
        }
        .search-inp:focus { border-color: var(--pri-l); box-shadow: 0 0 0 3px var(--pri-xl); background: #fff; }
        .search-inp::placeholder { color: var(--t3); }
        .filter-tabs { display: flex; gap: 4px; }
        .ftab { padding: 7px 14px; border-radius: 8px; font-size: .75rem; font-weight: 800; cursor: pointer; border: none; background: none; color: var(--t3); font-family: 'Nunito', sans-serif; transition: all .14s; }
        .ftab:hover { background: var(--bd2); color: var(--t1); }
        .ftab.on { background: var(--pri); color: #fff; box-shadow: 0 2px 8px rgba(59,130,246,.28); }

        /* table */
        .tbl-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        thead th { text-align: left; padding: 11px 18px; font-size: .65rem; font-weight: 800; text-transform: uppercase; letter-spacing: .1em; color: var(--t3); border-bottom: 1.5px solid var(--bd2); background: var(--bg); white-space: nowrap; }
        tbody tr { border-bottom: 1px solid var(--bd2); transition: background .1s; animation: row .3s ease both; }
        tbody tr:last-child { border-bottom: none; }
        tbody tr:hover { background: var(--pri-xl); }
        tbody td { padding: 13px 18px; font-size: .83rem; color: var(--t1); vertical-align: middle; }
        .td-name  { font-weight: 800; }
        .td-email { color: var(--t2); font-weight: 500; }
        .td-muted { color: var(--t3); font-weight: 500; font-size: .78rem; }
        .tpill { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 99px; font-size: .7rem; font-weight: 800; letter-spacing: .04em; }
        .tpill-dot { width: 5px; height: 5px; border-radius: 50%; }
        .user-av { width: 32px; height: 32px; border-radius: 50%; display: grid; place-items: center; font-weight: 800; font-size: .8rem; flex-shrink: 0; }

        /* empty */
        .empty { text-align: center; padding: 60px 32px; color: var(--t3); }
        .empty-ico { font-size: 2.5rem; margin-bottom: 10px; }
        .empty-txt { font-weight: 700; font-size: .9rem; }

        /* modal overlay */
        .mov { position: fixed; inset: 0; z-index: 1000; background: rgba(17,24,39,.5); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; animation: fi .15s ease; padding: 16px; }

        /* form modal */
        .fmod { background: #fff; border: 1.5px solid var(--bd); border-radius: 20px; padding: 28px; width: 100%; max-width: 460px; max-height: 90vh; overflow-y: auto; box-shadow: 0 32px 80px rgba(17,24,39,.18); animation: su .18s ease; }
        .fmod-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px; padding-bottom: 16px; border-bottom: 1.5px solid var(--bd2); }
        .fmod-title { font-size: 1.05rem; font-weight: 900; color: var(--dg); letter-spacing: -.02em; }
        .fmod-close { width: 30px; height: 30px; border-radius: 8px; border: none; background: var(--bg); color: var(--t3); font-size: .9rem; cursor: pointer; display: grid; place-items: center; transition: all .14s; }
        .fmod-close:hover { background: var(--sg); color: var(--t1); }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .fmod-foot { display: flex; justify-content: flex-end; gap: 10px; margin-top: 22px; padding-top: 18px; border-top: 1.5px solid var(--bd2); }
        .sel-inp { width: 100%; padding: 10px 14px; font-size: .85rem; font-weight: 600; border: 1.5px solid var(--bd); border-radius: 10px; outline: none; background: var(--bg); color: var(--t1); font-family: 'Nunito', sans-serif; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%236B7280' strokeWidth='2' strokeLinecap='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; cursor: pointer; transition: border-color .15s, box-shadow .15s; box-sizing: border-box; }
        .sel-inp:focus { border-color: #3B82F6; box-shadow: 0 0 0 3px #DBEAFE; background-color: #fff; }

        /* confirm modal */
        .cmod { background: #fff; border: 1.5px solid var(--bd); border-radius: 18px; padding: 36px 32px; max-width: 340px; width: 90%; box-shadow: 0 32px 80px rgba(17,24,39,.18); text-align: center; animation: su .18s ease; }
        .cmod-ico { font-size: 2.5rem; margin-bottom: 14px; line-height: 1; }
        .cmod-t   { font-size: 1.15rem; font-weight: 900; color: var(--dg); margin-bottom: 8px; letter-spacing: -.02em; }
        .cmod-s   { font-size: .84rem; color: var(--t3); margin-bottom: 26px; line-height: 1.65; font-weight: 500; }
        .cmod-bs  { display: flex; gap: 10px; justify-content: center; }

        /* responsive */
        @media (max-width: 900px) {
          .stats { grid-template-columns: repeat(3,1fr); }
        }
        @media (max-width: 660px) {
          .pg { padding: 16px 16px 40px; }
          .stats { grid-template-columns: 1fr; }
          .form-row { grid-template-columns: 1fr; }
          table thead th:nth-child(3), table tbody td:nth-child(3),
          table thead th:nth-child(5), table tbody td:nth-child(5) { display: none; }
        }
      `}</style>

      <div className="pg">

        {/* ── Topbar ── */}
        <div className="topbar">
          <div className="topbar-l">
            {/* Back to Dashboard button – now points to root "/" which renders the admin dashboard */}
            <Link to="/" className="back-btn">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M19 12H5m7-7l-7 7 7 7"/>
              </svg>
              {t.back}
            </Link>
            <h1 className="page-title">{t.manageUsers}</h1>
          </div>
          <div className="topbar-r">
            {/* Language */}
            <div className="ldw">
              <button className="btn btn-out" onClick={() => setShowLang(v => !v)}>
                {curLang?.flag} {lang.toUpperCase()}
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {showLang && (
                <div className="ldd">
                  {LANGS.map(l => (
                    <div key={l.code} className={`lo ${l.code === lang ? 's' : ''}`}
                      onClick={() => { setLang(l.code); setShowLang(false); }}>
                      {l.flag} {l.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button className="btn btn-out danger" onClick={() => setShowLogout(true)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              {t.logout}
            </button>

            <div className="av">
              {user?.full_name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
          </div>
        </div>

        {/* ── Stat strip ── */}
        <div className="stats">
          {[
            { ico: '👥', lbl: t.totalUsers, val: total,   sub: 'All accounts',   col: '#3B82F6', bg: '#DBEAFE' },
            { ico: '👨‍🌾',lbl: t.farmers,   val: farmers, sub: 'Registered',     col: '#10B981', bg: '#D1FAE5' },
            { ico: '🛒', lbl: t.buyers,    val: buyers,  sub: 'Registered',     col: '#8B5CF6', bg: '#EDE9FE' },
          ].map((s, i) => (
            <div className="stat" key={i} style={{ '--stat-col': s.col }}>
              <div>
                <div className="stat-lbl">{s.lbl}</div>
                <div className="stat-val">{s.val}</div>
                <div className="stat-sub" style={{ color: s.col }}>{s.sub}</div>
              </div>
              <div className="stat-ico" style={{ background: s.bg }}>{s.ico}</div>
            </div>
          ))}
        </div>

        {/* ── Main card ── */}
        <div className="card">
          {/* Head */}
          <div className="card-head">
            <div className="card-head-l">
              <div className="card-title">{t.manageUsers}</div>
              <span className="card-badge">{filtered.length} USERS</span>
            </div>
            <button className="btn btn-pri" onClick={openAdd}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              {t.addUser}
            </button>
          </div>

          {/* Toolbar */}
          <div className="toolbar">
            <div className="search-wrap">
              <div className="search-ico">
                <svg viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
              <input
                className="search-inp"
                placeholder={t.search}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="filter-tabs">
              {['all', 'farmer', 'buyer', 'admin'].map(ft => (
                <button key={ft} className={`ftab ${filterType === ft ? 'on' : ''}`}
                  onClick={() => setFilterType(ft)}>
                  {t[ft] || ft}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="tbl-wrap">
            <table>
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
                      <div className="empty">
                        <div className="empty-ico">🔍</div>
                        <div className="empty-txt">{t.noUsers}</div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((u, idx) => {
                    const tc = TYPE_CFG[u.user_type] || TYPE_CFG.buyer;
                    return (
                      <tr key={u.user_id} style={{ animationDelay: `${idx * 25}ms` }}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div className="user-av" style={{
                              background: `${tc.color}22`, color: tc.color,
                            }}>
                              {u.full_name?.charAt(0)?.toUpperCase()}
                            </div>
                            <span className="td-name">{u.full_name}</span>
                          </div>
                        </td>
                        <td className="td-email">{u.email}</td>
                        <td className="td-muted">{u.phone_number || '—'}</td>
                        <td>
                          <span className="tpill" style={{ background: tc.bg, color: tc.color }}>
                            <span className="tpill-dot" style={{ background: tc.color }}/>
                            {u.user_type}
                          </span>
                        </td>
                        <td className="td-muted">{u.location || '—'}</td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button className="btn btn-ghost" onClick={() => openEdit(u)}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                              </svg>
                              {t.edit}
                            </button>
                            <button
                              className="btn btn-ghost del"
                              onClick={() => setDeleteTarget(u)}
                              disabled={u.user_type === 'admin' && u.email === user?.email}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                                <path d="M10 11v6M14 11v6"/>
                                <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                              </svg>
                              {t.delete}
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
      </div>

      {/* ── Add / Edit modal ── */}
      {showModal && (
        <div className="mov" onClick={() => setShowModal(false)}>
          <div className="fmod" onClick={e => e.stopPropagation()}>
            <div className="fmod-head">
              <div className="fmod-title">
                {editingUser ? t.editTitle : t.addTitle}
              </div>
              <button className="fmod-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="form-row">
              <Field label={t.fullName} error={errors.full_name}>
                <input
                  style={inputStyle(!!errors.full_name)}
                  type="text"
                  value={form.full_name}
                  onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))}
                  placeholder="e.g. Jean Paul"
                  onFocus={e  => { e.target.style.borderColor='#3B82F6'; e.target.style.boxShadow='0 0 0 3px #DBEAFE'; e.target.style.background='#fff'; }}
                  onBlur={e   => { e.target.style.borderColor=errors.full_name?'#EF4444':'#E5E7EB'; e.target.style.boxShadow='none'; e.target.style.background='#F9FAFB'; }}
                />
              </Field>
              <Field label={t.email} error={errors.email}>
                <input
                  style={inputStyle(!!errors.email)}
                  type="email"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="user@example.com"
                  onFocus={e  => { e.target.style.borderColor='#3B82F6'; e.target.style.boxShadow='0 0 0 3px #DBEAFE'; e.target.style.background='#fff'; }}
                  onBlur={e   => { e.target.style.borderColor=errors.email?'#EF4444':'#E5E7EB'; e.target.style.boxShadow='none'; e.target.style.background='#F9FAFB'; }}
                />
              </Field>
            </div>

            <div className="form-row">
              <Field label={t.phone}>
                <input
                  style={inputStyle(false)}
                  type="tel"
                  value={form.phone_number}
                  onChange={e => setForm(p => ({ ...p, phone_number: e.target.value }))}
                  placeholder="+250 788 000 000"
                  onFocus={e => { e.target.style.borderColor='#3B82F6'; e.target.style.boxShadow='0 0 0 3px #DBEAFE'; e.target.style.background='#fff'; }}
                  onBlur={e  => { e.target.style.borderColor='#E5E7EB'; e.target.style.boxShadow='none'; e.target.style.background='#F9FAFB'; }}
                />
              </Field>
              <Field label={t.userType} error={errors.user_type}>
                <select
                  className="sel-inp"
                  value={form.user_type}
                  onChange={e => setForm(p => ({ ...p, user_type: e.target.value }))}
                >
                  <option value="buyer">Buyer</option>
                  <option value="farmer">Farmer</option>
                  <option value="admin">Admin</option>
                </select>
              </Field>
            </div>

            <Field label={t.location}>
              <input
                style={inputStyle(false)}
                type="text"
                value={form.location}
                onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                placeholder="e.g. Kigali, Rwanda"
                onFocus={e => { e.target.style.borderColor='#3B82F6'; e.target.style.boxShadow='0 0 0 3px #DBEAFE'; e.target.style.background='#fff'; }}
                onBlur={e  => { e.target.style.borderColor='#E5E7EB'; e.target.style.boxShadow='none'; e.target.style.background='#F9FAFB'; }}
              />
            </Field>

            <Field
              label={editingUser ? t.newPassword : t.password}
              error={errors.password}
            >
              <input
                style={inputStyle(!!errors.password)}
                type="password"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="••••••••"
                onFocus={e  => { e.target.style.borderColor='#3B82F6'; e.target.style.boxShadow='0 0 0 3px #DBEAFE'; e.target.style.background='#fff'; }}
                onBlur={e   => { e.target.style.borderColor=errors.password?'#EF4444':'#E5E7EB'; e.target.style.boxShadow='none'; e.target.style.background='#F9FAFB'; }}
              />
            </Field>

            <div className="fmod-foot">
              <button className="btn btn-out" onClick={() => setShowModal(false)}>{t.cancel}</button>
              <button className="btn btn-pri" onClick={handleSave}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirm ── */}
      {deleteTarget && (
        <div className="mov" onClick={() => setDeleteTarget(null)}>
          <div className="cmod" onClick={e => e.stopPropagation()}>
            <div className="cmod-ico">🗑️</div>
            <h3 className="cmod-t">{t.delete}?</h3>
            <p className="cmod-s">
              <strong>{deleteTarget.full_name}</strong><br/>
              {t.confirmDelete}
            </p>
            <div className="cmod-bs">
              <button className="btn btn-red" onClick={handleDelete}>{t.yes}</button>
              <button className="btn btn-out" onClick={() => setDeleteTarget(null)}>{t.no}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Logout confirm ── */}
      {showLogout && (
        <div className="mov" onClick={() => setShowLogout(false)}>
          <div className="cmod" onClick={e => e.stopPropagation()}>
            <div className="cmod-ico">👋</div>
            <h3 className="cmod-t">{t.logout}?</h3>
            <p className="cmod-s">{t.signOutConfirm}</p>
            <div className="cmod-bs">
              <button className="btn btn-red" onClick={async () => {
                setShowLogout(false);
                await logout().catch(console.error);
              }}>
                {t.logout}
              </button>
              <button className="btn btn-out" onClick={() => setShowLogout(false)}>{t.cancel}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}