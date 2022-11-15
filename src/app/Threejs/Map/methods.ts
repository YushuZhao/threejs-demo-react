import * as THREE from "three";

/**
 * 立体几何图形
 * @param polygon 多边形 点数组
 * @param color 材质颜色
 * @param projection 坐标转换方法
 * */
export function drawExtrudeMesh(
  polygon: any,
  color: string,
  projection: any,
  index?: number
) {
  const shape = new THREE.Shape();
  polygon.forEach((row: any, i: any) => {
    const [x, y] = projection(row)!;

    if (i === 0) {
      shape.moveTo(x, -y);
    }
    shape.lineTo(x, -y);
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

/**
 * 边框 图形绘制
 * @param polygon 多边形 点数组
 * @param color 材质颜色
 * @param projection 坐标转换方法
 * */
export function drawLine(polygon: any, color: string, projection: any) {
  const lineGeometry = new THREE.BufferGeometry();
  const pointsArray = new Array();
  polygon.forEach((row: any) => {
    const [x, y] = projection(row)!;
    // 创建三维点
    pointsArray.push(new THREE.Vector3(x, -y, 9));
    // 放入多个点
    lineGeometry.setFromPoints(pointsArray);
  });
  const lineMaterial = new THREE.LineBasicMaterial({
    color: color,
  });
  return new THREE.Line(lineGeometry, lineMaterial);
}

// 计算 以画布 开始为(0，0)点 的鼠标坐标
export function getCanvasRelativePosition(
  canvas: HTMLCanvasElement,
  event: MouseEvent
) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) * canvas.offsetWidth) / rect.width,
    y: ((event.clientY - rect.top) * canvas.offsetWidth) / rect.height,
  };
}

/**
 * 获取鼠标在three.js 中归一化坐标
 * */
export function getPickPosition(canvas: HTMLCanvasElement, event: MouseEvent) {
  let pickPosition = { x: 0, y: 0 };
  // 计算后 以画布 开始为 （0，0）点
  const pos = getCanvasRelativePosition(canvas, event);
  // 数据归一化
  pickPosition.x = (pos.x / canvas.offsetWidth) * 2 - 1;
  pickPosition.y = (pos.y / canvas.offsetWidth) * -2 + 1;
  return pickPosition;
}

export function handleMapData(
  map: THREE.Object3D,
  scene: THREE.Scene,
  jsonData: any,
  projection: any
) {
  const features = jsonData.features;
  features.forEach((feature: any) => {
    const province = new THREE.Object3D();
    province.name = feature.properties.name;
    const coordinates = feature.geometry.coordinates;
    const color = "yellow";
    if (feature.geometry.type === "MultiPolygon") {
      // 多个，多边形
      coordinates.forEach((coordinate: any) => {
        // coordinate 多边形数据
        coordinate.forEach((rows: any) => {
          const mesh = drawExtrudeMesh(rows, color, projection);
          const line = drawLine(rows, color, projection);
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
        const mesh = drawExtrudeMesh(coordinate, color, projection);
        const line = drawLine(coordinate, color, projection);
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
