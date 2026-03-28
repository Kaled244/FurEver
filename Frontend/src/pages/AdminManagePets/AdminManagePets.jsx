import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit, X, Search, ChevronDown, Upload } from 'lucide-react';
import './AdminManagePets.css';

const SPECIES_DATA = {
  Dog: ['Golden Retriever', 'German Shepherd', 'Beagle', 'Poodle', 'Bulldog', 'Labrador', 'Pug', 'Husky', 'Aspin'],
  Cat: ['Persian', 'Maine Coon', 'Siamese', 'British Shorthair', 'Bengal', 'Ragdoll', 'Puspin'],
  Bird: ['Parrot', 'Canary', 'Cockatiel', 'Lovebird'],
  Rabbit: ['Holland Lop', 'Netherland Dwarf', 'Lionhead']
};

const AdminManagePets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null); 
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ species: 'All Pets', breed: 'All Breeds' });

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
      const response = await axios.get('http://localhost:8080/api/pets');
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
        ? `http://localhost:8080/api/pets/update/${editingId}` 
        : `http://localhost:8080/api/pets/add`;
      
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
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert("Operation failed. Check if the backend update route exists.");
    }
  };

  const deletePet = async (id) => {
    if (!window.confirm("Are you sure you want to remove this pet? This will also delete the image.")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/pets/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPets();
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert("Delete failed.");
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
                  <img src={pet.pImage || 'https://via.placeholder.com/50'} alt="" className="table-thumb" />
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
                    <img src={preview} alt="Preview" />
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
    </div>
  );
};

export default AdminManagePets;