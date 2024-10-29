import axios from "axios";

const API_URL = "http://localhost:5000/api";

//Login
export const loginAdmin = (loginData) => axios.post(`${API_URL}/login`, loginData);

// Get all events
export const APIgetEvents = () => axios.get(`${API_URL}/events`);

// Get a single event by ID
export const APIgetEventById = (id) => axios.get(`${API_URL}/events/${id}`);

// Create a new event
export const APIcreateEvent = (eventData) => axios.post(`${API_URL}/events`, eventData);

// Update an event
export const APIupdateEvent = (id, updatedEvent) => axios.patch(`${API_URL}/events/${id}`, updatedEvent);

// Delete an event
export const APIdeleteEvent = (id) => axios.delete(`${API_URL}/events/${id}`);

// Add a participant to an event
export const APIaddParticipant = (id, participantData) => axios.patch(`${API_URL}/events/${id}/participants`, participantData);

// Remove a participant from an event
export const APIremoveParticipant = (id, participantData) => axios.patch(`${API_URL}/events/${id}/participants/remove`, participantData);
