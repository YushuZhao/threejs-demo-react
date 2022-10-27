import { Navigate } from "react-router-dom";
import Login from "../app/Login";
import Three from "../app/Threejs";
import Cube from "../app/Threejs/Cube";
import Rain from "../app/Threejs/Rain";
import Map from "../app/Threejs/Map";

export const routes = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/three",
    element: <Three />,
    children: [
      {
        path: "cube",
        element: <Cube />,
      },
      {
        path: "rain",
        element: <Rain />,
      },
      {
        path: "map",
        element: <Map />,
      },
    ],
  },
  {
    path: "/",
    element: <Navigate to="/three" />,
  },
];