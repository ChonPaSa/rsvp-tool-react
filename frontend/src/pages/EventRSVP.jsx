import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRSVP, removeRSVP, updateEvent, deleteEvent, fetchEventById, fetchEvents } from "../redux/eventSlice";
import { APIaddParticipant, APIremoveParticipant } from "../utils/api";
import { useParams, useNavigate } from "react-router-dom";
import EventDetails from "../components/EventDetails";
import Participants from "../components/Participants";
import RSVPForm from "../components/RSVPForm";
import NavigationBar from "../layout/NavigationBar";

const EventRSVP = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { eventId } = useParams();
    const { events, user, isAdmin, error } = useSelector((state) => state.events);

    const eventIndex = events.findIndex((event) => event._id === eventId);
    const event = events[eventIndex];

    //Local States
    const [isAttending, setIsAttending] = useState(false);
    const [instrument, setInstrument] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [eventDetails, setEventDetails] = useState({ ...event });
    const [localError, setLocalError] = useState("");

    // Sync local error state with global error from Redux
    useEffect(() => {
        setLocalError(error);
    }, [error]);

    // Manage attendance status and update event details based on event data
    useEffect(() => {
        if (event) {
            const participant = event.participants.find((p) => p.playerName === user);
            if (participant) {
                setIsAttending(true);
                setInstrument(participant.instrument);
            } else {
                setIsAttending(false);
                setInstrument("");
            }

            setEventDetails({
                _id: event._id,
                name: event.name,
                date: event.date,
                time: event.time,
                finish: event.finish,
                location: event.location,
                description: event.description,
                participants: event.participants || [],
            });
        }
    }, [event, user]);

    // Check for event ID validity and fetch the event details if not already available
    useEffect(() => {
        if (!eventId) {
            setLocalError("Event ID ist nicht vorhanden.");
            return;
        }
        if (!event) {
            dispatch(fetchEventById(eventId)).catch((err) => {
                setLocalError("Fehler beim Abrufen des Auftritts. " + err);
            });
        }
    }, [eventId, event, dispatch]);

    /**
     * Handlers
     */
    const handleRSVP = async (e) => {
        e.preventDefault();
        try {
            await handleAddRSVP(event, user, instrument);
            setLocalError("");
        } catch (err) {
            setLocalError("Fehler beim Hinzufügen der Teilnahme. " + err);
        }
    };

    const handleAddRSVP = async (event, user, instrument) => {
        try {
            await APIaddParticipant(event._id, { playerName: user, instrument });
            dispatch(addRSVP({ eventId: event._id, playerName: user, instrument }));
        } catch (err) {
            setLocalError("Error adding participant. " + err);
        }
    };

    const handleRemoveRSVP = async () => {
        try {
            dispatch(removeRSVP({ eventId: event._id, playerName: user }));
            await APIremoveParticipant(event._id, { playerName: user });
            setLocalError("");
        } catch (err) {
            setLocalError("Fehler beim Entfernen der Teilnahme. " + err);
        }
    };

    const handleSaveChanges = async () => {
        try {
            await dispatch(updateEvent(eventDetails));
            setIsEditing(false);
            setLocalError("");
        } catch (err) {
            setLocalError("Fehler beim Speichern der Änderungen. " + err);
        }
    };

    const handleDeleteEvent = async () => {
        if (window.confirm("Bist du sicher, dass du dieser Auftritt löschen willst?")) {
            try {
                await dispatch(deleteEvent(event._id));
                await dispatch(fetchEvents());
                navigate("/events");
                setLocalError("");
            } catch (err) {
                setLocalError("Fehler beim Löschen des Auftritts. " + err);
            }
        }
    };

    const handlePrev = () => {
        if (eventIndex > 0) {
            navigate(`/events/${events[eventIndex - 1]._id}`);
        }
    };

    const handleNext = () => {
        if (eventIndex < events.length - 1) {
            navigate(`/events/${events[eventIndex + 1]._id}`);
        }
    };

    return (
        <div>
            {localError && <p style={{ color: "red" }}>{localError}</p>}
            <EventDetails eventDetails={eventDetails} isEditing={isEditing} handleInputChange={(e) => setEventDetails({ ...eventDetails, [e.target.name]: e.target.value })} />
            {isAdmin && (
                <>
                    <div className="admin-controls">
                        {isEditing ? (
                            <>
                                <Participants
                                    participants={eventDetails.participants}
                                    handleDeleteParticipant={(index) =>
                                        setEventDetails({
                                            ...eventDetails,
                                            participants: eventDetails.participants.filter((_, i) => i !== index),
                                        })
                                    }
                                    handleParticipantChange={(index, field, value) =>
                                        setEventDetails({
                                            ...eventDetails,
                                            participants: eventDetails.participants.map((p, i) => (i === index ? { ...p, [field]: value } : p)),
                                        })
                                    }
                                    handleAddParticipant={() =>
                                        setEventDetails({
                                            ...eventDetails,
                                            participants: [...eventDetails.participants, { playerName: "", instrument: "" }],
                                        })
                                    }
                                    isEditing={isEditing}
                                />
                                <button onClick={handleSaveChanges}>Änderungen speichern</button>
                                <button onClick={() => setIsEditing(false)}>Abbrechen</button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => setIsEditing(true)}>Bearbeiten</button>
                                <button onClick={handleDeleteEvent} style={{ color: "red" }}>
                                    Auftritt löschen
                                </button>
                                <Participants participants={eventDetails.participants} isEditing={isEditing} />
                            </>
                        )}
                    </div>
                </>
            )}
            {!isAdmin && (
                <>
                    <Participants participants={eventDetails.participants} isEditing={isEditing} />
                    <RSVPForm isAttending={isAttending} user={user} instrument={instrument} setInstrument={setInstrument} handleRSVP={handleRSVP} handleRemoveRSVP={handleRemoveRSVP} />
                </>
            )}
            <NavigationBar eventIndex={eventIndex} events={events} handlePrev={handlePrev} handleNext={handleNext} />
        </div>
    );
};

export default EventRSVP;
