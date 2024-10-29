import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { APIcreateEvent } from "../utils/api";
import { addEvent } from "../redux/eventSlice";

const AddEvent = () => {
    const [eventName, setEventName] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [eventTime, setEventTime] = useState("");
    const [eventFinish, setEventFinish] = useState("");
    const [eventLocation, setEventLocation] = useState("");
    const [eventDescription, setDescription] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newEvent = {
            name: eventName,
            date: eventDate,
            time: eventTime,
            finish: eventFinish,
            location: eventLocation,
            description: eventDescription,
            participants: [],
        };

        try {
            const response = await APIcreateEvent(newEvent);
            dispatch(addEvent(response.data));
            navigate("/events");
        } catch (error) {
            console.error("Fehler bei der Auftritterstellung", error);
        }
    };

    return (
        <div>
            <h1>Neuer Auftritt erstellen</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">
                        Name <sup>*</sup> :
                    </label>
                    <input type="text" id="name" size="50" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
                </div>

                <div>
                    <label htmlFor="date">
                        Datum <sup>*</sup>:
                    </label>
                    <input type="date" id="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
                    <label htmlFor="time">von:</label>
                    <input type="time" id="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} />
                    <label htmlFor="finish">bis:</label>
                    <input type="time" id="finish" value={eventFinish} onChange={(e) => setEventFinish(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="finish">
                        Ort<sup>*</sup>:
                    </label>
                    <input type="text" id="finish" size="50" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="description">Infos:</label>
                    <br />
                    <textarea id="description" rows="4" cols="50" value={eventDescription} onChange={(e) => setDescription(e.target.value)}></textarea>
                </div>

                <button type="submit">Auftritt erstellen</button>
                <button onClick={() => navigate("/events")}>Zurück</button>
            </form>
        </div>
    );
};

export default AddEvent;
