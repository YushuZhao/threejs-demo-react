import React, { useState, useEffect, useRef } from "react";
import mapboxgl, { GeoJSONSource, Map } from "mapbox-gl";

import { FeatureCollection, LineString, Point } from "geojson";
import * as turf from "@turf/turf";

import "./style.css";

const TOKEN =
  "pk.eyJ1Ijoiemhhb2Jhb2p1ZSIsImEiOiJjazNwaDV6amUwMzQ2M2RxbTAyaGhsZW5xIn0.Ai7Rpw6CdUZ5i56gP5vSiw";

const pathList = [
  [116.41841095799873, 39.90674188932928],
  [116.85440222480167, 39.987208961015085],
  [117.03202829646318, 40.18487832235314],
  [117.37920652743526, 40.19721359535808],
  [117.21772828047068, 39.99339481505609],
  [117.69408910901512, 39.863374269659204],
  [117.33883696569364, 39.82618019357167],
  [117.18543263107847, 39.62125278846335],
  [117.06432394585545, 39.832380605434395],
];

const geojson: FeatureCollection<LineString> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {},
      geometry: {
        coordinates: [],
        type: "LineString",
      },
    },
  ],
};

const geojsonIcon: FeatureCollection<Point> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Point",
        coordinates: pathList[0],
      },
    },
  ],
};

export default function Mapbox() {
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: "mapbox",
      style: "mapbox://styles/zhaobaojue/clmh6yuhn01jd01r4792zh753",
      center: [116.39104, 39.90502],
      zoom: 3,
      accessToken: TOKEN,
    });

    map.flyTo({
      speed: 0.8,
      center: [116.50240990313654, 39.94331954870344],
      zoom: 18,
      curve: 1,
    });

    map.on("load", async () => {
      const data = await fetch("/map/map.geojson").then((res) => res.json());

      // 高铁路线全程
      map.addSource("railway-source", {
        type: "geojson",
        lineMetrics: true,
        data: data,
      });

      map.addLayer({
        id: "railway-layer",
        type: "line",
        source: "railway-source",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#00ff40",
          "line-width": 8,
        },
      });

      // 动态路线
      map.addSource("path-source", {
        type: "geojson",
        lineMetrics: true,
        data: geojson as FeatureCollection,
      });

      map.addLayer({
        id: "path-layer",
        type: "line",
        source: "path-source",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#32a9f2",
          "line-width": 8,
        },
      });

      // 动态icon
      map.addSource("icon-source", {
        type: "geojson",
        data: geojsonIcon,
      });

      map.loadImage("/images/train.png", (err, image: any) => {
        if (err) throw err;
        map.addImage("train", image);
        map.addLayer({
          id: "icon",
          source: "icon-source",
          type: "symbol",
          layout: {
            "icon-image": "train",
            "icon-size": 1,
            "icon-rotate": ["get", "bearing"],
            "icon-rotation-alignment": "map",
            "icon-allow-overlap": true,
            "icon-ignore-placement": true,
          },
        });
      });

      // 动画方式
      // let counter: number = 0;
      // const coord = data.features[0].geometry.coordinates;
      // function animate(counter: number) {
      //   if (counter > coord.length) return;
      //   geojson.features[0].geometry.coordinates.push(coord[counter]);
      //   console.log(geojson);
      //   (map.getSource("path-source") as GeoJSONSource).setData(geojson);
      //   counter += 1;
      //   requestAnimationFrame(() => animate(counter));
      // }

      // animate(counter);

      // 定时器方式
      // let counter = 0;
      // const timer = setInterval(() => {
      //   if (counter < pathList.length) {
      //     geojson.features[0].geometry.coordinates.push(pathList[counter]);
      //     (map.getSource("path-source") as GeoJSONSource).setData(geojson);
      //     counter += 1;
      //   } else {
      //     window.clearInterval(timer);
      //   }
      // }, 1000);

      // iconPoint 动态运动
      const startAnimate = () => {
        let counter = 0;
        const coord = data.features[0].geometry.coordinates;
        const timer = setInterval(() => {
          if (counter < coord.length) {
            const start =
              coord[counter >= coord.length ? counter - 1 : counter];
            const end = coord[counter >= coord.length ? counter : counter + 1];

            geojsonIcon.features[0].geometry.coordinates = coord[counter];
            (geojsonIcon.features[0].properties as any).bearing =
              turf.bearing(turf.point(start), turf.point(end)) - 90;
            geojson.features[0].geometry.coordinates.push(coord[counter]);
            (map.getSource("icon-source") as GeoJSONSource).setData(
              geojsonIcon
            );
            (map.getSource("path-source") as GeoJSONSource).setData(geojson);
            counter += 1;
          } else {
            window.clearInterval(timer);
          }
        }, 100);
      };

      setTimeout(() => {
        startAnimate();
      }, 5000);

      setTimeout(() => {
        map.flyTo({
          speed: 0.8,
          center: [120.04352697483318, 40.22657593149603],
          zoom: 7,
          curve: 1,
        });
      }, 5000);
    });

    map.on("click", (e) => {
      console.log(e); // 121.60359708351075,39.01345544027737
    });
  }, []);

  return <div id="mapbox"></div>;
}
