import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/NavSidebar/Sidebar';
import Profile from './pages/Profile/Profile';
import Adopt from './pages/Adopt/Adopt';
import Index from './pages/Index/Index';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Home from './pages/Home/Home';

const AppContent = () => {
  const location = useLocation();
  const noSidebarPaths = ["/", "/login", "/register"];
  const showSidebar = !noSidebarPaths.includes(location.pathname);

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar only appears on Home, Adopt, Profile, etc. */}
      {showSidebar && <Sidebar />} 
      
      <div style={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/adopt" element={<Adopt />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<div>About Us Page Coming Soon</div>} />
          <Route path="/help" element={<div>Help Page Coming Soon</div>} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;