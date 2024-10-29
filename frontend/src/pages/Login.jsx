import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/eventSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [name, setName] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = () => {
        if (name.trim() !== "") {
            dispatch(setUser(name));
            navigate("/events");
        } else {
            alert("Gib deinen Namen ein");
        }
    };

    return (
        <div>
            <h1>Gib deinen Namen ein</h1>
            <input
                type="text"
                placeholder="Gib deinen Namen ein"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button onClick={handleLogin}>Weiter</button>
        </div>
    );
};

export default Login;
