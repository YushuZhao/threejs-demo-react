import React, { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";

const ThreeContainer = styled.div`
  /* overflow: hidden; */
  width: 100vw;
  height: 100vh;
  display: flex;
  padding: 0;
  margin: 0;

  .tab {
    width: 120px;
    display: flex;
    flex-direction: column;
    a {
      padding: 10px;
    }
  }

  .content {
    flex: 1;
    width: calc(100% - 120px);
    position: relative;
  }
`;

export default function Threejs() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("raster-color");
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
        <NavLink to="mapbox">mapbox</NavLink>
        <NavLink to="streamLines">streamLines</NavLink>
        <NavLink to="raster-color">raster-color</NavLink>
      </div>
      <div className="content">
        <Outlet></Outlet>
      </div>
    </ThreeContainer>
  );
}
