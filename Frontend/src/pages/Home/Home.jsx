import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MessageSquare, Send, Circle, X } from 'lucide-react'; 
import PetCard from '../../components/Pet/PetCard';
import './Home.css';

const HomeDropdown = ({ label, options, selected, onSelect }) => {
  const detailsRef = useRef(null);

  const handleItemClick = (option) => {
    onSelect(option);
    if (detailsRef.current) {
      detailsRef.current.removeAttribute('open');
    }
  };

  const activeClass = selected ? 'uh-btn-active' : '';

  return (
    <details className="user-home-dropdown" ref={detailsRef}>
      <summary role="button">
        <span className={`uh-dropdown-trigger ${activeClass}`}>
          {selected || label}
        </span>
      </summary>
      <ul className="uh-dropdown-menu">
        {options.map((option, index) => (
          <li key={index}>
            <button onClick={() => handleItemClick(option)}>{option}</button>
          </li>
        ))}
      </ul>
    </details>
  );
};

const Home = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All Pets');
  const [announcements, setAnnouncements] = useState([]);
  
  // NEW: State to control chat visibility
  const [isChatOpen, setIsChatOpen] = useState(true);

  const mockChatUsers = [
    { name: "Sarah J.", status: "online", lastMessage: "How is the new puppy?" },
    { name: "Mike T.", status: "online", lastMessage: "Did you see the urgent post?" },
    { name: "Admin Kyle", status: "offline", lastMessage: "Welcome to FurEver!" }
  ];

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

   const fetchAnnouncements = () => {
      setAnnouncements([
        {
          id: 1,
          tag: "URGENT ADOPTER NEEDED",
          author: "Admin Kyle",
          date: "2 hours ago",
          description: "This sweet Golden Retriever mix was found abandoned near the shelter this morning. He is very timid but incredibly gentle. Needs a loving home ASAP before the shelter reaches full capacity this weekend!",
          images: ["https://images.dog.ceo/breeds/retriever-golden/n02099601_3004.jpg"] // 1 Image (Working Dog API link)
        },
        {
          id: 2,
          tag: "SUCCESS STORY",
          author: "Admin Sarah",
          date: "5 hours ago",
          description: "Remember Max, the senior Beagle who was with us for over a year? He finally found his forever home! His new family sent us this beautiful photo of him enjoying his new backyard. Thank you to everyone who shared his post! ❤️",
          images: ["https://images.dog.ceo/breeds/beagle/n02088364_12702.jpg"] // 1 Image (Working Dog API link)
        },
        {
          id: 3,
          tag: "COMMUNITY UPDATE",
          author: "Admin Sarah",
          date: "Yesterday",
          description: "We just rescued a bonded pair of kittens! They must be adopted together. They are fully vaccinated and ready to bring double the joy to your home.",
          images: [
            "https://cdn2.thecatapi.com/images/MTY3ODIyMQ.jpg", // 2 Images (Working Cat API links)
            "https://cdn2.thecatapi.com/images/0XYvRd7oD.jpg"
          ]
        },
        {
          id: 4,
          tag: "SHELTER NEEDS",
          author: "Volunteer Mark",
          date: "2 days ago",
          description: "We are running dangerously low on kitten formula, puppy pads, and wet food! If you are able to help, please drop by the shelter this weekend. Every little bit helps our tiniest rescues keep their bellies full.",
          images: [] // Testing the text-only layout without images
        },
        {
          id: 5,
          tag: "PET CARE TIP",
          author: "Dr. Emily (Head Vet)",
          date: "3 days ago",
          description: "Summer is approaching! ☀️ Please remember that pavement gets incredibly hot for your dog's paws. Test the asphalt with the back of your hand for 7 seconds—if it's too hot for you, it's too hot for them. Stick to grassy areas or early morning walks.",
          images: ["https://images.dog.ceo/breeds/pug/n02110958_13038.jpg"] // 1 Image (Working Dog API link)
        }
      ]);
    };

    fetchMyPets();
    fetchAnnouncements();
  }, []);

  const filteredPets = pets.filter(pet => {
    if (activeFilter === 'All Pets') return true;
    const species = pet.pSpecies || pet.p_species;
    return species?.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <div className="user-home-page-root">
      <div className="user-home-content">
        
        {/* --- LEFT COLUMN: MAIN FEED --- */}
        <div className="uh-main-feed">
          
          {/* Header now has a high z-index to fix dropdown bug */}
          <header className="uh-header">
            <div className="uh-title-area animate-slide-up">
              <h1 className="uh-main-title">My Furry Family</h1>
              <p className="uh-subtitle">Take a look at the pets you've welcomed home.</p>
            </div>
            
            <div className="uh-filter-bar animate-slide-up" style={{animationDelay: '0.1s'}}>
              <button 
                className={`uh-filter-btn ${activeFilter === 'All Pets' ? 'uh-btn-active' : ''}`}
                onClick={() => setActiveFilter('All Pets')}
              >
                All Pets
              </button>

              <HomeDropdown 
                label="Choose Species"
                options={['All Pets', 'Dog', 'Cat', 'Rabbit', 'Bird']} 
                selected={activeFilter === 'All Pets' ? '' : activeFilter}
                onSelect={setActiveFilter}
              />
            </div>
          </header>

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
                <p>You haven't adopted any pets yet.</p>
              </div>
            )}
          </div>

          {/* --- NEW WRAPPED FYP PANEL --- */}
          <div className="uh-fyp-container animate-slide-up" style={{animationDelay: '0.3s'}}>
            <div className="uh-fyp-header">
              <h2 className="uh-section-title">Community Updates</h2>
              <p className="uh-subtitle">Urgent adoptions and news from our shelter admins.</p>
            </div>

            <div className="uh-announcement-feed">
              {announcements.map((post) => (
                <div key={post.id} className="uh-post-card">
                  <div className="uh-post-header">
                    <span className={`uh-post-tag ${post.tag.includes('URGENT') ? 'urgent' : ''}`}>
                      {post.tag}
                    </span>
                    <div className="uh-post-meta">
                      <strong>{post.author}</strong> • <span>{post.date}</span>
                    </div>
                  </div>

                  <p className="uh-post-description">{post.description}</p>

                  {post.images && post.images.length > 0 && (
                    <div className={`uh-post-images grid-${post.images.length}`}>
                      {post.images.map((img, index) => (
                        <img key={index} src={img} alt="Post attachment" className="uh-post-img" />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: CHAT PANEL --- */}
        {isChatOpen ? (
          <aside className="uh-chat-panel animate-slide-up" style={{animationDelay: '0.2s'}}>
            <div className="uh-chat-header">
              <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                <MessageSquare size={20} />
                <h3>Community Chat</h3>
              </div>
              <button className="uh-chat-close-btn" onClick={() => setIsChatOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="uh-chat-user-list">
              {mockChatUsers.map((chatUser, index) => (
                <div key={index} className="uh-chat-user-item">
                  <div className="uh-chat-avatar">
                    {chatUser.name.charAt(0)}
                    <Circle 
                      size={12} 
                      className={`uh-status-dot ${chatUser.status}`} 
                      fill="currentColor"
                    />
                  </div>
                  <div className="uh-chat-user-info">
                    <h4>{chatUser.name}</h4>
                    <p>{chatUser.lastMessage}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="uh-chat-input-area">
              <input type="text" placeholder="Start a conversation..." disabled />
              <button disabled><Send size={18} /></button>
            </div>
          </aside>
        ) : (
          /* FLOATING BUTTON WHEN CHAT IS CLOSED */
          <button className="uh-chat-fab animate-slide-up" onClick={() => setIsChatOpen(true)}>
            <MessageSquare size={28} />
          </button>
        )}

      </div>
    </div>
  );
};

export default Home;