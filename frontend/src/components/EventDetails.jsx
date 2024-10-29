const EventDetails = ({ eventDetails, isEditing, handleInputChange }) => {
    if (isEditing) {
        return (
            <form>
                <label>
                    Name:
                    <input type="text" name="name" size="50" value={eventDetails.name} onChange={handleInputChange} />
                </label>
                <br />
                <label>
                    Datum:
                    <input type="date" name="date" value={eventDetails.date ? new Date(eventDetails.date).toISOString().split("T")[0] : ""} onChange={handleInputChange} />
                </label>
                <label>
                    von:
                    <input type="time" name="time" value={eventDetails.time} onChange={handleInputChange} />
                </label>
                <label>
                    bis:
                    <input type="time" name="finish" value={eventDetails.finish} onChange={handleInputChange} />
                </label>
                <br />
                <label>
                    Ort:
                    <input type="text" name="location" size="50" value={eventDetails.location} onChange={handleInputChange} />
                </label>
                <br />
                <label>
                    Beschreibung:
                    <br />
                    <textarea name="description" rows="6" cols="60" value={eventDetails.description} onChange={handleInputChange} />
                </label>
            </form>
        );
    }

    return (
        <div>
            <h1>{eventDetails.name}</h1>
            <p>
                Am {new Date(eventDetails.date).toLocaleDateString("de-DE")}
                {eventDetails.time && ` von  ${eventDetails.time} Uhr`}
                {eventDetails.finish && ` bis  ${eventDetails.finish} Uhr`}
            </p>
            <p>{eventDetails.location}</p>
            <pre>{eventDetails.description}</pre>
        </div>
    );
};

export default EventDetails;
