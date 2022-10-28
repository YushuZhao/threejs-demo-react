import { Navigate } from "react-router-dom";
import Login from "../app/Login";
import Three from "../app/Threejs";
import Cube from "../app/Threejs/Cube";
import Rain from "../app/Threejs/Rain";
import Map from "../app/Threejs/Map";
import Love from "../app/Threejs/Love";
import Template from "../app/Threejs/Template";

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
      {
        path: "love",
        element: <Love />,
      },
      {
        path: "template",
        element: <Template />,
      },
    ],
  },
  {
    path: "/",
    element: <Navigate to="/three" />,
  },
];
