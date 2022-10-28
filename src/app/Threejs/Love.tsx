import React, { useEffect } from "react";
import * as THREE from "three";

export default function Love() {
  const x = 0;
  const y = 0;

  const heartShape = new THREE.Shape();

  heartShape.moveTo(x + 5, y - 5);
  heartShape.bezierCurveTo(x + 5, y - 5, x + 4, y, x, y);
  heartShape.bezierCurveTo(x - 6, y, x - 6, y - 7, x - 6, y - 7);
  heartShape.bezierCurveTo(x - 6, y - 11, x - 3, y - 15.4, x + 5, y - 19);
  heartShape.bezierCurveTo(x + 12, y - 15.4, x + 16, y - 11, x + 16, y - 7);
  heartShape.bezierCurveTo(x + 16, y - 7, x + 16, y, x + 10, y);
  heartShape.bezierCurveTo(x + 7, y, x + 5, y - 5, x + 5, y - 5);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  const geometry = new THREE.ShapeGeometry(heartShape);
  const material = new THREE.MeshBasicMaterial({ color: "#d92dcc" });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // 相机位置
  camera.position.set(0, 0, 30);
  camera.lookAt(0, 0, 0);

  // 轴线辅助线
  const axesHelper = new THREE.AxesHelper(10);
  scene.add(axesHelper);

  useEffect(() => {
    const dom = document.getElementById("love") as HTMLCanvasElement;
    dom.appendChild(renderer.domElement);

    renderer.render(scene, camera);
  }, []);

  return <div id="love" className="love"></div>;
}
