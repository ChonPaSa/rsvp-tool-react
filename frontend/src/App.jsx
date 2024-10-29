import Login from "./pages/Login";
import AddEvent from "./pages/AddEvent";
import EventList from "./pages/EventList";
import EventRSVP from "./pages/EventRSVP";
import RootLayout from "./layout/RootLayout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";

function App() {

const routerConfig = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            { path: "/", element: <Login /> },
            { path: "/addevent", element: <AddEvent /> },
            { path: "/adminlogin", element: <AdminLogin /> },
            {
                path: "events",

                children: [
                    { index: true, element: <EventList /> },
                    { path: ":eventId", element: <EventRSVP /> },
                ],
            },
        ],
    },
  ]);
    return (
        <RouterProvider router={routerConfig} />
    );
}

export default App;
