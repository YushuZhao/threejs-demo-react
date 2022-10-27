import React, { useEffect } from "react";
import * as THREE from "three";
import * as dat from "dat.gui";
import Stats from "three/examples/jsm/libs/stats.module";

function Cube() {
  /*
   * Creating a scene
   */
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  /*
   * create a cube
   */
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshLambertMaterial({
    color: 0xff0051,
    flatShading: true,
  });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  cube.position.set(0, 1, 0);
  cube.castShadow = true;
  cube.name = "cube";

  /*
   * create a blue LineBasicMaterial
   */
  // const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
  // const points = [];
  // points.push(new THREE.Vector3(-50, 0, 0));
  // points.push(new THREE.Vector3(0, 50, 0));
  // points.push(new THREE.Vector3(50, 0, 0));
  // const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  // const line = new THREE.Line(lineGeometry, lineMaterial);
  // scene.add(line);

  /*
   * create a wireframeCube
   */
  // const wireGeometry = new THREE.BoxGeometry(3, 3, 3);
  // const wireMaterial = new THREE.MeshBasicMaterial({
  //   color: "#dadada",
  //   wireframe: true,
  //   transparent: true,
  // });
  // const wireframeCube = new THREE.Mesh(wireGeometry, wireMaterial);
  // wireframeCube.name = "wireframeCube";
  // scene.add(wireframeCube);

  /**
   * create a planeGeometry
   */
  const planeGeometry = new THREE.PlaneGeometry(100, 100);
  const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.set(15, 0, 0);
  plane.receiveShadow = true;
  scene.add(plane);

  // 相机位置
  camera.position.set(2, 2, 10);
  camera.lookAt(0, 0, 0);

  // 轴线辅助线
  const axesHelper = new THREE.AxesHelper(10);
  scene.add(axesHelper);

  // 环境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // 点光源
  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(25, 50, 25);
  pointLight.castShadow = true;
  pointLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
  pointLight.shadow.camera.far = 130;
  pointLight.shadow.camera.near = 40;
  scene.add(pointLight);

  useEffect(() => {
    const dom = document.getElementById("cube") as HTMLCanvasElement;
    dom.appendChild(renderer.domElement);

    // 自适应场景
    window.addEventListener(
      "resize",
      function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      },
      false
    );

    console.log(scene.children);
    let findObj = scene.getObjectByName("cube");
    console.log(findObj);

    // GUI
    const gui = new dat.GUI();
    // 创建对象,存放所有需要改变的属性值
    const controlsObj = {
      rotationSpeed: 0.01,
      positionX: 0,
      visible: true,
    };

    gui.add(controlsObj, "rotationSpeed", 0, 1);
    gui.add(controlsObj, "positionX", -20, 20);
    gui.add(controlsObj, "visible");

    function animate() {
      requestAnimationFrame(animate);
      // cube.rotation.x += controlsObj.rotationSpeed;
      // cube.rotation.y += controlsObj.rotationSpeed;
      cube.position.x = controlsObj.positionX;
      cube.visible = controlsObj.visible;

      // cube.rotation.x += 0.01;
      // cube.rotation.y += 0.01;

      // wireframeCube.rotation.x -= 0.01;
      // wireframeCube.rotation.y -= 0.01;

      scene.traverse(function (obj) {
        if (obj instanceof THREE.Mesh && obj !== plane) {
          obj.rotation.x += controlsObj.rotationSpeed;
          obj.rotation.y += controlsObj.rotationSpeed;
        }
      });

      renderer.render(scene, camera);
    }
    animate();

    return () => {
      gui.destroy();
    };
  }, []);

  return <div id="cube" className="cube"></div>;
}

export default Cube;
