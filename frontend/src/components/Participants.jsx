import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const Participants = ({ participants,  handleParticipantChange, handleAddParticipant, handleDeleteParticipant, isEditing }) => {
    const [sortedParticipants, setSortedParticipants] = useState([]);
    const [sortCriteria, setSortCriteria] = useState({ key: "", direction: "asc" });
    const { user } = useSelector((state) => state.events);

    useEffect(() => {
        setSortedParticipants(participants || []);
    }, [participants]);

    console.log(user);
    const handleSort = (key) => {
        const newDirection = sortCriteria.key === key && sortCriteria.direction === "asc" ? "desc" : "asc";
        setSortCriteria({ key, direction: newDirection });

        const sorted = [...sortedParticipants].sort((a, b) => {
            const aValue = a[key].toLowerCase();
            const bValue = b[key].toLowerCase();
            return newDirection === "asc" ? (aValue < bValue ? -1 : aValue > bValue ? 1 : 0) : aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        });

        setSortedParticipants(sorted);
    };

    const getSortArrow = (key) => {
        if (sortCriteria.key === key) {
            return sortCriteria.direction === "asc" ? "▲" : "▼";
        }
        return "↕";
    };

    return (
        <div className="participants">
            <h3>Teilnehmer</h3>
            <table>
                <thead>
                    <tr>
                        <td>
                            <a onClick={() => handleSort("playerName")}>Name {getSortArrow("playerName")}</a>
                        </td>
                        <td>
                            <a onClick={() => handleSort("instrument")}>Instrument {getSortArrow("instrument")}</a>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {sortedParticipants.map((participant, index) => (
                        <tr  className={user == participant.playerName ? "sameuser" : ""} key={index}>
                            {isEditing ? (
                                <>
                                    <td>
                                        <input
                                            type="text"
                                            name="playerName"
                                            placeholder="Name"
                                            value={participant.playerName}
                                            onChange={(e) => handleParticipantChange(index, "playerName", e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <select value={participant.instrument} onChange={(e) => handleParticipantChange(index, "instrument", e.target.value)} required>
                                            <option value="" disabled>
                                                Wähle ein Instrument
                                            </option>
                                            <option value="Tamborim / Agogo">Tamborim / Agogo</option>
                                            <option value="Surdo">Surdo</option>
                                            <option value="Shaker">Shaker</option>
                                            <option value="Snare">Snare</option>
                                            <option value="Repinique">Repinique</option>
                                            <option value="eigenes Instrument">eigenes Instrument</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button type="button" style={{ color: "red" }} onClick={() => handleDeleteParticipant(index)}>
                                            Löschen
                                        </button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{participant.playerName}</td>
                                    <td>{participant.instrument}</td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            {isEditing && (
                <button className="add-participant" type="button" onClick={handleAddParticipant}>
                    Teilnehmer hinzufügen
                </button>
            )}
        </div>
    );
};

export default Participants;
