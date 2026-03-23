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
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/pets/my-pets', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json' 
          }
        });
        setPets(response.data);
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
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
    <div className="user-home-page-root">
      <div className="user-home-content">
        
        {/* Modern Header Section */}
        <header className="uh-header">
          <div className="uh-title-area animate-slide-up">
            <h1 className="uh-main-title">My Furry Family</h1>
            <p className="uh-subtitle">Take a look at the pets you've welcomed home.</p>
          </div>
          
          <div className="uh-filter-bar animate-slide-up" style={{animationDelay: '0.1s'}}>
            {['All Pets', 'Dog', 'Cat'].map((type) => (
              <button 
                key={type}
                className={`uh-filter-btn ${activeFilter === type ? 'uh-btn-active' : ''}`}
                onClick={() => setActiveFilter(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </header>

        {/* Pet Grid Section */}
        <div className="uh-pet-grid animate-slide-up" style={{animationDelay: '0.2s'}}>
          {loading ? (
            <div className="uh-loading-msg"><p>Loading your family...</p></div>
          ) : error ? (
            <div className="uh-error-msg"><p>{error}</p></div>
          ) : filteredPets.length > 0 ? (
            filteredPets.map(pet => (
              <PetCard key={pet.pId || pet.id} pet={pet} />
            ))
          ) : (
            <div className="uh-empty-msg">
              <p>You haven't adopted any pets yet</p>
            </div>
          )}
        </div>

        {/* Announcement Section */}
        <div className="uh-announcement-container animate-slide-up" style={{animationDelay: '0.3s'}}>
          <div className="uh-announcement-glass">
            <div className="uh-announcement-tag">Announcement</div>
            <div className="uh-announcement-body">
              <h3>Upcoming Advertisement Slot</h3>
              <p>This space is reserved for upcoming pet care tips and community news. Stay tuned! 🐾</p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Home;