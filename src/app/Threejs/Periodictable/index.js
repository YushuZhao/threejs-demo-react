import React, { useEffect } from "react";
import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import {
  CSS3DRenderer,
  CSS3DObject,
} from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";

import "./style.css";

export default function Periodictable() {
  let camera;
  let scene;
  let group;
  let renderer;
  let controls;

  const objects = [];
  const targets = { table: [], sphere: [], helix: [], grid: [] };
  let rotateId = null;

  function init(imageFiles) {
    initScene();
    initCamera();
    initGroup();
    initObjects(imageFiles);
    initRenderer();
    initControls();
  }

  function initScene() {
    scene = new THREE.Scene();
  }

  function initCamera() {
    camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    camera.position.z = 3000;
  }

  function initGroup() {
    group = new THREE.Group();
    scene.add(group);
  }

  function initObjects(imageFiles) {
    const imageWidth = 120;
    const imageHeight = 160;
    const spacing = 10;
    let x = 1;
    let y = 1;

    const years = Object.keys(imageFiles);
    console.log(years);
    years.forEach((year, yIndex) => {
      const months = Object.keys(imageFiles[year]);
      console.log(months);

      //
      const element = document.createElement("div");
      element.className = "element";
      element.style.backgroundColor =
        "rgba(0,127,127," + (Math.random() * 0.5 + 0.25) + ")";
      const symbol = document.createElement("div");
      symbol.className = "symbol";
      symbol.textContent = year;
      element.appendChild(symbol);

      const objectCSS = new CSS3DObject(element);
      objectCSS.position.x = Math.random() * 4000 - 2000;
      objectCSS.position.y = Math.random() * 4000 - 2000;
      objectCSS.position.z = Math.random() * 4000 - 2000;
      scene.add(objectCSS);
      group.add(objectCSS);

      objects.push(objectCSS);

      const object = new THREE.Object3D();
      object.position.x = x * (imageWidth + spacing) - 1330;
      object.position.y = -y * (imageHeight + spacing) + 990;

      targets.table.push(object);

      x++;

      //
      months.forEach((month, mIndex) => {
        const element = document.createElement("div");
        element.className = "element";
        element.style.backgroundColor =
          "rgba(0,127,127," + (Math.random() * 0.5 + 0.25) + ")";
        const symbol = document.createElement("div");
        symbol.className = "symbol";
        symbol.textContent = month;
        element.appendChild(symbol);

        const objectCSS = new CSS3DObject(element);
        objectCSS.position.x = Math.random() * 4000 - 2000;
        objectCSS.position.y = Math.random() * 4000 - 2000;
        objectCSS.position.z = Math.random() * 4000 - 2000;
        scene.add(objectCSS);
        group.add(objectCSS);

        objects.push(objectCSS);

        const object = new THREE.Object3D();
        //
        object.position.x = x * (imageWidth + spacing) - 1330;
        object.position.y = -y * (imageHeight + spacing) + 990;

        targets.table.push(object);

        //
        const images = imageFiles[year][month];
        images.forEach((image, i) => {
          x++;

          const element = document.createElement("img");
          element.className = "element";
          element.src = `http://localhost:3001/images/${year}/${month}/${image}`;

          const objectCSS = new CSS3DObject(element);
          objectCSS.position.x = Math.random() * 4000 - 2000;
          objectCSS.position.y = Math.random() * 4000 - 2000;
          objectCSS.position.z = Math.random() * 4000 - 2000;
          scene.add(objectCSS);
          group.add(objectCSS);

          objects.push(objectCSS);

          const object = new THREE.Object3D();
          object.position.x = x * (imageWidth + spacing) - 1330;
          object.position.y = -y * (imageHeight + spacing) + 990;

          if (x > 17) {
            x = 3;
            y++;
          }
          if (i === images.length - 1) {
            y++;
            if (mIndex === month.length - 1 && yIndex !== years.length - 1) {
              x = 1;
            } else {
              x = 2;
            }
          }

          targets.table.push(object);
        });
      });
    });

    // // table
    // for (let i = 0; i < 100; i++) {
    //   const element = document.createElement("img");
    //   element.className = "element";
    //   element.src = `http://localhost:3001/images/${imageFiles[i % 2]}`;

    //   const objectCSS = new CSS3DObject(element);
    //   objectCSS.position.x = Math.random() * 4000 - 2000;
    //   objectCSS.position.y = Math.random() * 4000 - 2000;
    //   objectCSS.position.z = Math.random() * 4000 - 2000;
    //   scene.add(objectCSS);
    //   group.add(objectCSS);

    //   objects.push(objectCSS);

    //   //
    //   const row = Math.floor(i / 16); // 每行显示16个图片
    //   const col = i % 16;

    //   const object = new THREE.Object3D();
    //   object.position.x = (imageWidth + spacing) * col - 965;
    //   object.position.y = -(imageHeight + spacing) * row + 700;

    //   targets.table.push(object);
    // }

    // sphere

    const vector = new THREE.Vector3();

    for (let i = 0, l = objects.length; i < l; i++) {
      const phi = Math.acos(-1 + (2 * i) / l);
      const theta = Math.sqrt(l * Math.PI) * phi;

      const object = new THREE.Object3D();

      object.position.setFromSphericalCoords(800, phi, theta);

      vector.copy(object.position).multiplyScalar(2);

      object.lookAt(vector);

      targets.sphere.push(object);
    }

    // helix

    for (let i = 0, l = objects.length; i < l; i++) {
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

    for (let i = 0; i < objects.length; i++) {
      const object = new THREE.Object3D();

      object.position.x = (i % 5) * 400 - 800;
      object.position.y = -(Math.floor(i / 5) % 5) * 400 + 800;
      object.position.z = Math.floor(i / 25) * 1000 - 2000;

      targets.grid.push(object);
    }
  }

  function initRenderer() {
    renderer = new CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    const elem = document.getElementById("periodictable");
    elem.appendChild(renderer.domElement);
  }

  function initControls() {
    controls = new TrackballControls(camera, renderer.domElement);
    controls.minDistance = 500;
    controls.maxDistance = 6000;
    controls.rotateSpeed = 0.5;
    controls.addEventListener("change", render);

    const buttonTable = document.getElementById("table");
    buttonTable.addEventListener("click", function () {
      clearRotate();
      transform(targets.table, 2000);
    });

    const buttonSphere = document.getElementById("sphere");
    buttonSphere.addEventListener("click", function () {
      startRotate();
      transform(targets.sphere, 2000);
    });

    const buttonHelix = document.getElementById("helix");
    buttonHelix.addEventListener("click", function () {
      startRotate();
      transform(targets.helix, 2000);
    });

    const buttonGrid = document.getElementById("grid");
    buttonGrid.addEventListener("click", function () {
      startRotate();
      transform(targets.grid, 2000);
    });

    transform(targets.table, 2000);

    //

    window.addEventListener("resize", onWindowResize);
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    render();
  }

  function transform(targets, duration) {
    TWEEN.removeAll();

    for (let i = 0; i < objects.length; i++) {
      const object = objects[i];
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

    new TWEEN.Tween(this)
      .to({}, duration * 2)
      .onUpdate(render)
      .start();
  }

  function startRotate() {
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

  function animate() {
    requestAnimationFrame(animate);

    TWEEN.update();

    controls.update();
    render();
  }

  function render() {
    renderer.render(scene, camera);
  }

  useEffect(() => {
    // 获取图片名列表
    const getImages = async () => {
      const imageFiles = await fetch("http://localhost:3001/images").then(
        (res) => res.json()
      );
      init(imageFiles);
      animate();
    };
    getImages();
  }, []);

  return (
    <div className="periodictable-container">
      <div id="periodictable" className="periodictable"></div>
      <div id="menu">
        <button id="table">TABLE</button>
        <button id="sphere">SPHERE</button>
        <button id="helix">HELIX</button>
        <button id="grid">GRID</button>
      </div>
    </div>
  );
}
