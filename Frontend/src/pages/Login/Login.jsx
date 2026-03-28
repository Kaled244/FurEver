import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { API_ENDPOINTS } from '../../api/config';

import dogsBg from '../../assets/Dogs.jpg';
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
      const response = await fetch(API_ENDPOINTS.AUTH_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        // Handle the nested ApiResponse format (data.data) or fallback to flat structure
        const authData = data.data ? data.data : data;

        localStorage.setItem('token', authData.token);
        localStorage.setItem('role', authData.role);
        localStorage.setItem('username', authData.username);
        
        localStorage.setItem('user', JSON.stringify(authData)); 
        window.dispatchEvent(new Event('userUpdated'));
        
        showNotification("Welcome back, " + (authData.name || authData.username) + "! ", "success");

        if (authData.role === 'ADMIN') {
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

      <Link to="/" className="back-arrow-link">
        <img src={arrow} alt="back" className="back-arrow-img" />
      </Link>

      <div className="left-side-image">
        <img src={dogsBg} alt="Happy dogs waiting for adoption" className="dogs-bg-img" />
        
        <div className="slogan-container">
          <span className="slogan-text">Welcome! Are you ready to adopt? &lt;3</span>
        </div>
      </div>

      <div className="login-panel">
        <h1 className="login-header">WELCOME BACK</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          {/* FIXED: Changed to login-input-wrapper */}
          <div className="login-input-wrapper animate-slide-up" style={{animationDelay: '0.1s'}}>
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

          {/* FIXED: Changed to login-input-wrapper */}
          <div className="login-input-wrapper animate-slide-up" style={{animationDelay: '0.2s'}}>
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

          {/* FIXED: Changed to signin-btn */}
          <button type="submit" className="signin-btn animate-slide-up" style={{animationDelay: '0.3s'}}>
            <span>Log In</span>
          </button>
        </form>

        <div className="redirect-section animate-slide-up" style={{animationDelay: '0.4s'}}>
          <p className="redirect-text">Don't have an account?</p>
          {/* FIXED: Changed to signup-link */}
          <Link to="/register" className="signup-link">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;