import React, { useEffect } from "react";
import * as THREE from "three";

export default function Raycaster() {
  let camera: THREE.PerspectiveCamera;
  let scene: THREE.Scene;
  let renderer: THREE.WebGLRenderer;

  function init(canvas: HTMLCanvasElement) {
    initScene();
    initCamera();
    initRenderer(canvas);
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
    camera.position.set(0, 6, 5);
    camera.lookAt(0, 0, 0);
  }

  function initRenderer(canvas: HTMLCanvasElement) {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    canvas.appendChild(renderer.domElement);
  }

  function animate() {
    requestAnimationFrame(animate);
    render();
  }

  function render() {
    renderer.render(scene, camera);
  }

  function initLight() {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 10, 4);
    scene.add(light);
  }

  function initBox() {
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    const material = new THREE.MeshPhongMaterial({
      color: 0x6688aa,
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = -1;
    scene.add(cube);

    const material2 = new THREE.MeshPhongMaterial({
      color: 0x6688aa,
    });
    const cube2 = new THREE.Mesh(geometry, material2);
    cube2.position.x = 1;
    scene.add(cube2);
  }

  useEffect(() => {
    const canvas = document.getElementById("raycaster") as HTMLCanvasElement;
    init(canvas);
    initLight();
    initBox();
    animate();

    // 监听鼠标
    window.addEventListener("mousemove", onRay);
    // 全局对象
    let lastPick: any = null;
    function onRay(event: any) {
      let pickPosition = setPickPosition(event);

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(pickPosition, camera);
      // 计算物体和射线的交点
      const intersects = raycaster.intersectObjects(scene.children, true);

      // 数组大于0 表示有相交对象
      if (intersects.length > 0) {
        if (lastPick) {
          lastPick.object.material.color.set("yellow");
        }
        // if (intersects[0].object.properties) {
        //   intersects[0].object.material.color.set('blue')
        // }
        lastPick = intersects[0];
      } else {
        if (lastPick) {
          // 复原
          lastPick.object.material.color.set(0x6688aa);
          lastPick = null;
        }
      }
    }

    function getCanvasRelativePosition(event: any) {
      const rect = canvas.getBoundingClientRect();
      const x = ((event.clientX - rect.left) * canvas.offsetWidth) / rect.width;
      const y =
        ((event.clientY - rect.top) * canvas.offsetHeight) / rect.height;
      return {
        x,
        y,
      };
    }

    function setPickPosition(event: any) {
      let pickPosition = { x: 0, y: 0 };

      // 计算后 以画布 开始为 （0，0）点
      const pos = getCanvasRelativePosition(event);

      // 数据归一化
      pickPosition.x = (pos.x / canvas.offsetWidth) * 2 - 1;
      pickPosition.y = (pos.y / canvas.offsetHeight) * -2 + 1;

      return pickPosition;
    }
  }, []);

  return <div id="raycaster" className="raycaster"></div>;
}
