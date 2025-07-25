import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LogoutButton.css'
const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {

    //  clear all localStorage
     localStorage.clear();

    // Navigate to login or home page
    navigate('/login');
  };

  return (
    <button className="btn logout" onClick={handleLogout}>
      LogOut
    </button>
  );
};

export default LogoutButton;