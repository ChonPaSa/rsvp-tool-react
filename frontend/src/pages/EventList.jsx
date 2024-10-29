import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../redux/eventSlice";
import { Link, useNavigate } from "react-router-dom";

const EventList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { events, isAdmin, loading, error } = useSelector((state) => state.events);

    const currentDate = new Date();

    const filteredEvents = events
        .filter((event) => new Date(event.date) >= currentDate) 
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    useEffect(() => {
        dispatch(fetchEvents());
    }, [dispatch]);

    if (loading) return <div>Loading events...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Kommende Auftritte</h1>
            {isAdmin && <button onClick={() => navigate("/addevent")}>Auftritt erstellen</button>}
            <ul>
                {filteredEvents.map((event) => (
                    <li key={event._id}>
                        <Link to={`/events/${event._id}`}>
                            {event.name} am {new Date(event.date).toLocaleDateString("de-DE")} {(event.time)? `um  ${event.time} Uhr`: ""}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EventList;
