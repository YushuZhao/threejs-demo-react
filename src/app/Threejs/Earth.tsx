import React, { useEffect } from "react";
import * as THREE from "three";

import { earthIcon } from "../../images/render";

export default function Earth() {
  let camera: THREE.PerspectiveCamera;
  let scene: THREE.Scene;
  let renderer: THREE.WebGLRenderer;
  let geometry;
  let material;
  let mesh: THREE.Mesh;
  const texture = new THREE.TextureLoader().load(earthIcon);

  function init() {
    initScene();
    initCamera();
    initRenderer();
  }

  function initScene() {
    scene = new THREE.Scene();
  }

  function initCamera() {
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.z = 100;
  }

  function initRenderer() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    const elem = document.getElementById("earth") as HTMLCanvasElement;
    elem.appendChild(renderer.domElement);
  }

  function animate() {
    requestAnimationFrame(animate);
    render();
  }

  function render() {
    // mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.005;

    renderer.render(scene, camera);
  }

  function initBox() {
    // geometry = new THREE.BoxGeometry(200, 200, 200);
    geometry = new THREE.SphereGeometry(40);
    // material = new THREE.MeshBasicMaterial({
    //   color: 0xff0000,
    //   wireframe: true,
    // });
    material = new THREE.MeshBasicMaterial({ map: texture });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  }

  useEffect(() => {
    init();
    initBox();
    animate();
  }, []);

  return <div id="earth" className="earth"></div>;
}
