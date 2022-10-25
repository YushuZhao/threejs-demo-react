import React, { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function Threejs() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("cube");
  }, []);
  return (
    <div>
      <div>
        <NavLink to="cube">cube</NavLink>
        <NavLink to="map">map</NavLink>
      </div>
      <div>
        <Outlet></Outlet>
      </div>
    </div>
  );
}
