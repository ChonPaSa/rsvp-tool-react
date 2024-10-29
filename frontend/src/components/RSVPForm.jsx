const RSVPForm = ({ isAttending, instrument, setInstrument, handleRSVP, handleRemoveRSVP }) => {
  return (
    <div className="rsvpform">
      {isAttending ? (
        <button onClick={handleRemoveRSVP}>Wechsel zu ich mache nicht mit</button>
      ) : (
        <form onSubmit={handleRSVP}>
          <select value={instrument} onChange={(e) => setInstrument(e.target.value)} required>
            <option value="" disabled>
              Wähle dein Instrument
            </option>
            <option value="Tamborim / Agogo">Tamborim / Agogo</option>
            <option value="Surdo">Surdo</option>
            <option value="Shaker">Shaker</option>
            <option value="Snare">Snare</option>
            <option value="Repinique">Repinique</option>
            <option value="eigenes Instrument">eigenes Instrument</option>
          </select>
          <button type="submit">Ich bin dabei</button>
        </form>
      )}
    </div>
  );
};

export default RSVPForm;
