import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PetCard from '../../components/Pet/PetCard';
import ApplicationListModal from '../../components/Pet/ApplicationListModal';
import './Adopt.css';

const Adopt = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All Pets');
  const [showAppList, setShowAppList] = useState(false); // NEW STATE

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        setError(null);
        const targetUrl = 'http://localhost:8080/api/pets';
        const response = await axios.get(targetUrl, {
          headers: { 'Accept': 'application/json' }
        });
        setPets(response.data);
      } catch (error) {
        console.error("❌ Fetch Error:", error);
        setError(error.response ? `Server Error: ${error.response.status}` : 'Cannot connect to server.');
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, []);

  const filteredPets = pets.filter(pet => {
    const status = pet.pStatus || pet.p_status;
    const isAvailable = status?.toLowerCase() === 'available';
    if (!isAvailable) return false;
    if (activeFilter === 'All Pets') return true;
    const species = pet.pSpecies || pet.p_species;
    return species?.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <div className="adopt-page">
      <main className="main-content">
        <header className="adopt-header">
          <div className="title-section">
            <h1 className="main-title1">Find Your Bestfriend</h1>
            <p className="main-subtitle">Choose the pet you want to spend your life with.</p>
          </div>
          
          <div className="sticky-filter-container">
            <div className="filter-bar">
              {['All Pets', 'Dog', 'Cat'].map((type) => (
                <button 
                  key={type}
                  className={`filter-btn ${activeFilter === type ? 'active-filter' : ''}`}
                  onClick={() => setActiveFilter(type)}
                >
                  {type}
                </button>
              ))}
              <div className="dropdown-filter">
                <span>Choose Breed</span>
                <span className="dropdown-arrow">🡫</span>
              </div>
            </div>
          </div>
        </header>

        <div className="pet-grid">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading fuzzy friends...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p className="error-message">{error}</p>
              <button onClick={() => window.location.reload()} className="retry-btn">Try Again</button>
            </div>
          ) : filteredPets.length > 0 ? (
            filteredPets.map(pet => (
              <PetCard key={pet.pId || pet.id} pet={pet} />
            ))
          ) : (
            <p className="no-pets-message">No pets found for this category.</p>
          )}
        </div>

        {/* UPDATED: Floating Form Button with onClick */}
        <button 
          className="floating-app-btn" 
          title="View My Applications"
          onClick={() => setShowAppList(true)}
        >
          <span className="app-icon-text">Form</span>
        </button>

        {/* NEW: Application List Modal Component */}
        <ApplicationListModal 
          isOpen={showAppList} 
          onClose={() => setShowAppList(false)} 
        />
      </main>
    </div>
  );
};

export default Adopt;