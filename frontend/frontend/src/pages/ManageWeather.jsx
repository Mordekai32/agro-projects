import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getWeather,
  createWeather,
  updateWeather,
  deleteWeather,
} from '../services/api';

export default function ManageWeather() {
  const navigate = useNavigate();

  // State
  const [weatherList, setWeatherList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [formData, setFormData] = useState({
    district: '',
    temperature: '',
    rainfall_probability: '',
    weather_date: '',
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Hover states
  const [hoveredBackButton, setHoveredBackButton] = useState(false);
  const [hoveredAddButton, setHoveredAddButton] = useState(false);
  const [hoveredSaveButton, setHoveredSaveButton] = useState(false);
  const [hoveredCancelButton, setHoveredCancelButton] = useState(false);
  const [hoveredDeleteConfirm, setHoveredDeleteConfirm] = useState(false);
  const [hoveredDeleteCancel, setHoveredDeleteCancel] = useState(false);
  const [hoveredWeatherItem, setHoveredWeatherItem] = useState(null);
  const [hoveredEditIcon, setHoveredEditIcon] = useState(null);
  const [hoveredDeleteIcon, setHoveredDeleteIcon] = useState(null);

  // Fetch weather data
  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getWeather();
      setWeatherList(response.data);
    } catch (err) {
      console.error('Failed to fetch weather:', err);
      setError('Could not load weather data.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setModalMode('add');
    setFormData({
      district: '',
      temperature: '',
      rainfall_probability: '',
      weather_date: '',
    });
    setCurrentWeather(null);
    setShowModal(true);
  };

  const handleEditClick = (weather) => {
    setModalMode('edit');
    setCurrentWeather(weather);
    setFormData({
      district: weather.district || '',
      temperature: weather.temperature || '',
      rainfall_probability: weather.rainfall_probability || '',
      weather_date: weather.weather_date || '',
    });
    setShowModal(true);
  };

  const handleModalClose = () => setShowModal(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.district || !formData.temperature || !formData.rainfall_probability) {
      alert('Please fill in all required fields.');
      return;
    }
    try {
      if (modalMode === 'add') {
        await createWeather(formData);
      } else {
        await updateWeather(currentWeather.weather_id, formData);
      }
      setShowModal(false);
      fetchWeather();
    } catch (err) {
      console.error('Save failed:', err);
      alert('Failed to save weather data.');
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteWeather(deleteId);
      setShowDeleteModal(false);
      setDeleteId(null);
      fetchWeather();
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete weather record.');
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  // Inject global keyframes and dark theme base styles
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'mw-css-dark';
    style.innerHTML = `
      @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      @keyframes fadeIn { from{opacity:0} to{opacity:1} }
      @keyframes scaleIn { from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)} }
      @media (max-width: 640px) {
        .weather-grid { grid-template-columns: 1fr !important; }
        .modal-buttons { flex-direction: column; }
      }
      @media (min-width: 641px) and (max-width: 1024px) {
        .weather-grid { grid-template-columns: repeat(2, 1fr) !important; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Dark theme color palette
  const theme = {
    bg: '#0a0a0a',
    bg2: '#1a1a1a',
    bg3: '#2a2a2a',
    border: '#333333',
    border2: '#444444',
    ink: '#ffffff',
    ink2: '#cccccc',
    ink3: '#888888',
    primary: '#ffffff',
    primaryDim: '#dddddd',
    primaryGlow: 'rgba(255,255,255,0.15)',
    red: '#ef4444',
    redLt: '#442222',
    red2: '#ff6b6b',
    green: '#10b981',
  };

  // Styles (inline, using theme)
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: theme.bg,
      color: theme.ink,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    },
    main: {
      marginLeft: 0,
      padding: 'clamp(20px, 4vw, 36px)',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1rem',
      marginBottom: '28px',
      animation: 'fadeIn 0.4s ease',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    backButton: (isHovered) => ({
      background: isHovered ? theme.bg3 : theme.bg2,
      border: `1.5px solid ${isHovered ? theme.ink2 : theme.border2}`,
      borderRadius: '100px',
      padding: '8px 20px',
      fontSize: '0.95rem',
      fontWeight: 600,
      color: isHovered ? theme.ink : theme.ink2,
      cursor: 'pointer',
      transition: 'all 0.18s',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    }),
    headerTitle: {
      fontSize: 'clamp(20px, 4vw, 28px)',
      fontWeight: 800,
      color: theme.ink,
      margin: 0,
      fontFamily: "'Syne', sans-serif",
    },
    addButton: (isHovered) => ({
      background: isHovered ? theme.primaryDim : theme.primary,
      border: 'none',
      borderRadius: '100px',
      padding: '10px 24px',
      fontSize: '13px',
      fontWeight: 700,
      color: theme.bg,
      cursor: 'pointer',
      transition: 'all 0.18s',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      boxShadow: isHovered ? `0 6px 20px ${theme.primaryGlow}` : `0 4px 14px ${theme.primaryGlow}`,
      transform: isHovered ? 'translateY(-1px)' : 'none',
    }),
    loadingContainer: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: theme.bg,
      flexDirection: 'column',
      gap: '16px',
    },
    spinner: {
      width: '44px',
      height: '44px',
      border: `3px solid ${theme.border}`,
      borderTopColor: theme.ink,
      borderRadius: '50%',
      animation: 'pulse 0.8s linear infinite',
    },
    loaderText: {
      fontFamily: "'Syne', sans-serif",
      fontSize: '13px',
      color: theme.ink3,
      fontWeight: 700,
      letterSpacing: '0.06em',
    },
    errorContainer: {
      background: theme.redLt,
      border: `1px solid ${theme.red2}`,
      borderRadius: '18px',
      padding: '14px 20px',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      color: theme.red2,
      fontWeight: 600,
    },
    weatherGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '16px',
      marginBottom: '2rem',
      animation: 'fadeIn 0.4s ease',
    },
    weatherCard: (isHovered) => ({
      background: theme.bg2,
      border: `1px solid ${theme.border}`,
      borderRadius: '18px',
      padding: '20px 22px',
      boxShadow: isHovered ? theme.shadow : theme.shadowSm,
      transition: 'all 0.22s',
      transform: isHovered ? 'translateY(-3px)' : 'none',
      cursor: 'default',
    }),
    weatherDistrict: {
      fontSize: '1.25rem',
      fontWeight: 700,
      color: theme.ink,
      marginBottom: '12px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontFamily: "'Syne', sans-serif",
    },
    weatherDetail: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '8px',
      color: theme.ink2,
      fontSize: '14px',
    },
    weatherLabel: {
      fontWeight: 600,
      color: theme.ink3,
    },
    weatherValue: {
      fontWeight: 700,
      color: theme.ink,
    },
    cardActions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '1rem',
      marginTop: '16px',
      borderTop: `1px solid ${theme.border}`,
      paddingTop: '16px',
    },
    iconButton: (isHovered, color = theme.ink) => ({
      background: 'transparent',
      border: 'none',
      fontSize: '1.2rem',
      cursor: 'pointer',
      color: isHovered ? color : theme.ink3,
      transition: 'color 0.15s',
      padding: '4px',
    }),
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.2s ease',
    },
    modal: {
      background: theme.bg2,
      border: `1px solid ${theme.border}`,
      borderRadius: '24px',
      padding: 'clamp(24px, 4vw, 36px)',
      maxWidth: '500px',
      width: '90%',
      boxShadow: '0 16px 48px rgba(0,0,0,0.8)',
      animation: 'scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1)',
    },
    modalTitle: {
      fontSize: '1.8rem',
      fontWeight: 800,
      color: theme.ink,
      marginBottom: '1.5rem',
      textAlign: 'center',
      fontFamily: "'Syne', sans-serif",
    },
    formGroup: {
      marginBottom: '18px',
    },
    label: {
      display: 'block',
      fontSize: '12px',
      fontWeight: 700,
      color: theme.ink2,
      marginBottom: '7px',
      textTransform: 'uppercase',
      letterSpacing: '0.07em',
    },
    input: {
      width: '100%',
      padding: '11px 16px',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '14px',
      color: theme.ink,
      border: `1.5px solid ${theme.border}`,
      borderRadius: '12px',
      background: theme.bg3,
      outline: 'none',
      transition: 'all 0.18s',
      boxSizing: 'border-box',
    },
    modalButtons: {
      display: 'flex',
      gap: '10px',
      justifyContent: 'center',
      marginTop: '24px',
      flexWrap: 'wrap',
    },
    modalButton: (bgColor, hoverColor, isHovered) => ({
      padding: '10px 24px',
      borderRadius: '100px',
      fontSize: '13px',
      fontWeight: 700,
      cursor: 'pointer',
      transition: 'all 0.18s',
      border: '1.5px solid transparent',
      background: isHovered ? hoverColor : bgColor,
      color: bgColor === theme.bg3 ? theme.ink2 : theme.bg,
      minWidth: '120px',
      borderColor: isHovered ? 'transparent' : (bgColor === theme.bg3 ? theme.border : 'transparent'),
    }),
    deleteModal: {
      textAlign: 'center',
    },
    deleteModalText: {
      fontSize: '14px',
      color: theme.ink3,
      marginBottom: '24px',
      lineHeight: 1.5,
    },
  };

  // Shadow variables (reuse from theme)
  theme.shadowSm = '0 1px 6px rgba(0,0,0,0.5)';
  theme.shadow = '0 4px 20px rgba(0,0,0,0.6)';

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <div style={styles.loaderText}>LOADING WEATHER...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <main style={styles.main}>
        {/* Header with Back Button and Add Button */}
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <button
              style={styles.backButton(hoveredBackButton)}
              onMouseEnter={() => setHoveredBackButton(true)}
              onMouseLeave={() => setHoveredBackButton(false)}
              onClick={() => navigate('/')}
            >
              <span>←</span> Dashboard
            </button>
            <h1 style={styles.headerTitle}>Manage Weather</h1>
          </div>
          <button
            style={styles.addButton(hoveredAddButton)}
            onMouseEnter={() => setHoveredAddButton(true)}
            onMouseLeave={() => setHoveredAddButton(false)}
            onClick={handleAddClick}
          >
            <span>➕</span> Add Weather
          </button>
        </header>

        {/* Error display */}
        {error && (
          <div style={styles.errorContainer}>
            <span style={{ fontSize: '20px' }}>⚠️</span>
            <span>{error}</span>
            <button
              onClick={fetchWeather}
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                color: theme.red2,
                textDecoration: 'underline',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Weather Grid */}
        {weatherList.length === 0 && !error ? (
          <p style={{ textAlign: 'center', color: theme.ink3, padding: '2rem' }}>
            No weather records found. Click "Add Weather" to create one.
          </p>
        ) : (
          <div style={styles.weatherGrid} className="weather-grid">
            {weatherList.map((weather, idx) => (
              <div
                key={weather.weather_id}
                style={styles.weatherCard(hoveredWeatherItem === idx)}
                onMouseEnter={() => setHoveredWeatherItem(idx)}
                onMouseLeave={() => setHoveredWeatherItem(null)}
              >
                <div style={styles.weatherDistrict}>
                  <span>{weather.district}</span>
                  <span style={{ fontSize: '0.9rem', color: theme.ink3 }}>
                    {weather.weather_date
                      ? new Date(weather.weather_date).toLocaleDateString()
                      : ''}
                  </span>
                </div>
                <div style={styles.weatherDetail}>
                  <span style={styles.weatherLabel}>Temperature</span>
                  <span style={styles.weatherValue}>{weather.temperature}°C</span>
                </div>
                <div style={styles.weatherDetail}>
                  <span style={styles.weatherLabel}>Rainfall Probability</span>
                  <span style={styles.weatherValue}>{weather.rainfall_probability}%</span>
                </div>
                <div style={styles.cardActions}>
                  <button
                    style={styles.iconButton(hoveredEditIcon === idx)}
                    onMouseEnter={() => setHoveredEditIcon(idx)}
                    onMouseLeave={() => setHoveredEditIcon(null)}
                    onClick={() => handleEditClick(weather)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    style={styles.iconButton(hoveredDeleteIcon === idx, theme.red2)}
                    onMouseEnter={() => setHoveredDeleteIcon(idx)}
                    onMouseLeave={() => setHoveredDeleteIcon(null)}
                    onClick={() => handleDeleteClick(weather.weather_id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div style={styles.modalOverlay} onClick={handleModalClose}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <h3 style={styles.modalTitle}>
                {modalMode === 'add' ? 'Add New Weather' : 'Edit Weather'}
              </h3>
              <form onSubmit={(e) => e.preventDefault()}>
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="district">
                    District *
                  </label>
                  <input
                    type="text"
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleFormChange}
                    style={styles.input}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="temperature">
                    Temperature (°C) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    id="temperature"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleFormChange}
                    style={styles.input}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="rainfall_probability">
                    Rainfall Probability (%) *
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    id="rainfall_probability"
                    name="rainfall_probability"
                    value={formData.rainfall_probability}
                    onChange={handleFormChange}
                    style={styles.input}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="weather_date">
                    Date (optional)
                  </label>
                  <input
                    type="date"
                    id="weather_date"
                    name="weather_date"
                    value={formData.weather_date}
                    onChange={handleFormChange}
                    style={styles.input}
                  />
                </div>
                <div style={styles.modalButtons}>
                  <button
                    type="button"
                    style={styles.modalButton(theme.primary, theme.primaryDim, hoveredSaveButton)}
                    onMouseEnter={() => setHoveredSaveButton(true)}
                    onMouseLeave={() => setHoveredSaveButton(false)}
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    style={styles.modalButton(theme.bg3, theme.bg2, hoveredCancelButton)}
                    onMouseEnter={() => setHoveredCancelButton(true)}
                    onMouseLeave={() => setHoveredCancelButton(false)}
                    onClick={handleModalClose}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div style={styles.modalOverlay} onClick={cancelDelete}>
            <div style={{ ...styles.modal, ...styles.deleteModal }} onClick={(e) => e.stopPropagation()}>
              <h3 style={styles.modalTitle}>Confirm Delete</h3>
              <p style={styles.deleteModalText}>
                Are you sure you want to delete this weather record?
              </p>
              <div style={styles.modalButtons}>
                <button
                  style={styles.modalButton(theme.red, '#b91c1c', hoveredDeleteConfirm)}
                  onMouseEnter={() => setHoveredDeleteConfirm(true)}
                  onMouseLeave={() => setHoveredDeleteConfirm(false)}
                  onClick={confirmDelete}
                >
                  Delete
                </button>
                <button
                  style={styles.modalButton(theme.bg3, theme.bg2, hoveredDeleteCancel)}
                  onMouseEnter={() => setHoveredDeleteCancel(true)}
                  onMouseLeave={() => setHoveredDeleteCancel(false)}
                  onClick={cancelDelete}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}