import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login, SignUp, Event, MyEvents, CreateEvent, EventDetail } from './pages/Index';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/event" element={<Event />} />
        <Route path="/event/:id" element={<EventDetail />} />
        <Route path="/myevents" element={<MyEvents />} />
        <Route path="/createevent" element={<CreateEvent />} />
      </Routes>
    </Router>
  );
}
