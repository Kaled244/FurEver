import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PetCard from '../../components/Pet/PetCard';
import './Home.css';

const Home = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All Pets');

  useEffect(() => {
    const fetchMyPets = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');

        const response = await axios.get('http://localhost:8080/api/pets/my-pets', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json' 
          }
        });
        
        setPets(response.data);
      } catch (error) {
        console.error("❌ Fetch Error:", error);
        setError('Failed to load your pets. Make sure you are logged in!');
      } finally {
        setLoading(false);
      }
    };
    fetchMyPets();
  }, []);

  const filteredPets = pets.filter(pet => {
    if (activeFilter === 'All Pets') return true;
    const species = pet.pSpecies || pet.p_species;
    return species?.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <div className="home-page">
      <main className="main-content">
        <header className="home-header">
          <div className="title-section">
            <h1 className="main-title1">My Furry Family</h1>
            <p className="main-subtitle">Take a look at the pets you've welcomed home.</p>
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
            </div>
          </div>
        </header>

        <div className="pet-grid">
          {loading ? (
            <div className="loading-state"><p>Loading your family...</p></div>
          ) : error ? (
            <div className="error-state"><p>{error}</p></div>
          ) : filteredPets.length > 0 ? (
            filteredPets.map(pet => (
              <PetCard key={pet.pId || pet.id} pet={pet} />
            ))
          ) : (
            <div className="no-pets-message">
              <p>You haven't adopted any pets yet, go find your bestfriend</p>
            </div>
          )}
        </div>

        <div className="announcement-container">
          <div className="announcement-tag">Announcement</div>
          <div className="announcement-body">
            <h3>Upcoming Advertisement Slot</h3>
            <p>This space is reserved for upcoming pet care tips and community news. stay tuned! 🐾</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;