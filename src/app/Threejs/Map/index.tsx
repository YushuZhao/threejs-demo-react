import React, { useState, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as d3 from "d3";

import {
  drawExtrudeMesh,
  drawLine,
  getPickPosition,
  handleMapData,
} from "./methods";
import { scence_cq } from "./cityMap";
import jsonData from "../../../assets/map/ChinaAll.json";
// import jsonData from "../../../assets/map/ChongQing.json";

type JsonObj = typeof jsonData;

export default function Map() {
  let camera: THREE.PerspectiveCamera;
  let scene: THREE.Scene;
  let renderer: THREE.WebGLRenderer;
  let axesHelper;
  const map = new THREE.Object3D();
  let lastPick: any = null;

  // 投影
  const projection1 = d3
    .geoMercator()
    .center([116.412318, 39.909843]) // 北京
    .translate([0, 0]);

  function init(dom: HTMLCanvasElement) {
    initScene();
    initCamera();
    initRenderer(dom);
  }

  function initScene() {
    scene = new THREE.Scene();
  }

  function initCamera() {
    camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    camera.position.set(0, 0, 300);
    camera.lookAt(0, 0, 0);
  }

  function initRenderer(dom: HTMLCanvasElement) {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    dom.appendChild(renderer.domElement);
  }

  function initAxesHelper() {
    axesHelper = new THREE.AxesHelper(700);
    scene.add(axesHelper);
  }

  function initLight() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);
  }

  function setControl() {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
  }

  // 解析全国数据
  function handleCountryData(jsonData: JsonObj) {
    // 全国信息
    const features = jsonData.features;

    features.forEach((feature, index) => {
      // 单个省份
      const province = new THREE.Object3D();
      province.name = feature.properties.name;
      const coordinates = feature.geometry.coordinates;
      const color = "yellow";
      // const color = ["重庆市", "北京市"].includes(feature.properties.name)
      //   ? "red"
      //   : "yellow";

      if (feature.geometry.type === "MultiPolygon") {
        // 多个，多边形
        coordinates.forEach((coordinate: any) => {
          // coordinate 多边形数据
          coordinate.forEach((rows: any) => {
            const mesh = drawExtrudeMesh(rows, color, projection1);
            const line = drawLine(rows, color, projection1);
            // 唯一标识
            mesh.name = feature.properties.name;
            province.add(mesh);
            province.add(line);
          });
        });
      }

      if (feature.geometry.type === "Polygon") {
        // 多边形
        coordinates.forEach((coordinate: any) => {
          const mesh = drawExtrudeMesh(coordinate, color, projection1);
          const line = drawLine(coordinate, color, projection1);
          // 唯一标识
          mesh.name = feature.properties.name;

          province.add(line);
          province.add(mesh);
        });
      }
      map.add(province);
    });
    scene.add(map);
  }

  function render() {
    // renderer.render(scene, camera);
    if (lastPick && lastPick.object.name === "重庆市") {
      renderer.render(scence_cq, camera);
    } else {
      renderer.render(scene, camera);
    }
    requestAnimationFrame(render);
  }

  useEffect(() => {
    const canvas = document.getElementById("map") as HTMLCanvasElement;
    init(canvas);
    initAxesHelper();
    initLight();
    render();
    setControl();

    handleCountryData(jsonData);
    // handleMapData(map, scene, jsonData, projection1);

    // 监听鼠标
    window.addEventListener("dblclick", onRay);

    function onRay(event: MouseEvent) {
      let pickPosition = getPickPosition(canvas, event);
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(pickPosition, camera);
      // 计算物体和射线的交点
      const intersects: any = raycaster.intersectObjects([map], true);
      // 数组大于0 表示有相交对象
      if (intersects.length > 0) {
        if (lastPick) {
          if (lastPick.object.name !== intersects[0].object.name) {
            lastPick.object.material.color.set("yellow");
            lastPick = null;
          }
        }
        if (intersects[0].object.name) {
          intersects[0].object.material.color.set("blue");
        }
        lastPick = intersects[0];
      } else {
        if (lastPick) {
          // 复原
          if (lastPick.object.name) {
            lastPick.object.material.color.set("yellow");
            lastPick = null;
          }
        }
      }
    }
  }, []);

  return (
    <div
      id="map"
      className="map"
      style={{ width: "100%", height: "100%" }}
    ></div>
  );
}
