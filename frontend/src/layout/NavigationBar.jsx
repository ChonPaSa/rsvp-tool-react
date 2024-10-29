import { useNavigate } from "react-router-dom";

const NavigationBar = ({ eventIndex, events, handlePrev, handleNext }) => {
  const navigate = useNavigate();

  return (
    <div className="navigationbar">
      <button onClick={handlePrev} disabled={eventIndex <= 0}>
        &lt; Vorheriger Auftritt
      </button>
      <button onClick={() => navigate("/events")}>
        Alle Auftritte
      </button>
      <button onClick={handleNext} disabled={eventIndex >= events.length - 1}>
        Nächster Auftritt &gt;
      </button>
    </div>
  );
};

export default NavigationBar;
