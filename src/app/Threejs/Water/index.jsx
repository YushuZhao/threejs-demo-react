import React, { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as GeoTIFF from "geotiff";
import terrain from "../../../assets/data/c250m.tif";
import satellite from "../../../assets/data/satellite.png";

export default function Template() {
  // let camera: THREE.PerspectiveCamera;
  // let scene: THREE.Scene;
  // let renderer: THREE.WebGLRenderer;
  // let geometry;
  // let material;
  // let mesh: THREE.Mesh;
  let camera;
  let scene;
  let renderer;
  let geometry;
  let material;
  let mesh;

  function init() {
    initScene();
    initCamera();
    initLight();
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
    const camerLookAt = new THREE.Vector3(0, 0, 0);
    camera.lookAt(camerLookAt);

    const axesHelper = new THREE.AxesHelper(30);
    scene.add(axesHelper);
  }

  function initLight() {
    const color = 0xffffff;
    const intensity = 1;
    const ambientLight = new THREE.AmbientLight(color, intensity);
    ambientLight.position.set(50, 100, 250);
    scene.add(ambientLight);
  }

  function initRenderer() {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true, // 渲染为白色场景
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // const elem = document.getElementById("water") as HTMLCanvasElement;
    const elem = document.getElementById("water");
    elem.appendChild(renderer.domElement);
  }

  function animate() {
    requestAnimationFrame(animate);
    render();
  }

  function render() {
    renderer.render(scene, camera);
  }

  async function initBox() {
    const tif = await GeoTIFF.fromUrl(terrain);
    const tifImage = await tif.getImage();
    console.log(tifImage);
    const image = {
      width: tifImage.getWidth(),
      height: tifImage.getHeight(),
    };
    console.log(image.width);
    console.log(image.height);
    geometry = new THREE.PlaneGeometry(
      image.width,
      image.height,
      image.width - 1,
      image.height - 1
    );
    const data = await tifImage.readRasters({ interleave: true });
    console.log(geometry);

    const posAttr = geometry.attributes.position;
    // 遍历顺序：从左至右，从上至下
    console.log(posAttr);
    for (let i = 0; i < posAttr.count; i++) {
      posAttr.array[3 * i + 2] = data[i] / 50;
    }

    const texture = new THREE.TextureLoader().load(satellite);
    const material = new THREE.MeshLambertMaterial({
      wireframe: false,
      // side: THREE.DoubleSide,
      map: texture,
    });

    const mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);
  }

  function control() {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    controls.enableDamping = true;
    controls.enableZoom = true;
    controls.update();
  }

  useEffect(() => {
    init();
    initBox();
    animate();
    control();
  }, []);

  return <div id="water" className="water"></div>;
}
