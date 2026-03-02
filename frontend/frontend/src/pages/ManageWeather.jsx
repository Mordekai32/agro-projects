import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// API services
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

  // Inject global keyframes
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      @keyframes fadeIn { from{opacity:0} to{opacity:1} }
      @media (max-width: 640px) {
        .weather-grid { grid-template-columns: 1fr !important; }
        .form-container { flex-direction: column; }
        .modal-buttons { flex-direction: column; }
      }
      @media (min-width: 641px) and (max-width: 1024px) {
        .weather-grid { grid-template-columns: repeat(2, 1fr) !important; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Styles
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
    },
    main: {
      marginLeft: 0,
      padding: 'clamp(1rem, 5vw, 2rem)',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1rem',
      marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    backButton: (isHovered) => ({
      background: 'transparent',
      border: '1.5px solid #e5e7eb',
      borderRadius: '40px',
      padding: '8px 20px',
      fontSize: '0.95rem',
      fontWeight: '500',
      color: isHovered ? '#1f2937' : '#4b5563',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: isHovered ? '#f3f4f6' : 'transparent',
      borderColor: isHovered ? '#2563eb' : '#e5e7eb',
    }),
    headerTitle: {
      fontSize: 'clamp(1.5rem, 5vw, 1.875rem)',
      fontWeight: 'bold',
      color: '#1f2937',
      margin: 0,
    },
    addButton: (isHovered) => ({
      background: isHovered ? '#1d4ed8' : '#2563eb',
      border: 'none',
      borderRadius: '40px',
      padding: '10px 24px',
      fontSize: '1rem',
      fontWeight: '600',
      color: '#ffffff',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    }),
    loadingContainer: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingPulse: {
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      width: '48px',
      height: '48px',
      backgroundColor: '#e5e7eb',
      borderRadius: '4px',
    },
    errorContainer: {
      padding: '2rem',
      textAlign: 'center',
      color: '#dc2626',
      backgroundColor: '#fee2e2',
      borderRadius: '12px',
      marginBottom: '2rem',
    },
    weatherGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
      gap: 'clamp(1rem, 3vw, 1.5rem)',
      marginBottom: '2rem',
    },
    weatherCard: (isHovered) => ({
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      padding: '1.5rem',
      transition: 'transform 0.2s, box-shadow 0.2s',
      transform: isHovered ? 'translateY(-4px)' : 'none',
      boxShadow: isHovered ? '0 10px 15px -3px rgba(0,0,0,0.1)' : '0 4px 6px -1px rgba(0,0,0,0.1)',
      border: '1px solid #f3f4f6',
    }),
    weatherDistrict: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '0.75rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    weatherDetail: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '0.5rem',
      color: '#4b5563',
    },
    weatherLabel: {
      fontWeight: '500',
    },
    weatherValue: {
      fontWeight: '600',
      color: '#2563eb',
    },
    cardActions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '1rem',
      marginTop: '1rem',
      borderTop: '1px solid #e5e7eb',
      paddingTop: '1rem',
    },
    iconButton: (isHovered, color = '#2563eb') => ({
      background: 'transparent',
      border: 'none',
      fontSize: '1.2rem',
      cursor: 'pointer',
      color: isHovered ? color : '#6b7280',
      transition: 'color 0.2s',
      padding: '0.25rem',
    }),
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.2s ease-out',
    },
    modal: {
      background: '#ffffff',
      borderRadius: '24px',
      padding: 'clamp(1.5rem, 5vw, 2rem)',
      maxWidth: '500px',
      width: '90%',
      boxShadow: '0 30px 60px -15px rgba(0,0,0,0.3)',
      border: '1px solid #e5e7eb',
    },
    modalTitle: {
      fontSize: '1.5rem',
      fontWeight: 700,
      color: '#1f2937',
      marginBottom: '1.5rem',
      textAlign: 'center',
    },
    formGroup: {
      marginBottom: '1.25rem',
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: 500,
      color: '#374151',
    },
    input: {
      width: '100%',
      padding: '0.75rem 1rem',
      border: '1px solid #d1d5db',
      borderRadius: '12px',
      fontSize: '1rem',
      transition: 'border-color 0.2s',
      outline: 'none',
      boxSizing: 'border-box',
    },
    modalButtons: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      marginTop: '2rem',
      flexWrap: 'wrap',
    },
    modalButton: (bgColor, hoverColor, isHovered) => ({
      padding: '0.75rem 2rem',
      borderRadius: '50px',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      border: 'none',
      background: isHovered ? hoverColor : bgColor,
      color: bgColor === '#f3f4f6' ? '#1f2937' : '#ffffff',
      minWidth: '120px',
    }),
    deleteModal: {
      textAlign: 'center',
    },
    deleteModalText: {
      fontSize: '1.1rem',
      color: '#4b5563',
      marginBottom: '2rem',
    },
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingPulse}></div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <main style={styles.main}>
        {/* Header with Back Button and Add Button */}
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            {/* Back to Dashboard Button - now navigates to root "/" */}
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
            <p>{error}</p>
            <button onClick={fetchWeather} style={{ textDecoration: 'underline', background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer' }}>
              Retry
            </button>
          </div>
        )}

        {/* Weather Grid */}
        {weatherList.length === 0 && !error ? (
          <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
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
                  <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                    {weather.weather_date ? new Date(weather.weather_date).toLocaleDateString() : ''}
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
                    style={styles.iconButton(hoveredDeleteIcon === idx, '#dc2626')}
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
                  <label style={styles.label} htmlFor="district">District *</label>
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
                  <label style={styles.label} htmlFor="temperature">Temperature (°C) *</label>
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
                  <label style={styles.label} htmlFor="rainfall_probability">Rainfall Probability (%) *</label>
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
                  <label style={styles.label} htmlFor="weather_date">Date (optional)</label>
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
                    style={styles.modalButton('#2563eb', '#1d4ed8', hoveredSaveButton)}
                    onMouseEnter={() => setHoveredSaveButton(true)}
                    onMouseLeave={() => setHoveredSaveButton(false)}
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    style={styles.modalButton('#f3f4f6', '#e5e7eb', hoveredCancelButton)}
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
                  style={styles.modalButton('#dc2626', '#b91c1c', hoveredDeleteConfirm)}
                  onMouseEnter={() => setHoveredDeleteConfirm(true)}
                  onMouseLeave={() => setHoveredDeleteConfirm(false)}
                  onClick={confirmDelete}
                >
                  Delete
                </button>
                <button
                  style={styles.modalButton('#f3f4f6', '#e5e7eb', hoveredDeleteCancel)}
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