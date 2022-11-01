import React, { useEffect } from "react";
import * as THREE from "three";

export default function Template() {
  let camera: THREE.PerspectiveCamera;
  let scene: THREE.Scene;
  let renderer: THREE.WebGLRenderer;
  let geometry;
  let material;
  let mesh: THREE.Mesh;

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
      10000
    );
    camera.position.z = 1000;
  }

  function initRenderer() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    const elem = document.getElementById("template") as HTMLCanvasElement;
    elem.appendChild(renderer.domElement);
  }

  function animate() {
    requestAnimationFrame(animate);
    render();
  }

  function render() {
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;

    renderer.render(scene, camera);
  }

  function initBox() {
    geometry = new THREE.BoxGeometry(200, 200, 200);
    material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true,
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  }

  useEffect(() => {
    init();
    initBox();
    animate();
  }, []);

  return <div id="template" className="template"></div>;
}
