import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import PetCard from '../../components/Pet/PetCard';
import { API_ENDPOINTS } from '../../api/config';
import './Adopt.css';

const SPECIES_DATA = {
  'Dog': ['Aspin', 'Golden Retriever', 'Askal', 'Poodle', 'Bulldog', 'Beagle', 'Chihuahua'],
  'Cat': ['Puspin', 'Siamese', 'Persian', 'Maine Coon', 'Bengal', 'Munchkin', 'Tabby'],
  'Rabbit': ['Dutch', 'Lionhead', 'Rex', 'Netherland Dwarf'],
  'Bird': ['Parrot', 'Canary', 'Lovebird', 'Cockatiel', 'African Grey']
};

const AdoptDropdown = ({ label, options, selected, onSelect, disabled }) => {
  const detailsRef = useRef(null);

  const handleItemClick = (option) => {
    onSelect(option);
    if (detailsRef.current) {
      detailsRef.current.removeAttribute('open');
    }
  };

  // If there is text in 'selected' (like "Dog"), we grab the active class
  const activeClass = selected ? 'ua-btn-active' : '';

  return (
    <details 
      className={`user-adopt-dropdown ${disabled ? 'ua-disabled' : ''}`} 
      ref={detailsRef}
    >
      <summary role="button" onClick={(e) => disabled && e.preventDefault()}>
        {/* The active class is injected right here into the trigger */}
        <span className={`ua-dropdown-trigger ${activeClass}`}>
          {selected || label}
        </span>
      </summary>
      <ul className="ua-dropdown-menu">
        {options.map((option, index) => (
          <li key={index}>
            <button onClick={() => handleItemClick(option)}>{option}</button>
          </li>
        ))}
      </ul>
    </details>
  );
};

const Adopt = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    species: 'All Pets',
    breed: 'All Breeds'
  });

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        // eslint-disable-next-line no-undef
        const response = await axios.get(API_ENDPOINTS.PETS_GET_ALL);
        setPets(response.data);
      } catch (error) {
        console.error("Failed to fetch pets:", error);
        setError('Cannot connect to server.');
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, []);

  const handleSpeciesChange = (val) => setFilters({ species: val, breed: 'All Breeds' });
  const handleBreedChange = (val) => setFilters(prev => ({ ...prev, breed: val }));

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
    <div className="user-adopt-page-wrapper">
      <div className="user-adopt-main-content">
        
        <header className="user-adopt-header">
          <div className="ua-title-section animate-slide-up">
            <h1 className="ua-main-title">Find Your Bestfriend</h1>
            <p className="ua-main-subtitle">Choose the pet you want to spend your life with.</p>
          </div>
          
          <div className="ua-filter-bar animate-slide-up">
            <button 
              className={`ua-filter-btn ${filters.species === 'All Pets' ? 'ua-btn-active' : ''}`}
              onClick={() => setFilters({ species: 'All Pets', breed: 'All Breeds' })}
            >
              All Pets
            </button>

            <AdoptDropdown 
              label="Choose Species"
              options={['All Pets', ...Object.keys(SPECIES_DATA)]}
              selected={filters.species === 'All Pets' ? '' : filters.species}
              onSelect={handleSpeciesChange}
            />

            <AdoptDropdown 
              label="Choose Breed"
              options={['All Breeds', ...(filters.species !== 'All Pets' ? SPECIES_DATA[filters.species] : [])]}
              selected={filters.breed === 'All Breeds' ? '' : filters.breed}
              onSelect={handleBreedChange}
              disabled={filters.species === 'All Pets'}
            />
          </div>
        </header>

        <div className="user-adopt-grid animate-slide-up">
          {loading ? (
            <div className="ua-loading">Loading fuzzy friends...</div>
          ) : error ? (
            <div className="ua-error">{error}</div>
          ) : filteredPets.length > 0 ? (
            filteredPets.map(pet => <PetCard key={pet.pId || pet.id} pet={pet} />)
          ) : (
            <p className="ua-empty-msg">No pets found for this category.</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Adopt;