import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export default function MyEventsComponent() {
  const [createdEvents, setCreatedEvents] = useState([]);
  const [participatingEvents, setParticipatingEvents] = useState([]);
  const [editingEventId, setEditingEventId] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: '', description: '', date: '', local: '' });

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

  const handleDeleteEvent = async (eventId) => {
    const confirmDelete = window.confirm("Tem certeza que deseja deletar este evento?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://192.168.0.110:3001/event/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setCreatedEvents(createdEvents.filter(event => event._id !== eventId));
    } catch (error) {
      console.error('Erro ao deletar evento:', error);
    }
  };

  const handleEditEvent = (event) => {
    setEditingEventId(event._id);
    setEditFormData({ title: event.title, description: event.description, date: event.date, local: event.local });
  };

  const handleSaveEdit = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://192.168.0.110:3001/event/${eventId}`, editFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setCreatedEvents(createdEvents.map(event => event._id === eventId ? response.data : event));
      setEditingEventId(null);
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
    }
  };

  const handleLeaveEvent = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      await axios.patch(
        `http://192.168.0.110:3001/event/leave/${eventId}`,
        { participant: decodedToken.name },
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
        {createdEvents? (
          <ul>
            {createdEvents.map(event => (
              <li key={event._id}>
                {editingEventId === event._id ? (
                  <div>
                    <input
                      type="text"
                      value={editFormData.title}
                      onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                    />
                    <textarea
                      value={editFormData.description}
                      onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    />
                    <input
                      type="date"
                      value={editFormData.date}
                      onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                    />
                    <input
                      type="text"
                      value={editFormData.local}
                      onChange={(e) => setEditFormData({ ...editFormData, local: e.target.value })}
                    />
                    <button onClick={() => handleSaveEdit(event._id)}>Salvar</button>
                    <button onClick={() => setEditingEventId(null)}>Cancelar</button>
                  </div>
                ) : (
                  <div>
                    <h4>{event.title}</h4>
                    <p>{event.description}</p>
                    <p>{new Date(event.date).toLocaleDateString()}</p>
                    <p>{event.local}</p>
                    <button className='edit-button' onClick={() => handleEditEvent(event)}>Editar</button>
                    <button className='delete-button' onClick={() => handleDeleteEvent(event._id)}>Deletar</button>
                  </div>
                )}
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
