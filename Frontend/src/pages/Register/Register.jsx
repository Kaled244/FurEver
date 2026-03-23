import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

import catsBg from '../../assets/Cats.jpg';
import lock from '../../assets/lock.png';
import user from '../../assets/user.png';
import email from '../../assets/email.png';
import locationIcon from '../../assets/location.png'; 
import eyeclose from '../../assets/eyeclose.png';
import eyeopen from '../../assets/eyeopen.png';
import arrow from '../../assets/leftarrow.png';
import { NotificationContext } from '../../components/Notification/NotificationContext';

const Register = () => {
  const showNotification = useContext(NotificationContext);
  const navigate = useNavigate(); 
  
  const [showPassword, setShowPassword] = useState(false);
  
  const initialFormState = {
    name: '',
    l_name: '',
    username: '',
    password: '',
    address: '',
    email: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const textResponse = await response.text();
   
      let data = {};
      if (textResponse) {
          try {
              data = JSON.parse(textResponse);
          // eslint-disable-next-line no-unused-vars
          } catch (jsonError) {
              console.error("Server crashed and returned:", textResponse);
          }
      }

      if (response.ok) {
        showNotification("Welcome to the FurEver family!", "success");
        setFormData(initialFormState);
        navigate('/login'); 
      } else {
        // Fallback message if the server didn't send a proper error JSON
        showNotification(data.message || `Server Error: ${response.status}`, "error");
      }
    } catch (error) {
      console.error("Connection Error:", error);
      showNotification("Server is down! Try again later.", "error");
    }
  };

  return (
    <div className="main-container">

      <Link to="/" className="back-arrow-link">
        <img src={arrow} alt="back" className="back-arrow-img" />
      </Link>

      {/* --- LEFT SIDE IMAGE CONTAINER --- */}
      <div className="left-side-image">
        <img src={catsBg} alt="Beautiful cats waiting for adoption" className="cats-bg-img" />
        
        <div className="slogan-container">
          <span className="slogan-text">Create and be part of the fur-family &lt;3</span>
        </div>
      </div>

      <div className="login-panel">
        <h1 className="login-header">CREATE AN ACCOUNT</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-input-wrapper animate-slide-up" style={{animationDelay: '0.1s'}}>
            <img src={user} alt="user" className="input-icon" />
            <input 
              type="text" 
              name="name" 
              placeholder="First Name" 
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="login-input-wrapper animate-slide-up" style={{animationDelay: '0.15s'}}>
            <img src={user} alt="last name" className="input-icon" />
            <input 
              type="text" 
              name="l_name"
              placeholder="Last Name" 
              value={formData.l_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="login-input-wrapper animate-slide-up" style={{animationDelay: '0.2s'}}>
            <img src={user} alt="username" className="input-icon" />
            <input 
              type="text" 
              name="username" 
              placeholder="Username" 
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="login-input-wrapper animate-slide-up" style={{animationDelay: '0.25s'}}>
            <img src={lock} alt="lock" className="input-icon" />
            <input 
              type={showPassword ? "text" : "password"} 
              name="password"
              placeholder="Password" 
              value={formData.password}
              onChange={handleChange}
              required
            />
            <img 
              src={showPassword ? eyeopen : eyeclose} 
              alt="toggle visibility" 
              className="eye-icon" 
              onClick={togglePasswordVisibility}
            />
          </div>

          <div className="login-input-wrapper animate-slide-up" style={{animationDelay: '0.3s'}}>
            <img src={locationIcon} alt="address" className="input-icon" />
            <input 
              type="text" 
              name="address"
              placeholder="Address" 
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="login-input-wrapper animate-slide-up" style={{animationDelay: '0.35s'}}>
            <img src={email} alt="email" className="input-icon" />
            <input 
              type="email" 
              name="email"
              placeholder="Email" 
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="signin-btn animate-slide-up" style={{animationDelay: '0.4s'}}>
            <span>Sign Up</span>
          </button>
        </form>

        <div className="redirect-section animate-slide-up" style={{animationDelay: '0.45s'}}>
          <p className="redirect-text">Already have an account?</p>
          <Link to="/login" className="signup-link">Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;