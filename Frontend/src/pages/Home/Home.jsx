import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Heart,
  Users,
  ChevronRight,
  PawPrint,
  Sparkles,
  Search
} from "lucide-react";
import AdoptedPetCard from "../../components/AdoptedPet/AdoptedPet";
import "./Home.css";

const HomeDropdown = ({ label, options, selected, onSelect }) => {
  const detailsRef = useRef(null);

  const handleItemClick = (option) => {
    onSelect(option);
    if (detailsRef.current) {
      detailsRef.current.removeAttribute("open");
    }
  };

  return (
    <details className="user-home-dropdown" ref={detailsRef}>
      <summary role="button">
        <span className={`uh-dropdown-trigger ${selected ? "uh-btn-active" : ""}`}>
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
  const [activeFilter, setActiveFilter] = useState("All Pets");
  const [announcements, setAnnouncements] = useState([]);
  const [stats, setStats] = useState({
    totalAdopted: 0,
    activeMembers: 0,
    successStories: 0,
  });

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        // 1. Fetch My Pets 
        const petsResponse = await axios.get(`${BASE_URL}/api/pets/my-pets`, config);
        
        // DEBUG: If you see [] here, your backend query is too restrictive!
        console.log("My Pets API Response:", petsResponse.data);

        const petData = petsResponse.data.data || petsResponse.data;
        setPets(Array.isArray(petData) ? petData : []);

        // 2. Fetch Global Stats
        const statsResponse = await axios.get(`${BASE_URL}/api/stats/dashboard`, config);
        const statsData = statsResponse.data.data || statsResponse.data;
        if (statsData) {
          setStats(statsData);
        }

      } catch (err) {
        console.error("❌ Dashboard Load Error:", err);
        setError("Failed to load your pet family.");
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
          description: "This sweet Golden Retriever mix was found abandoned near the shelter. Needs a temporary foster or forever home ASAP! He loves kids, other dogs, and playing fetch.",
          images: [
            "https://images.dog.ceo/breeds/retriever-golden/n02099601_3004.jpg",
            "https://images.dog.ceo/breeds/retriever-golden/n02099601_2691.jpg"
          ],
        },
        {
          id: 2,
          tag: "SUCCESS STORY",
          author: "Admin Sarah",
          date: "5 hours ago",
          description: "Max finally found his forever home! ❤️ After waiting 8 months at our shelter, he has officially been adopted by the wonderful Miller family. Have a great life, Max!",
          images: ["https://preview.redd.it/zfmbxrsdfpj91.jpg?auto=webp&s=7eb1eaffe0ae5884a4e5e9d8060c940e1f6a8fe5"],
        },
        {
          id: 3,
          tag: "PET CARE TIP",
          author: "Dr. Emily",
          date: "1 day ago",
          description: "Summer is here! Don't forget that asphalt gets extremely hot for your pet's paws during midday. Walk them early morning or late evening, and always bring water.",
          images: [
             "https://tse2.mm.bing.net/th/id/OIP.WIu8ITTCow1Fl2GVGSASvAHaGK?pid=Api&P=0&h=180",
             "https://animalsbreeds.com/wp-content/uploads/2014/07/Pug-2.jpg"
          ],
        },
        {
          id: 4,
          tag: "EVENT",
          author: "Admin Kyle",
          date: "2 days ago",
          description: "Join us this weekend for the FurEver Pet Carnival! We'll have food, games, and lots of lovely pets waiting to meet you. Entry is free.",
          images: [],
        }
      ]);
    };

    fetchDashboardData();
    fetchAnnouncements();
  }, []);

  // Filter Logic - Using optional chaining to prevent crashes
  const filteredPets = pets.filter((pet) => {
    if (activeFilter === "All Pets") return true;
    const species = pet?.pSpecies || pet?.p_species || pet?.species;
    return species?.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <div className="user-home-page-root">
      <div className="user-home-content">
        <div className="uh-main-feed">
          
          <header className="uh-header">
            <div className="uh-title-area animate-slide-up">
              <h1 className="uh-main-title">My <span>Furry Family</span></h1>
              <p className="uh-subtitle">Take a look at the pets you've welcomed home.</p>
            </div>

            <div className="uh-filter-bar animate-slide-up">
              <button
                className={`uh-filter-btn ${activeFilter === "All Pets" ? "uh-btn-active" : ""}`}
                onClick={() => setActiveFilter("All Pets")}
              >
                All Pets
              </button>
              <HomeDropdown
                label="Choose Species"
                options={["Dog", "Cat", "Rabbit", "Bird"]}
                selected={activeFilter === "All Pets" ? "" : activeFilter}
                onSelect={setActiveFilter}
              />
            </div>
          </header>

          <div className="uh-pet-grid animate-slide-up">
            {loading ? (
              <div className="uh-loading-msg"><p>Grooming the data...</p></div>
            ) : error ? (
              <div className="uh-error-msg"><p>{error}</p></div>
            ) : filteredPets.length > 0 ? (
              filteredPets.map((pet) => (
                <AdoptedPetCard key={pet.pId || pet.id} pet={pet} />
              ))
            ) : (
              <div className="uh-empty-msg">
                <PawPrint size={48} style={{ opacity: 0.1, marginBottom: '15px' }} />
                <p>Your home is ready for a new friend.</p>
              </div>
            )}
          </div>

          <div className="uh-stats-grid animate-slide-up">
            <div className="uh-stat-card">
              <div className="uh-stat-icon heart"><Heart size={24} /></div>
              <div className="uh-stat-content">
                <h3>{stats.totalAdopted}</h3>
                <p>Pets Adopted</p>
              </div>
            </div>
            <div className="uh-stat-card">
              <div className="uh-stat-icon members"><Users size={24} /></div>
              <div className="uh-stat-content">
                <h3>{stats.activeMembers?.toLocaleString() || 0}</h3>
                <p>Active Members</p>
              </div>
            </div>
            <div className="uh-stat-card">
              <div className="uh-stat-icon stories"><Sparkles size={24} /></div>
              <div className="uh-stat-content">
                <h3>{stats.successStories}</h3>
                <p>Success Stories</p>
              </div>
            </div>
          </div>
          
          {/* Announcements Feed */}
          <div className="uh-fyp-container animate-slide-up">
             <div className="uh-fyp-header">
               <h2 className="uh-section-title">Community Updates</h2>
               <p className="uh-section-subtitle">Stay connected with our latest news and rescue stories.</p>
             </div>
             <div className="uh-announcement-feed">
                {announcements.map((post) => (
                  <div key={post.id} className="uh-post-card">
                    <div className="uh-post-header">
                      <span className={`uh-post-tag ${post.tag.includes("URGENT") ? "urgent" : post.tag.includes("SUCCESS") ? "success" : "tip"}`}>{post.tag}</span>
                      <div className="uh-post-meta">
                        <div className="uh-author-avatar">{post.author.charAt(0)}</div>
                        <div className="uh-author-details">
                          <span className="uh-author-name">{post.author}</span>
                          <span className="uh-post-date">{post.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="uh-post-description">{post.description}</p>
                    {post.images && post.images.length > 0 && (
                      <div className={`uh-post-images grid-${Math.min(post.images.length, 3)}`}>
                        {post.images.map((img, idx) => (
                          <div key={idx} className="uh-image-wrapper">
                            <img src={img} alt="update" className="uh-post-img" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;