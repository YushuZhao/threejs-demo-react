import React, { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import jsonData from "../../assets/model/wings.json";

export default function STLLoader() {
  let camera: THREE.PerspectiveCamera;
  let scene: THREE.Scene;
  let renderer: THREE.WebGLRenderer;

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
      0.1,
      16000
    );
    camera.position.set(300, -100, 300);
    const camerLookAt = new THREE.Vector3(0, 0, 0);
    camera.lookAt(camerLookAt);
  }

  function initRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const elem = document.getElementById("stlloader") as HTMLCanvasElement;
    elem.appendChild(renderer.domElement);
  }

  function initLighter() {
    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const light0 = new THREE.DirectionalLight(0xffffff);
    light0.intensity = 0.5;
    light0.position.set(20, 100, 15);
    light0.target.position.copy(scene.position);
    scene.add(light0);

    const light1 = new THREE.DirectionalLight(0xffffff);
    light1.intensity = 0.4;
    light1.position.set(20, -100, 15);
    light1.target.position.copy(scene.position);
    scene.add(light1);
  }

  function animate() {
    requestAnimationFrame(animate);
    render();
  }

  function render() {
    renderer.render(scene, camera);
  }

  function control() {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.minDistance = 50;
    controls.maxDistance = 450;
    controls.update();
  }

  function loaderModel() {
    const loader = new THREE.ObjectLoader();
    const object = loader.parse(jsonData);
    console.log(object);
    scene.add(object);
  }

  function initGrid() {
    const grid = new THREE.GridHelper(3000, 300, 0xf8f8f8, 0xf8f8f8);
    scene.add(grid);
  }

  useEffect(() => {
    init();
    initLighter();
    initGrid();
    loaderModel();
    animate();
    control();
  }, []);

  return <div id="stlloader" className="stlloader"></div>;
}
