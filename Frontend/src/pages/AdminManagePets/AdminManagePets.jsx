import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit, X, Search, ChevronDown, Upload, Activity } from 'lucide-react';
import { API_ENDPOINTS } from '../../api/config';
import { NotificationContext } from "../../components/Notification/NotificationContext";
import './AdminManagePets.css';

const SPECIES_DATA = {
  Dog: ['Golden Ret', 'German Shep', 'Beagle', 'Poodle', 'Bulldog', 'Labrador', 'Pug', 'Husky', 'Aspin', 'Maltese', 'Shitzu'],
  Cat: ['Persian', 'Main Coon', 'Siamese', 'British Shorthair', 'Bengal', 'Rogdoll', 'Puspin', 'Tabby'],
  Bird: ['Parrot', 'Canary', 'Cockatiel', 'Lovebird'],
  Rabbit: ['Holland Lop', 'Netherland Dwarf', 'Lionhead']
};

const AdminManagePets = () => {
  const showNotification = useContext(NotificationContext);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
  
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null); 
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ species: 'All Pets', breed: 'All Breeds' });

  // Health Records state
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [healthRecords, setHealthRecords] = useState([]);
  const [activePetForHealth, setActivePetForHealth] = useState(null);
  const [healthForm, setHealthForm] = useState({ vacDate: '', vacType: '' });
  const [healthLoading, setHealthLoading] = useState(false);

  // Helper function to construct full image URL
  const getPetImage = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/50';
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("/api/")) return `${BASE_URL}${imagePath}`;
    return `${BASE_URL}/uploads/${imagePath}`;
  };

  const initialFormState = {
    pName: '',
    pSpecies: 'Dog', 
    pBreed: '',
    pAge: '',
    pGender: 'Male',
    pStatus: 'AVAILABLE',
    pPrice: '0',
    pDescription: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.PETS_GET_ALL);
      if (Array.isArray(response.data)) setPets(response.data);
    } catch (err) {
      console.error("❌ Error fetching pets:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const filteredPets = pets.filter(pet => {
    const matchesSearch = (pet.pName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (pet.pBreed || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecies = filters.species === 'All Pets' || (pet.pSpecies || '').toLowerCase() === filters.species.toLowerCase();
    const matchesBreed = filters.breed === 'All Breeds' || (pet.pBreed || '').toLowerCase() === filters.breed.toLowerCase();
    return matchesSearch && matchesSpecies && matchesBreed;
  });

  // --- ACTIONS ---

  const handleAddButtonClick = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setPreview(null);
    setSelectedFile(null);
    setShowForm(true);
  };

  const handleEditClick = (pet) => {
    setEditingId(pet.pId);
    setFormData({
      pName: pet.pName,
      pSpecies: pet.pSpecies,
      pBreed: pet.pBreed,
      pAge: pet.pAge,
      pGender: pet.pGender,
      pStatus: pet.pStatus,
      pPrice: pet.pPrice,
      pDescription: pet.pDescription
    });
    setPreview(pet.pImage); 
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (selectedFile) data.append('pImage', selectedFile);

    try {
      const token = localStorage.getItem('token');
      const url = editingId 
        ? API_ENDPOINTS.PETS_UPDATE(editingId)
        : API_ENDPOINTS.PETS_ADD;
      
      await axios({
        method: editingId ? 'put' : 'post',
        url: url,
        data: data,
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setShowForm(false);
      setEditingId(null);
      setSelectedFile(null);
      setPreview(null);
      fetchPets();
      showNotification(editingId ? "Pet updated successfully!" : "Pet added successfully!", "success");
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      showNotification("Operation failed. Check if the backend update route exists.", "error");
    }
  };

  const deletePet = async (id) => {
    if (!window.confirm("Are you sure you want to remove this pet? This will also delete the image.")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(API_ENDPOINTS.PETS_DELETE(id), {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPets();
      showNotification("Pet deleted successfully!", "success");
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      showNotification("Delete failed.", "error");
    }
  };

  const handleHealthClick = async (pet) => {
    setActivePetForHealth(pet);
    setShowHealthModal(true);
    setHealthLoading(true);
    try {
      const response = await axios.get(API_ENDPOINTS.HEALTH_GET_BY_PET(pet.pId));
      setHealthRecords(response.data || []);
    } catch (error) {
      console.error("Failed to load health records", error);
      showNotification("Failed to load health records", "error");
    } finally {
      setHealthLoading(false);
    }
  };

  const handleHealthSubmit = async (e) => {
    e.preventDefault();
    if (!healthForm.vacDate || !healthForm.vacType) {
       showNotification("Please fill all health record fields", "error");
       return;
    }
    
    try {
      const data = {
        pId: activePetForHealth.pId,
        vacDate: healthForm.vacDate,
        vacType: healthForm.vacType
      };
      
      const response = await axios.post(API_ENDPOINTS.HEALTH_ADD, data);
      setHealthRecords([...healthRecords, response.data]);
      setHealthForm({ vacDate: '', vacType: '' });
      showNotification("Health record added successfully!", "success");
    } catch(err) {
      console.error("Failed to add health record", err);
      showNotification("Failed to add health record", "error");
    }
  };

  if (loading) return <div className="adm-loader">Fetching Fuzzy Pets...</div>;

  return (
    <div className="manage-pets-page">
      <header className="manage-header">
        <div className="header-text">
          <h1>Manage Pets</h1>
          <p>Total Residents: <strong>{pets.length}</strong></p>
        </div>
        {/* Fixed: Reset editing state when adding new */}
        <button className="add-pet-trigger" onClick={handleAddButtonClick}>
          <Plus size={18} /> Add Pet
        </button>
      </header>

      {/* --- FILTER BAR --- */}
      <div className="adm-filter-bar">
        <div className="adm-search-container">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="adm-filter-controls">
          <button 
            className={`adm-filter-btn ${filters.species === 'All Pets' ? 'active' : ''}`}
            onClick={() => setFilters({ species: 'All Pets', breed: 'All Breeds' })}
          >
            All Pets
          </button>

          <div className="adm-select-wrapper">
            <select 
              value={filters.species} 
              onChange={(e) => setFilters({ species: e.target.value, breed: 'All Breeds' })}
            >
              <option value="All Pets">Species</option>
              {Object.keys(SPECIES_DATA).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown size={14} className="adm-select-chevron" />
          </div>

          <div className="adm-select-wrapper">
            <select 
              disabled={filters.species === 'All Pets'}
              value={filters.breed}
              onChange={(e) => setFilters({ ...filters, breed: e.target.value })}
            >
              <option value="All Breeds">Breed</option>
              {filters.species !== 'All Pets' && SPECIES_DATA[filters.species].map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <ChevronDown size={14} className="adm-select-chevron" />
          </div>
        </div>
      </div>

      <div className="pets-table-container">
        <table className="pets-table">
          <thead>
            <tr>
              <th>Preview</th>
              <th>Name</th>
              <th>Breed</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPets.map(pet => (
              <tr key={pet.pId}>
                <td>
                  <img src={getPetImage(pet.pImage)} alt="" className="table-thumb" />
                </td>
                <td>
                  <div className="name-cell">
                    <strong>{pet.pName}</strong>
                    <span>{pet.pAge} {pet.pAge === 1 ? 'year' : 'years'} old • {pet.pGender}</span>
                  </div>
                </td>
                <td><div className="breed-cell"><span>{pet.pBreed}</span></div></td>
                <td>
                  <span className={`status-tag ${(pet.pStatus || 'AVAILABLE').toLowerCase()}`}>
                    {pet.pStatus || 'AVAILABLE'}
                  </span>
                </td>
                <td className="table-actions">
                  <button className="health-btn" onClick={() => handleHealthClick(pet)} title="Health Records"><Activity size={16} /></button>
                  {/* Fixed: Bound handleEditClick */}
                  <button className="edit-btn" onClick={() => handleEditClick(pet)}><Edit size={16} /></button>
                  <button className="delete-btn" onClick={() => deletePet(pet.pId)}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="pet-modal-overlay">
          <div className="pet-modal-content animate-pop">
            <div className="modal-header">
              {/* Dynamic Header */}
              <h2>{editingId ? `Edit ${formData.pName}` : 'Register New Pet'}</h2>
              <button className="close-modal" onClick={() => setShowForm(false)}><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="pet-form">
              <div className="form-row">
                <input type="text" name="pName" placeholder="Pet Name" value={formData.pName} onChange={handleInputChange} required />
                <select name="pSpecies" value={formData.pSpecies} onChange={handleInputChange} className="adm-modal-select">
                  {Object.keys(SPECIES_DATA).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-row">
                <input type="text" name="pBreed" placeholder="Breed" value={formData.pBreed} onChange={handleInputChange} required />
                <input type="number" name="pAge" placeholder="Age" value={formData.pAge} onChange={handleInputChange} required />
              </div>
              <div className="form-row">
                <select name="pGender" value={formData.pGender} onChange={handleInputChange} className="adm-modal-select">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <input type="text" name="pPrice" placeholder="Price" value={formData.pPrice} onChange={handleInputChange} />
              </div>

              <div className="adm-file-upload-section">
                <label className="adm-file-label">
                  <Upload size={20} />
                  <span>{selectedFile ? selectedFile.name : (editingId ? "Change Pet Photo" : "Upload Pet Photo")}</span>
                  <input 
                    type="file" 
                    name="pImage" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    hidden 
                    // Only required if adding a new pet
                    required={!editingId} 
                  />
                </label>
                {preview && (
                  <div className="adm-preview-box">
                    <img src={typeof preview === 'string' && preview.startsWith('blob:') ? preview : (typeof preview === 'string' ? getPetImage(preview) : preview)} alt="Preview" />
                  </div>
                )}
              </div>
              
              <textarea name="pDescription" placeholder="Pet Biography/Description..." value={formData.pDescription} onChange={handleInputChange} required></textarea>
              <button type="submit" className="save-pet-btn">
                {editingId ? "Update Pet Details" : "Save new pet"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* HEALTH RECORDS MODAL */}
      {showHealthModal && activePetForHealth && (
        <div className="pet-modal-overlay">
          <div className="pet-modal-content animate-pop" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2>Health Records: {activePetForHealth.pName}</h2>
              <button className="close-modal" onClick={() => setShowHealthModal(false)}><X /></button>
            </div>
            
            <div className="health-records-container" style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px', padding: '10px', background: '#f9f8f6', borderRadius: '12px' }}>
              {healthLoading ? (
                <p>Loading records...</p>
              ) : healthRecords.length === 0 ? (
                <p style={{textAlign: 'center', color: '#888', fontStyle: 'italic', margin: '20px 0'}}>No health records found for {activePetForHealth.pName}.</p>
              ) : (
                <table className="adm-table" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '10px' }}>Date</th>
                      <th style={{ padding: '10px' }}>Treatment / Vaccine Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {healthRecords.map((r, i) => (
                      <tr key={i}>
                        <td style={{ padding: '10px', fontSize: '14px' }}>{new Date(r.vacDate).toLocaleDateString()}</td>
                        <td style={{ padding: '10px', fontSize: '14px' }}>{r.vacType}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <form onSubmit={handleHealthSubmit} className="pet-form">
              <h3 style={{ fontSize: '16px', margin: '0 0 15px 0', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Add New Record</h3>
              <div className="form-row">
                <input 
                  type="date" 
                  name="vacDate" 
                  value={healthForm.vacDate} 
                  onChange={(e) => setHealthForm({...healthForm, vacDate: e.target.value})} 
                  required 
                />
                <input 
                  type="text" 
                  name="vacType" 
                  placeholder="e.g. Rabies Vaccine, General Checkup" 
                  value={healthForm.vacType} 
                  onChange={(e) => setHealthForm({...healthForm, vacType: e.target.value})} 
                  required 
                />
              </div>
              <button type="submit" className="save-pet-btn" style={{ background: '#0ea5e9' }}>
                Add Record
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagePets;