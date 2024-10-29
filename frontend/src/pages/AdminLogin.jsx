import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAdmin } from "../redux/eventSlice";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../utils/api";

const AdminLogin = () => {
    const [adminPassword, setAdminPassword] = useState("");
    const user = useSelector((state) => state.events.user);
    const [name, setName] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Check for existing token on component load
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            navigate("/events");
        }
    }, [navigate]);

    useEffect(() => {
        const isTokenExpired = (token) => {
            const payload = JSON.parse(atob(token.split(".")[1])); 
            return payload.exp * 1000 < Date.now(); 
        };

        const checkToken = () => {
            const token = localStorage.getItem("authToken");
            if (token && isTokenExpired(token)) {
                localStorage.removeItem("authToken");
                dispatch(setAdmin(false));
                navigate("/adminlogin"); 
            }
        };

        checkToken();
    }, [navigate, dispatch]);

    const handleAdminLogin = async () => {
        try {
            const response = await loginAdmin({ password: adminPassword });
            if (response.data.token) {
                localStorage.setItem("authToken", response.data.token);
                dispatch(setAdmin(true));
                navigate("/events");
            } else {
                alert("Falsches Passwort");
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert("Falsches Passwort");
            } else {
                alert("Serverfehler. Bitte versuch später noch einmal.");
            }
        }
    };

    return (
        <div>
            <h2>Admin Bereich</h2>
            {!user && <input type="text" placeholder="Gib deinen Namen ein" value={name} onChange={(e) => setName(e.target.value)} />}
            <input type="password" placeholder="Admin Passwort" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} />
            <br />
            <button onClick={handleAdminLogin}>Als Admin einloggen</button>
            <button
                onClick={() => {
                    navigate("/");
                }}
            >
                Zurück
            </button>
        </div>
    );
};

export default AdminLogin;
