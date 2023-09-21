import React, { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import {
  CSS3DRenderer,
  CSS3DObject,
} from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";

import "./style.css";

export default function Periodictable() {
  const [state, setState] = useState(1);
  let cameraRef = useRef();
  let sceneRef = useRef();
  let groupRef = useRef();
  let rendererRef = useRef();
  let controlsRef = useRef();
  let renderRef = useRef();
  const objects = useRef([]);
  const targets = { table: [], sphere: [], helix: [], grid: [] };
  let rotateId = null;

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    camera.position.z = 3000;

    const group = new THREE.Group();
    scene.add(group);

    const renderer = new CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    const elem = document.getElementById("periodictable");
    elem.appendChild(renderer.domElement);

    const controls = new TrackballControls(camera, renderer.domElement);
    controls.minDistance = 500;
    controls.maxDistance = 6000;
    controls.rotateSpeed = 0.5;
    controls.addEventListener("change", render);

    sceneRef.current = scene;
    cameraRef.current = camera;
    groupRef.current = group;
    rendererRef.current = renderer;
    controlsRef.current = controls;
    renderRef.current = render;
    animate();

    window.addEventListener("resize", onWindowResize);

    function render() {
      renderer.render(scene, camera);
    }

    function animate() {
      requestAnimationFrame(animate);
      TWEEN.update();
      controls.update();
      render();
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      render();
    }

    return () => {
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current || !groupRef.current) return;
    const getData = async () => {
      const ds_ids = [1, 2, 3, 4].slice(0, state).join(",");
      const res = await fetch(
        `http://gis-service-api.test-out.hotgrid.cn:8780/earth/grid-list?ds_ids=${ds_ids}&start_time=2023-08-20&end_time=2023-09-01&time_type=day&grid_ids=8140bffffffffff`
      ).then((res) => res.json());
      console.log(res);
      const result = res.result;
      formatGroupData(result, sceneRef.current, groupRef.current);
    };
    getData();
  }, [state, sceneRef.current, groupRef.current]);

  function formatGroupData(imageFiles, scene, group) {
    const imageWidth = 120;
    const imageHeight = 160;
    const spacing = 10;
    let x = 1;
    let y = 1;
    if (objects.current.length > 0) {
      objects.current.forEach((item) => {
        sceneRef.current.remove(item);
        groupRef.current.remove(item);
      });
      objects.current = [];
    }

    imageFiles.forEach((day, i) => {
      const { dt, img } = day;
      const element = document.createElement("div");
      element.className = "element";
      element.style.backgroundColor =
        "rgba(0,127,127," + (Math.random() * 0.5 + 0.25) + ")";
      const symbol = document.createElement("div");
      symbol.className = "symbol";
      symbol.textContent = dt;
      element.appendChild(symbol);

      const objectCSS = new CSS3DObject(element);
      objectCSS.position.x = Math.random() * 4000 - 2000;
      objectCSS.position.y = Math.random() * 4000 - 2000;
      objectCSS.position.z = Math.random() * 4000 - 2000;
      scene.add(objectCSS);
      group.add(objectCSS);

      objects.current.push(objectCSS);

      const object = new THREE.Object3D();
      object.position.x = x * (imageWidth + spacing) - 1330;
      object.position.y = -y * (imageHeight + spacing) + 990;

      targets.table.push(object);

      img.forEach((url, index) => {
        x++;
        const element = new Image();
        element.src = url;
        element.className = "element";

        const objectCSS = new CSS3DObject(element);
        // objectCSS.position.x = Math.random() * 4000 - 2000;
        // objectCSS.position.y = Math.random() * 4000 - 2000;
        // objectCSS.position.z = Math.random() * 4000 - 2000;
        scene.add(objectCSS);
        group.add(objectCSS);

        objects.current.push(objectCSS);

        const object = new THREE.Object3D();
        object.position.x = x * (imageWidth + spacing) - 1330;
        object.position.y = -y * (imageHeight + spacing) + 990;

        targets.table.push(object);
        if (index === img.length - 1) {
          x = 1;
        }
      });
      y++;
    });

    // sphere

    const vector = new THREE.Vector3();

    for (let i = 0, l = objects.current.length; i < l; i++) {
      const phi = Math.acos(-1 + (2 * i) / l);
      const theta = Math.sqrt(l * Math.PI) * phi;

      const object = new THREE.Object3D();

      object.position.setFromSphericalCoords(800, phi, theta);

      vector.copy(object.position).multiplyScalar(2);

      object.lookAt(vector);

      targets.sphere.push(object);
    }

    // helix

    for (let i = 0, l = objects.current.length; i < l; i++) {
      const theta = i * 0.175 + Math.PI;
      const y = -(i * 8) + 450;

      const object = new THREE.Object3D();

      object.position.setFromCylindricalCoords(900, theta, y);

      vector.x = object.position.x * 2;
      vector.y = object.position.y;
      vector.z = object.position.z * 2;

      object.lookAt(vector);

      targets.helix.push(object);
    }

    // grid

    for (let i = 0; i < objects.current.length; i++) {
      const object = new THREE.Object3D();

      object.position.x = (i % 5) * 400 - 800;
      object.position.y = -(Math.floor(i / 5) % 5) * 400 + 800;
      object.position.z = Math.floor(i / 25) * 1000 - 2000;

      targets.grid.push(object);
    }

    transform(targets.table, 2000);
  }

  function transform(targets, duration) {
    TWEEN.removeAll();

    for (let i = 0; i < objects.current.length; i++) {
      const object = objects.current[i];
      const target = targets[i];

      new TWEEN.Tween(object.position)
        .to(
          { x: target.position.x, y: target.position.y, z: target.position.z },
          Math.random() * duration + duration
        )
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();

      new TWEEN.Tween(object.rotation)
        .to(
          { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z },
          Math.random() * duration + duration
        )
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();
    }

    // new TWEEN.Tween()
    //   .to({}, duration * 2)
    //   .onUpdate(render)
    //   .start();
  }

  function startRotate(group, render) {
    if (rotateId == null) {
      rotateId = setInterval(() => {
        group.rotation.y -= 0.004;
        render();
      }, 50);
    }
  }

  function clearRotate() {
    if (rotateId != null) {
      clearInterval(rotateId);
      rotateId = null;
    }
  }

  return (
    <div className="periodictable-container">
      <div id="periodictable" className="periodictable"></div>
      <div id="menu">
        <button
          id="table"
          onClick={() => {
            clearRotate();
            transform(targets.table, 2000);
          }}
        >
          TABLE
        </button>
        <button
          id="sphere"
          onClick={() => {
            startRotate(groupRef.current, renderRef.current);
            transform(targets.sphere, 2000);
          }}
        >
          SPHERE
        </button>
        <button
          id="helix"
          onClick={() => {
            startRotate(groupRef.current, renderRef.current);
            transform(targets.helix, 2000);
          }}
        >
          HELIX
        </button>
        <button
          id="grid"
          onClick={() => {
            startRotate(groupRef.current, renderRef.current);
            transform(targets.grid, 2000);
          }}
        >
          GRID
        </button>
        <button
          onClick={() => {
            setState((pre) => pre + 1);
          }}
        >
          重绘
        </button>
      </div>
    </div>
  );
}
