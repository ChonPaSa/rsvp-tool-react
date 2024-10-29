import logo from "../assets/logo.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearAdmin } from "../redux/eventSlice";
import styles from "./Header.module.css";

const Header = () => {
    const navigate = useNavigate();
    const { isAdmin } = useSelector((state) => state.events);
    const dispatch = useDispatch();
    const handleLogout = () => {
        dispatch(clearAdmin());
        navigate("/events");
    };
    return (
        <div className={styles.container}>
            <Link to="/events">
                <img src={logo} alt="Green-Igelz Logo" />
            </Link>
            <h2>Green Igelz</h2>
            {!isAdmin && <button className="admin-button" onClick={() => navigate("/adminlogin")}>Admin</button>}
            {isAdmin && <button className="admin-button" onClick={handleLogout}>Ausloggen</button>}
        </div>
    );
};

export default Header;
