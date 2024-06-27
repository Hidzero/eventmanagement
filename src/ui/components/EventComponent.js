import React, { useEffect, useState } from 'react';
import '../styles/styles.css'; 
import axios from 'axios';
import { Link } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

export default function Event() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://192.168.0.110:3001/event');
        setEvents(response.data);
      } catch (error) {
        console.error('Erro ao buscar eventos:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleParticipate = async (eventId) => {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    console.log(decodedToken.name);
    try {
      await axios.patch(`http://192.168.0.110:3001/event/participate/${eventId}`, decodedToken, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    catch (error) {
      console.error('Erro ao participar do evento:', error);
    }
  }



  return (
    <div className='event-container'>
      <h2>Eventos Disponiveis</h2>
      {events.length > 0 ? (
        <ul>
          {events.map(event => (
            <li key={event.id}>
              <Link to={`/event/${event.id}`} className='link'>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <p>{new Date(event.date).toLocaleDateString()}</p>
              </Link>
                <button className='event-button' onClick={() => handleParticipate(event._id)}>Participar</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum evento encontrado.</p>
      )}
    </div>
  );
}
