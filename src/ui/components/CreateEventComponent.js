import React, { useState } from 'react';
import '../styles/styles.css'; 
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export default function CreateEventComponent() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [local, setLocal] = useState('');

  function getLoggedUser() {
    const token = localStorage.getItem('token');
    if (!token) return null;
  
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken;
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      return null;
    }
  }

  const loggedUser = getLoggedUser();

  async function createEvent(e) {
    e.preventDefault();

    const newEvent = {
      title,
      description,
      date,
      local,
      organizer: loggedUser.name,
    };

    try {
      const response = await axios.post('http://192.168.0.110:3001/event', newEvent);
      if (response.status === 201) {
        setTitle('');
        setDescription('');
        setDate('');
        setLocal('');
        alert('Evento criado com sucesso!');
      } else {
        alert('Erro ao criar evento.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao criar evento.');
    }
  };

  return (
    <div className="container-form">
    <form className="create-event-form" onSubmit={createEvent}>
      <h2>Criar Evento</h2>
      <label>
        Título:
        <input
          className='input'
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </label>
      <label>
        Descrição:
        <textarea
          className='input'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
      </label>
      <label>
        Data:
        <input
          className='input'
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </label>
      <label>
        Local:
        <input
          className='input'
          type="text"
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          required
        />
      </label>
      <button className='button' type="submit">Criar Evento</button>
    </form>
    </div>
  );
}
