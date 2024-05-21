import { Dashboard } from "../pages/Dashboard";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";

export const configRoutes = [
  {
    path: "/",
    element: <Login />,
    isPrivate: false,
  },
  {
    path: "/dashboard",
    element: (
      <Dashboard>
        <Home />
      </Dashboard>
    ),
    isPrivate: true,
  },
];
