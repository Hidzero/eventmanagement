import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/styles.css';

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://192.168.0.110:3001/event/${id}`);
        setEvent(response.data);
      } catch (error) {
        console.error('Erro ao buscar evento:', error);
      }
    };

    fetchEvent();
  }, [id]);

  if (!event) {
    return <p>Carregando...</p>;
  }

  return (
    <div className='event-detail'>
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <p>{new Date(event.date).toLocaleDateString()}</p>
      <p>Local: {event.local}</p>
      <p>Organizador: {event.organizer}</p>
      <p>Participantes: {event.participants}</p>
    </div>
  );
}
