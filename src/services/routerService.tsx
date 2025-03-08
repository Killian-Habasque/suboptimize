import { useRoutes } from "react-router-dom";
import Login from "../pages/auth/login";
import Register from "../pages/auth/register";
import Home from "../pages/home";
import CalendarPage from "../pages/calendar";
import Template from "../pages/template";
import AddSubscription from "../pages/subscription/add";

/**
 * RouterService - Centralized route definition for the application.
 * @returns {React.ReactElement} The routes for the application.
 */
const RouterService = () => {
  const routesArray = [
    {
      path: "*",
      element: <Login />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/calendrier",
      element: <CalendarPage />,
    },
    {
      path: "/template",
      element: <Template />,
    },
    {
      path: "/subscribtion/add",
      element: <AddSubscription />,
    }
  ];

  return useRoutes(routesArray);
};

export default RouterService;
