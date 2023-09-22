import React, { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import {
  CSS3DRenderer,
  CSS3DObject,
} from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";

import "./style.css";

export default function Periodictable() {
  const [state, setState] = useState(1);
  // 保存数据
  const [css3DObjects, setCss3DObjects] = useState();
  const [datas, setDatas] = useState();
  const [type, setType] = useState("table");

  let cameraRef = useRef();
  let sceneRef = useRef();
  let groupRef = useRef();
  let rendererRef = useRef();
  let controlsRef = useRef();
  let renderRef = useRef();
  let rotateId = null;

  const imageWidth = 120;
  const imageHeight = 160;
  const spacing = 10;

  // 请求数据 => 格式化数据 => 渲染

  // [{
  //   type: 'text' | 'img',
  //   data: 'xxx' | 'data:image',
  //   x: number
  //   y: number
  // }]

  // 请求数据
  useEffect(() => {
    const getData = async () => {
      const ds_ids = [1, 2, 3, 4].slice(0, state).join(",");
      const res = await fetch(
        `http://gis-service-api.test-out.hotgrid.cn:8780/earth/grid-list?ds_ids=${ds_ids}&start_time=2023-08-20&end_time=2023-09-01&time_type=day&grid_ids=8140bffffffffff`
      ).then((res) => res.json());
      const result = res.result;
      const format = [];
      result.forEach((day, i) => {
        const { dt, img } = day;
        format.push({
          type: "text",
          data: dt,
          x: 1,
          y: i + 1,
        });
        img.forEach((url, index) => {
          format.push({
            type: "img",
            data: url,
            x: index + 2,
            y: i + 1,
          });
        });
      });
      setDatas(format);
    };
    getData();
  }, [state]);

  // 格式化数据
  useEffect(() => {
    TWEEN.removeAll();
    css3DObjects?.forEach((item) => {
      sceneRef.current.remove(item);
      groupRef.current.remove(item);
    });
    const elements = datas?.map((item, i) => {
      const objectCSS = createElement(item);
      sceneRef.current.add(objectCSS);
      groupRef.current.add(objectCSS);
      return objectCSS;
    });
    setCss3DObjects(elements);
    console.log(elements);
  }, [datas]);

  const createElement = (elem) => {
    const { type, data } = elem;
    if (type === "text") {
      const element = document.createElement("div");
      element.className = "element";
      element.style.backgroundColor =
        "rgba(0,127,127," + (Math.random() * 0.5 + 0.25) + ")";
      const symbol = document.createElement("div");
      symbol.className = "symbol";
      symbol.textContent = data;
      element.appendChild(symbol);

      const objectCSS = new CSS3DObject(element);
      return objectCSS;
    } else {
      const element = new Image();
      element.src = data;
      element.className = "element";

      const objectCSS = new CSS3DObject(element);
      return objectCSS;
    }
  };

  // 按类型渲染
  useEffect(() => {
    const vector = new THREE.Vector3();

    css3DObjects?.forEach((objectCSS, i) => {
      const object = generateFunctions[type](
        vector,
        css3DObjects.length,
        i,
        datas[i]
      );

      new TWEEN.Tween(objectCSS.position)
        .to(
          { x: object.position.x, y: object.position.y, z: object.position.z },
          Math.random() * 2000 + 2000
        )
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();

      new TWEEN.Tween(objectCSS.rotation)
        .to(
          { x: object.rotation.x, y: object.rotation.y, z: object.rotation.z },
          Math.random() * 2000 + 2000
        )
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();
    });
  }, [css3DObjects, type]);

  const generateTableShape = (vector, length, i, { x, y }) => {
    const object = new THREE.Object3D();
    object.position.x = x * (imageWidth + spacing) - 1330;
    object.position.y = -y * (imageHeight + spacing) + 990;
    return object;
  };

  const generateSphereShape = (vector, length, i) => {
    const phi = Math.acos(-1 + (2 * i) / length);
    const theta = Math.sqrt(length * Math.PI) * phi;
    const object = new THREE.Object3D();
    object.position.setFromSphericalCoords(800, phi, theta);
    vector.copy(object.position).multiplyScalar(2);
    object.lookAt(vector);
    return object;
  };

  const generateHelixShape = (vector, length, i) => {
    const theta = i * 0.175 + Math.PI;
    const y = -(i * 8) + 450;

    const object = new THREE.Object3D();

    object.position.setFromCylindricalCoords(900, theta, y);

    vector.x = object.position.x * 2;
    vector.y = object.position.y;
    vector.z = object.position.z * 2;

    object.lookAt(vector);
    return object;
  };

  const generateGridShape = (vector, length, i) => {
    const object = new THREE.Object3D();

    object.position.x = (i % 5) * 400 - 800;
    object.position.y = -(Math.floor(i / 5) % 5) * 400 + 800;
    object.position.z = Math.floor(i / 25) * 1000 - 2000;

    return object;
  };

  const generateFunctions = {
    table: generateTableShape,
    sphere: generateSphereShape,
    helix: generateHelixShape,
    grid: generateGridShape,
  };

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    camera.position.z = 3000;

    const group = new THREE.Group();
    scene.add(group);

    const renderer = new CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    const elem = document.getElementById("periodictable");
    elem.appendChild(renderer.domElement);

    const controls = new TrackballControls(camera, renderer.domElement);
    controls.minDistance = 500;
    controls.maxDistance = 6000;
    controls.rotateSpeed = 0.5;
    controls.addEventListener("change", render);

    sceneRef.current = scene;
    cameraRef.current = camera;
    groupRef.current = group;
    rendererRef.current = renderer;
    controlsRef.current = controls;
    renderRef.current = render;
    animate();

    window.addEventListener("resize", onWindowResize);

    function render() {
      renderer.render(scene, camera);
    }

    function animate() {
      requestAnimationFrame(animate);
      TWEEN.update();
      controls.update();
      render();
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      render();
    }

    return () => {
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);

  function startRotate(group, render) {
    if (rotateId == null) {
      rotateId = setInterval(() => {
        group.rotation.y -= 0.004;
        render();
      }, 50);
    }
  }

  function clearRotate() {
    if (rotateId != null) {
      clearInterval(rotateId);
      rotateId = null;
    }
  }

  return (
    <div className="periodictable-container">
      <div id="periodictable" className="periodictable"></div>
      <div id="menu">
        <button
          id="table"
          onClick={() => {
            setType("table");
            clearRotate();
          }}
        >
          TABLE
        </button>
        <button
          id="sphere"
          onClick={() => {
            setType("sphere");
            startRotate(groupRef.current, renderRef.current);
          }}
        >
          SPHERE
        </button>
        <button
          id="helix"
          onClick={() => {
            setType("helix");
            startRotate(groupRef.current, renderRef.current);
          }}
        >
          HELIX
        </button>
        <button
          id="grid"
          onClick={() => {
            setType("grid");
            startRotate(groupRef.current, renderRef.current);
          }}
        >
          GRID
        </button>
        <button
          onClick={() => {
            setState((pre) => pre + 1);
          }}
        >
          重绘
        </button>
      </div>
    </div>
  );
}
