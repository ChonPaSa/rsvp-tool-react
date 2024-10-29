import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "../pages/Login";
import Header from "./Header";

const RootLayout = () => {
    const user = useSelector((state) => state.events.user);

    if (!user) {
        return <Login />;
    }

    return (
        <>
            <Header />
            <Outlet />
        </>
    );
};

export default RootLayout;
