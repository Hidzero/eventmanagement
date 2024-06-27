import React, { useState } from 'react';
import '../styles/styles.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    
    const data = {
      email,
      password,
    };

    try {
      const res = await axios.post('http://192.168.0.110:3001/user/login', data);
      const token = res.data.data.token;
      const user = res.data.data.user;
      console.log(token, user);

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      try {
        await axios.post('http://192.168.0.110:3001/user/private', data, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        alert('Logado com sucesso!');
        navigate('/event');
      } catch (error) {
        console.error('Erro:', error);
        alert('Usuário ou senha inválida.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao autenticar.');
    }
  }

  return (
    <div className='container'>
      <div className='login-container'>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
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
          <button className='button' type='submit'>Login</button>
        </form>
        <Link to='/signup' className='create-account'>Create account</Link>
      </div>
    </div>
  );
}
