import React, { useState, useEffect } from 'react';
import './index.css';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      // Decode user from token or fetch user info
      // For simplicity, we just assume token exists means logged in
      const savedUser = JSON.parse(localStorage.getItem('user'));
      if (savedUser) setUser(savedUser);
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  if (!token) {
    return <Auth setToken={setToken} setUser={setUser} />;
  }

  return (
    <div className="app-container">
      <Dashboard user={user} setUser={setUser} logout={logout} token={token} />
    </div>
  );
}

export default App;
