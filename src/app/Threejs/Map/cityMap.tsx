import React, { useEffect } from "react";
import * as THREE from "three";
import * as d3 from "d3";

import { drawExtrudeMesh, drawLine, handleMapData } from "./methods";

// import jsonData from "../../../assets/map/China.json";
import jsonData from "../../../assets/map/ChongQing.json";

type JsonObj = typeof jsonData;

// 重庆市为中心
const projection2 = d3
  .geoMercator()
  .center([106.557691, 29.559296])
  .translate([0, 0]);

const scence_cq = new THREE.Scene();
const map_cq = new THREE.Object3D();

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scence_cq.add(ambientLight);

// 解析数据
function handleCityData(jsonData: JsonObj) {
  const features = jsonData.features;
  features.forEach((feature) => {
    // 单个省份 对象
    const province = new THREE.Object3D();
    province.name = feature.properties.name;
    const coordinates = feature.geometry.coordinates;
    const color = "yellow";

    if (feature.geometry.type === "MultiPolygon") {
      // 多个，多边形
      coordinates.forEach((coordinate) => {
        // coordinate 多边形数据
        coordinate.forEach((rows) => {
          const mesh = drawExtrudeMesh(rows, color, projection2);
          const line = drawLine(rows, color, projection2);
          // 唯一标识
          mesh.name = feature.properties.name;

          province.add(line);
          province.add(mesh);
        });
      });
    }

    if (feature.geometry.type === "Polygon") {
      // 多边形
      coordinates.forEach((coordinate) => {
        const mesh = drawExtrudeMesh(coordinate, color, projection2);
        const line = drawLine(coordinate, color, projection2);
        // 唯一标识
        mesh.name = feature.properties.name;

        province.add(line);
        province.add(mesh);
      });
    }
    map_cq.add(province);
  });
  map_cq.scale.set(8, 8, 1);
  scence_cq.add(map_cq);
}

handleCityData(jsonData);
// handleMapData(map_cq, scence_cq, jsonData, projection1);

export { scence_cq };
