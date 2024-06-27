import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/styles.css';

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <header className="header">
      <div className="logo">LOGO</div>
      <nav className="nav">
        <Link className='header-button' to="/event">Eventos</Link>
        <Link className='header-button' to="/myevents">Meus Eventos</Link>
        <Link className='header-button' to="/createevent">Criar Eventos</Link>
        <button className='header-button' onClick={handleLogout}>Sair</button>
      </nav>
    </header>
  );
}
