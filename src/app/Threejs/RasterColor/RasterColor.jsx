import React, { useEffect, useRef } from "react";
import { Map } from "mapbox-gl";
import * as dat from "dat.gui";
import * as d3 from "d3";

const TOKEN =
  "pk.eyJ1Ijoiemhhb2Jhb2p1ZSIsImEiOiJjazNwaDV6amUwMzQ2M2RxbTAyaGhsZW5xIn0.Ai7Rpw6CdUZ5i56gP5vSiw";

const mixes = {
  luminosity: [0.2126, 0.7152, 0.0722, 0],
  average: [1 / 3, 1 / 3, 1 / 3, 0],
  red: [1, 0, 0, 0],
  green: [0, 1, 0, 0],
  blue: [0, 0, 1, 0],
  "decode terrain-rgb": [
    256 * 256 * 256 * 0.1,
    256 * 256 * 0.1,
    256 * 0.1,
    -10000,
  ],
  "decode population log-density": [
    256 * 256 * 256 * 8.348993603394451e-7,
    256 * 256 * 8.348993603394451e-7,
    256 * 8.348993603394451e-7,
    -9,
  ],
};

const ranges = {
  "[0, 1]": [0, 1],
  "[0, 8848]": [0, 8848],
  "[-3, 4]": [-3, 4],
};

const tilesets = {
  "mapbox.terrain-rgb": "mapbox.terrain-rgb",
  "mapbox.satellite": "mapbox.satellite",
};

const quantize = (interpolator, opac = (x) => 1, n = 100) =>
  d3.quantize(interpolator, n).map((c, i) => {
    const col = d3.rgb(c);
    const t = i / (n - 1);
    return [t, `rgba(${col.r},${col.g},${col.b},${col.opacity * opac(t)})`];
  });

const colorScales = {
  Viridis: quantize(d3.interpolateViridis),
  Greys: quantize((x) => d3.interpolateGreys(1 - x)),
  Turbo: quantize(d3.interpolateTurbo),
  Inferno: quantize(d3.interpolateInferno),
  Magma: quantize(d3.interpolateMagma),
  Plasma: quantize(d3.interpolatePlasma),
  Cividis: quantize(d3.interpolateCividis),
  Cool: quantize(d3.interpolateCool),
  Warm: quantize(d3.interpolateWarm),
  Cubehelix: quantize(d3.interpolateCubehelixDefault),
  RdPu: quantize((x) => d3.interpolateRdPu(1 - x)),
  YlGnBu: quantize((x) => d3.interpolateYlGnBu(1 - x)),
  Rainbow: quantize(d3.interpolateRainbow),
  Sinebow: quantize(d3.interpolateSinebow),
  RdBu: quantize(d3.interpolateRdBu),
  PopDensity: quantize(d3.interpolateMagma, (t) => 3 * t * t - 2 * t * t * t),
  Hypsometric: [
    [0.004, "rgb(48, 167, 228)"],
    [0.005, "rgb(57, 143, 83)"],
    [0.031, "rgb(116, 166, 129)"],
    [0.055, "rgb(178, 205, 174)"],
    [0.076, "rgb(188, 195, 169)"],
    [0.108, "rgb(221, 207, 153)"],
    [0.153, "rgb(211, 174, 114)"],
    [0.205, "rgb(207, 155, 103)"],
    [0.277, "rgb(179, 120, 85)"],
    [0.375, "rgb(227, 210, 197)"],
    [0.66, "rgb(255, 255, 255)"],
  ],
  "Transparent white": [
    [0.0, "rgba(255, 255, 255, 0)"],
    [1.0, "rgba(255, 255, 255, 1)"],
  ],
  Radar: [
    [0.0, "rgba(35,23,27,0)"],
    [0.0714, "rgba(68, 188, 116, 0.1)"],
    [0.1428, "rgba(30, 183, 66, 0.3)"],
    [0.2142, "rgba(45, 193, 81, 0.5)"],
    [0.2857, "rgba(38, 208, 43, 0.7)"],
    [0.3571, "rgba(58, 237, 55, 0.9)"],
    [0.4285, "rgb(143, 252, 95)"],
    [0.5, "rgb(190, 251, 81)"],
    [0.5714, "rgb(200, 235, 26)"],
    [0.6428, "rgb(245,199,43)"],
    [0.7142, "rgb(255,155,33)"],
    [0.7857, "rgb(251,105,25)"],
    [0.8571, "rgb(214,57,15)"],
    [0.9285, "rgb(168,22,4)"],
    [1.0, "rgb(183, 44, 204)"],
  ],
};

const presets = {
  Satellite: {
    tileset: "mapbox.satellite",
    rasterColor: "Cubehelix",
    rasterColorMix: "luminosity",
    rasterColorRange: "[0, 1]",
  },
  Terrain: {
    tileset: "mapbox.terrain-rgb",
    rasterColor: "Hypsometric",
    rasterColorMix: "decode terrain-rgb",
    rasterColorRange: "[0, 8848]",
    forcePngraw: true,
  },
};

function GUIParams() {
  this.preset = "Satellite";
  this.opacity = 1;
  Object.assign(this, presets[this.preset]);
}

const guiParams = new GUIParams();

export default function RasterColor() {
  useEffect(() => {
    const map = new Map({
      accessToken: TOKEN,
      container: "map",
      zoom: 0,
      center: [0, 0],
      style: { version: 8, layers: [], sources: {} },
      transformRequest(url, type) {
        if (type !== "Tile") return;
        const preset = presets[guiParams.preset];
        if (preset.forbid2x) url = url.replace("@2x", "");
        if (preset.forcePngraw) url = url.replace(".webp", ".pngraw");
        return { url };
      },
    });

    map.once("load", function () {
      var gui = (window.gui = new dat.GUI()); // eslint-disable-line

      const preset = gui.add(guiParams, "preset", Object.keys(presets));
      const tileset = gui.add(guiParams, "tileset", Object.keys(tilesets));
      const scale = gui.add(guiParams, "rasterColor", Object.keys(colorScales));
      const mix = gui.add(guiParams, "rasterColorMix", Object.keys(mixes));
      const range = gui.add(guiParams, "rasterColorRange", Object.keys(ranges));
      const opacity = gui.add(guiParams, "opacity", 0, 1);

      function setColorScale(scale) {
        const range = ranges[guiParams.rasterColorRange];
        const cs = colorScales[scale];
        map.setPaintProperty("raster", "raster-color", [
          "interpolate",
          ["linear"],
          ["raster-value"],
          ...cs
            .map(([pos, col]) => [range[0] + (range[1] - range[0]) * pos, col])
            .flat(),
        ]);
      }

      function setColorMix(mix) {
        map.setPaintProperty("raster", "raster-color-mix", mixes[mix]);
      }

      function setColorRange(range) {
        map.setPaintProperty("raster", "raster-color-range", ranges[range]);
        setColorScale(guiParams.rasterColor);
      }

      function setTileset(range) {
        setStyle(guiParams.tileset);
        setColorMix(guiParams.rasterColorMix);
        setColorScale(guiParams.rasterColor);
        setColorRange(guiParams.rasterColorRange);
      }

      function setPreset(presetName) {
        const preset = presets[presetName];
        Object.assign(guiParams, preset);
        setTileset(guiParams.tileset);
      }

      mix.onChange(setColorMix).listen();
      scale.onChange(setColorScale).listen();
      range.onChange(setColorRange).listen();
      tileset.onChange(setTileset).listen();
      preset.onChange(setPreset);

      opacity.onChange((opac) => {
        map.setPaintProperty("raster", "raster-opacity", opac);
      });

      setTileset(guiParams.tileset);
    });

    function setStyle(tileset) {
      map.setStyle({
        version: 8,
        sources: {
          mapbox: {
            type: "raster",
            url: "mapbox://mapbox.satellite",
            tileSize: 256,
          },
          raster: {
            type: "raster",
            tiles: [
              `https://api.mapbox.com/v4/${tilesets[tileset]}/{z}/{x}/{y}@2x.webp`,
            ],
            maxzoom: 14,
            tileSize: 256,
          },
        },
        layers: [
          {
            id: "background",
            type: "background",
            paint: {
              "background-color": "rgb(4,7,14)",
            },
          },
          {
            id: "satellite",
            type: "raster",
            source: "mapbox",
            "source-layer": "mapbox_satellite_full",
            paint: {
              "raster-saturation": -0.3,
              "raster-brightness-max": 0.5,
            },
          },
          {
            type: "raster",
            source: "raster",
            id: "raster",
            paint: {
              "raster-opacity": guiParams.opacity,
            },
          },
        ],
      });
    }

    return () => {};
  }, []);

  return <div id="map" style={{ width: "100%", height: "100%" }}></div>;
}
