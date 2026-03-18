import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import PetCard from '../../components/Pet/PetCard';
import ApplicationListModal from '../../components/Pet/ApplicationListModal';
import './Adopt.css';

// --- DATA MAPPING ---
const SPECIES_DATA = {
  'Dog': ['Aspin', 'Golden Retriever', 'Askal', 'Poodle', 'Bulldog', 'Beagle', 'Chihuahua'],
  'Cat': ['Puspin', 'Siamese', 'Persian', 'Maine Coon', 'Bengal', 'Munchkin', 'Tabby'],
  'Rabbit': ['Dutch', 'Lionhead', 'Rex', 'Netherland Dwarf'],
  'Bird': ['Parrot', 'Canary', 'Lovebird', 'Cockatiel', 'African Grey']
};

// --- NEW DROPDOWN COMPONENT (Inspired by Pure CSS) ---
const AdoptDropdown = ({ label, options, selected, onSelect, disabled }) => {
  const detailsRef = useRef(null);

  const handleItemClick = (option) => {
    onSelect(option);
    // Force close the details tag after selection
    if (detailsRef.current) {
      detailsRef.current.removeAttribute('open');
    }
  };

  return (
    <details 
      className={`custom-dropdown ${disabled ? 'disabled' : ''}`} 
      ref={detailsRef}
    >
      <summary role="button" onClick={(e) => disabled && e.preventDefault()}>
        <span className="dropdown-button-styled">
          {selected || label}
        </span>
      </summary>
      <ul>
        {options.map((option, index) => (
          <li key={index}>
            <button onClick={() => handleItemClick(option)}>{option}</button>
          </li>
        ))}
      </ul>
    </details>
  );
};

// --- MAIN ADOPT COMPONENT ---
const Adopt = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAppList, setShowAppList] = useState(false);

  const [filters, setFilters] = useState({
    species: 'All Pets',
    breed: 'All Breeds'
  });

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('http://localhost:8080/api/pets', {
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

  const handleSpeciesChange = (selectedSpecies) => {
    setFilters({
      species: selectedSpecies,
      breed: 'All Breeds'
    });
  };

  const handleBreedChange = (selectedBreed) => {
    setFilters(prev => ({ ...prev, breed: selectedBreed }));
  };

  const filteredPets = pets.filter(pet => {
    const status = (pet.pStatus || pet.p_status)?.toLowerCase();
    if (status !== 'available') return false;

    const petSpecies = (pet.pSpecies || pet.p_species)?.toLowerCase();
    const petBreed = (pet.pBreed || pet.p_breed)?.toLowerCase();

    const matchesSpecies = filters.species === 'All Pets' || petSpecies === filters.species.toLowerCase();
    const matchesBreed = filters.breed === 'All Breeds' || petBreed === filters.breed.toLowerCase();

    return matchesSpecies && matchesBreed;
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
              {/* Reset Button */}
              <button 
                className={`filter-btn ${filters.species === 'All Pets' ? 'active-filter' : ''}`}
                onClick={() => setFilters({ species: 'All Pets', breed: 'All Breeds' })}
              >
                All Pets
              </button>

              {/* Species Dropdown */}
              <AdoptDropdown 
                label="Choose Species"
                options={['All Pets', ...Object.keys(SPECIES_DATA)]}
                selected={filters.species === 'All Pets' ? '' : filters.species}
                onSelect={handleSpeciesChange}
              />

              {/* Breed Dropdown */}
              <AdoptDropdown 
                label="Choose Breed"
                options={['All Breeds', ...(filters.species !== 'All Pets' ? SPECIES_DATA[filters.species] : [])]}
                selected={filters.breed === 'All Breeds' ? '' : filters.breed}
                onSelect={handleBreedChange}
                disabled={filters.species === 'All Pets'}
              />
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
            <p className="no-pets-message">No {filters.species !== 'All Pets' ? filters.species : ''} pets found for this category.</p>
          )}
        </div>

        <button 
          className="floating-app-btn" 
          title="View My Applications"
          onClick={() => setShowAppList(true)}
        >
          <span className="app-icon-text">Form</span>
        </button>

        <ApplicationListModal 
          isOpen={showAppList} 
          onClose={() => setShowAppList(false)} 
        />
      </main>
    </div>
  );
};

export default Adopt;