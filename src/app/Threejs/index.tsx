import React, { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";

const ThreeContainer = styled.div`
  display: flex;

  .tab {
    display: flex;
    flex-direction: column;
    a {
      padding: 10px;
    }
  }
`;

export default function Threejs() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("map");
  }, []);

  return (
    <ThreeContainer>
      <div className="tab">
        <NavLink to="cube">cube</NavLink>
        <NavLink to="rain">rain</NavLink>
        <NavLink to="map">map</NavLink>
        <NavLink to="raycaster">raycaster</NavLink>
        <NavLink to="love">love</NavLink>
        <NavLink to="STLLoader">STLLoader</NavLink>
        <NavLink to="Template">template</NavLink>
        <NavLink to="water">water</NavLink>
        <NavLink to="periodictable">periodictable</NavLink>
      </div>
      <div className="content">
        <Outlet></Outlet>
      </div>
    </ThreeContainer>
  );
}
