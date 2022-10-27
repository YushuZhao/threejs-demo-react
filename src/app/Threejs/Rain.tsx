import React, { useEffect } from "react";
import * as THREE from "three";

import { raindrop, grassland } from "../../images";

export default function Rain() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    50,
    1000
  );
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  camera.position.set(200, 50, 200);
  camera.lookAt(scene.position);

  function initLight() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(200, 100, 200);
    scene.add(pointLight);
  }

  function initPlane() {
    const planeGeometry = new THREE.PlaneGeometry(500, 500);
    const texture = new THREE.TextureLoader().load(`${grassland}`);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(20, 20);
    const planeMaterial = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      map: texture,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(0, 0, 0);
    scene.add(plane);
  }

  let group: THREE.Group;

  function initRaindrops() {
    group = new THREE.Group();
    const rainDrop = new THREE.TextureLoader().load(`${raindrop}`);
    new Array(777).fill(0).forEach((item) => {
      let spriteMaterial = new THREE.SpriteMaterial({ map: rainDrop });
      let sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.set(
        Math.random() * 250,
        Math.random() * 300,
        Math.random() * 250
      );
      sprite.scale.set(8, 8, 1);
      group.add(sprite);
    });
    scene.add(group);
  }

  function initAxesHelper() {
    const axesHelper = new THREE.AxesHelper(500);
    scene.add(axesHelper);
  }

  function render() {
    renderer.render(scene, camera);
    group.children.forEach((raindrop) => {
      raindrop.position.y -= 0.2;
      if (raindrop.position.y < 0) {
        raindrop.position.y = 200;
      }
    });
    requestAnimationFrame(render);
  }

  function handleResize() {
    window.addEventListener(
      "resize",
      function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      },
      false
    );
  }

  useEffect(() => {
    initLight();
    initPlane();
    initRaindrops();
    // initAxesHelper();
    render();

    const dom = document.getElementById("rain") as HTMLCanvasElement;
    dom.appendChild(renderer.domElement);

    handleResize();
  }, []);
  return <div id="rain" className="rain"></div>;
}
