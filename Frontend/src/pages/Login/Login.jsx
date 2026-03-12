import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

import cloud from '../../assets/cloud.png';
import paw from '../../assets/paw.png';
import lock from '../../assets/lock.png';
import userIcon from '../../assets/user.png';
import eyeclose from '../../assets/eyeclose.png';
import eyeopen from '../../assets/eyeopen.png';
import arrow from '../../assets/leftarrow.png';
import { NotificationContext } from '../../components/Notification/NotificationContext';

const Login = () => {
  const showNotification = useContext(NotificationContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('username', data.username);
        
        localStorage.setItem('user', JSON.stringify(data)); 
        window.dispatchEvent(new Event('userUpdated'));
        
        showNotification("Welcome back, " + (data.name || data.username) + "! ", "success");

        if (data.role === 'ADMIN') {
          navigate('/admin-dashboard');
        } else {
          navigate('/home'); 
        }
      } else {
        showNotification(data.message || "Invalid credentials!", "error");
      }
    } catch (error) {
      console.error("Login Error:", error);
      showNotification("Server is down! Try again later. ⚠️", "error");
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
        <span className="slogan-text">Welcome! are you ready to adopt? &lt;3</span>
      </div>

      <div className="login-panel">
        <img className="user-icon-top" src={paw} alt="user icon" />
        <h1 className="login-header">Login</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="reg-input-wrapper">
            <img src={userIcon} alt="user" className="input-icon" />
            <input 
              type="text" 
              name="username"
              placeholder="Username" 
              value={loginData.username}
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
              value={loginData.password}
              onChange={handleChange}
              required
            />
            <img 
              src={showPassword ? eyeopen : eyeclose} 
              alt="toggle" 
              className="eye-icon" 
              onClick={togglePasswordVisibility}
            />
          </div>

          <button type="submit" className="signup-btn">
            <span className="signup-btn-text">.Sign In.</span>
          </button>
        </form>

        <div className="redirect-section">
          <p className="redirect-text">Don't have an account?</p>
          <Link to="/register" className="signin-link">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;