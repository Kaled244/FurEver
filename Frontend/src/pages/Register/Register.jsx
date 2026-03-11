import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

import cloud from '../../assets/cloud.png';
import paw from '../../assets/paw.png';
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
      
      const data = await response.json();

      if (response.ok) {
        // Use your cool new notification!
        showNotification("Welcome to the FurEver family!", "success");
        
        setFormData(initialFormState);
        navigate('/login'); 
      } else {
        // Handle specific backend error messages
        showNotification(data.message || "Oops! That username might be taken.", "error");
      }
    } catch (error) {
      console.error("Connection Error:", error);
      showNotification("Server is down! Try again later.", "error");
    }
  };

  return (
    <div className="main-container">
      <div className="top-logo">FurEver</div>

      <Link to="/" className="back-arrow-link">
        <img src={arrow} alt="back" className="back-arrow-img" />
      </Link>

      <div className="hero-section1">
          <div className="hero-title1">FurEver</div>
          <img className="img-cloud1-large" src={cloud} alt="cloud" />
          <img className="img-cloud1-main" src={cloud} alt="cloud" />
          <img className="img-cloud1-small" src={cloud} alt="cloud" />
          <img className="img-paw1-small" src={paw} alt="paw" />
          <img className="img-cloud1-wide" src={cloud} alt="cloud" />
          <img className="img-cloud1-medium" src={cloud} alt="cloud" />
      </div>   
  
      <div className="slogan-container">
        <span className="slogan-text">Create and be part of the fur-family &lt;3</span>
      </div>

      <div className="register-panel">
        <img className="user-icon-top" src={paw} alt="paw icon" />
        <h1 className="register-header">Register</h1>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="reg-input-wrapper">
            <img src={user} alt="user" className="input-icon" />
            <input 
              type="text" 
              name="name" 
              placeholder="Name" 
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="reg-input-wrapper">
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

          <div className="reg-input-wrapper">
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

          <div className="reg-input-wrapper">
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

          <div className="reg-input-wrapper">
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

          <button type="submit" className="signup-btn">
            <span className="signup-btn-text">.Sign Up.</span>
          </button>
        </form>

        <div className="redirect-section">
          <p>Already have an account?</p>
          <Link to="/login" className="signin-link">Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;