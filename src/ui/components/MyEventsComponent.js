import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function MyEventsComponent() {
  const [createdEvents, setCreatedEvents] = useState([]);
  const [participatingEvents, setParticipatingEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyEvents = async () => {
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      try {
        const response = await axios.get(`http://192.168.0.110:3001/event/${decodedToken.name}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const responsePart = await axios.get(`http://192.168.0.110:3001/event/participant/${decodedToken.name}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCreatedEvents(response.data);
        setParticipatingEvents(responsePart.data);
      } catch (error) {
        console.error('Erro ao buscar eventos:', error);
      }
    };

    fetchMyEvents();
  }, []);

  const handleEditEvent = (eventId) => {
    navigate(`/edit-event/${eventId}`);
  };

  const handleLeaveEvent = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://192.168.0.110:3001/event/leave/${eventId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setParticipatingEvents(participatingEvents.filter(event => event._id !== eventId));
    } catch (error) {
      console.error('Erro ao sair do evento:', error);
    }
  };

  return (
    <div className='my-events-container'>
      <h2>Meus Eventos</h2>
      <div className='created-events'>
        <h3>Eventos Criados por Mim</h3>
        {createdEvents ? (
          <ul>
            {createdEvents.map(event => (
              <li key={event._id}>
                <h4>{event.title}</h4>
                <p>{event.description}</p>
                <p>{new Date(event.date).toLocaleDateString()}</p>
                <button onClick={() => handleEditEvent(event._id)}>Editar</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Você ainda não criou nenhum evento.</p>
        )}
      </div>
      <div className='participating-events'>
        <h3>Eventos que Estou Participando</h3>
        {participatingEvents ? (
          <ul>
            {participatingEvents.map(event => (
              <li key={event._id}>
                <h4>{event.title}</h4>
                <p>{event.description}</p>
                <p>{new Date(event.date).toLocaleDateString()}</p>
                <button onClick={() => handleLeaveEvent(event._id)}>Sair do Evento</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Você ainda não está participando de nenhum evento.</p>
        )}
      </div>
    </div>
  );
}
