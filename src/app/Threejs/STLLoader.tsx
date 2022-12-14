import React, { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import jsonData from "../../assets/model/wings.json";

export default function STLLoaderPage() {
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

  function initLight() {
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
    // const object = loader.parse(jsonData);
    // scene.add(object);

    const loaderSTL = new STLLoader();
    loaderSTL.load("/models/Build_Bar_I_50.stl", function (geometry) {
      // 控制台查看加载的threejs对象结构
      console.log(geometry);
      // 查看顶点数,一个立方体6个矩形面,每个矩形面至少2个三角面,每个三角面3个顶点,
      console.log(geometry.attributes.position.count);
      // 缩放
      // geometry.scale(0.5,0.5,0.5);
      //居中
      geometry.center();
      const material = new THREE.MeshLambertMaterial({
        color: 0x0000ff,
      });
      const mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
      scene.add(mesh);
    });
  }

  function initGrid() {
    const grid = new THREE.GridHelper(3000, 300, 0xf8f8f8, 0xf8f8f8);
    scene.add(grid);
  }

  useEffect(() => {
    init();
    initLight();
    initGrid();
    loaderModel();
    animate();
    control();
  }, []);

  return <div id="stlloader" className="stlloader"></div>;
}
