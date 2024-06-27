import React, { useState } from 'react';
import '../styles/styles.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate(); // Usando o hook useNavigate

  async function handleLogin(e) {
    e.preventDefault();

    const newUser = {
      name,
      password,
      email
    };

    try {
      const response = await axios.post('http://192.168.0.110:3001/user', newUser);
      
      if (response.status === 201) {
        alert('Usuário criado com sucesso!');
        navigate('/login'); 
      } else {
        alert('Erro ao criar.');
      }
    }
    catch (error) {
      console.error('Erro:', error);
      alert('Este usuário já existe.');
    }
  }

  return (
    <div className='container'>
      <div className='login-container'>
        <h2>Sign Up</h2>
        <input 
          className='input' 
          type='text' 
          placeholder='Username' 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required
        />
        <input 
          className='input' 
          type='text' 
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input 
          className='input' 
          type='password' 
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input 
          className='input' 
          type='password' 
          placeholder='Confirm Password'
          required
        />
        <button className='button' onClick={handleLogin}>Create Account</button>
      </div>
    </div>
  );
}
