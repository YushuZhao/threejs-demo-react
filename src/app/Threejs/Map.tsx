import React, { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import jsonData from "../../assets/map/china.json";

export default function Map() {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(200, 200, 300);
  camera.lookAt(200, 200, 100);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  // 轴线辅助线
  const axesHelper = new THREE.AxesHelper(10);
  scene.add(axesHelper);

  // 环境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // 点光源
  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(25, 50, 25);
  scene.add(pointLight);

  console.log(jsonData);

  function drawExtrudeMesh(polygon: any, color: any) {
    const shape = new THREE.Shape();
    polygon.forEach((row: any, i: any) => {
      const [x, y] = [row[0], row[1]];

      if (i === 0) {
        shape.moveTo(x, y);
      }
      shape.lineTo(x, y);
    });

    // 拉伸
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 10,
      bevelEnabled: false,
    });
    const material = new THREE.MeshLambertMaterial({
      color: color,
      transparent: true,
      opacity: 0.5,
    });
    return new THREE.Mesh(geometry, material);
  }

  function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  useEffect(() => {
    const dom = document.getElementById("map") as HTMLCanvasElement;
    dom.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, dom);
    controls.update();

    render();

    const map = new THREE.Object3D();
    // 解析数据
    function operationData(jsonData: any) {
      // 全国信息
      const features = jsonData.features;

      features.forEach((feature: any) => {
        // 单个省份
        const province = new THREE.Object3D();
        // 地址
        // province.properties = feature.properties.name;
        const coordinates = feature.geometry.coordinates;
        const color = "yellow";

        if (feature.geometry.type === "MultiPolygon") {
          // 多个，多边形
          coordinates.forEach((coordinate: any) => {
            // coordinate 多边形数据
            coordinate.forEach((rows: any) => {
              console.log(rows);
              const mesh = drawExtrudeMesh(rows, color);
              province.add(mesh);
            });
          });
        }

        if (feature.geometry.type === "Polygon") {
          // 多边形
          coordinates.forEach((coordinate: any) => {
            const mesh = drawExtrudeMesh(coordinate, color);
            province.add(mesh);
          });
        }
        map.add(province);
      });
      scene.add(map);
    }

    operationData(jsonData);
  }, []);

  return <div id="map" className="map"></div>;
}
