import { useRoutes } from "react-router-dom";
import Login from "../pages/auth/login";
import Register from "../pages/auth/register";
import Home from "../pages/home";
import Template from "../pages/template";
import AddSubscription from "../pages/subscriptions/add";
import Subscriptions from "../pages/subscriptions";

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
      path: "/template",
      element: <Template />,
    },
    {
      path: "/subscriptions/add",
      element: <AddSubscription />,
    },
    {
      path: "/subscriptions",
      element: <Subscriptions />,
    },
  ];

  return useRoutes(routesArray);
};

export default RouterService;
