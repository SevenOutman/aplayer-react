/// <reference types="lib" />

declare module "colorthief" {
  type Color = [r: number, g: number, b: number];

  export default class ColorThief {
    getColor(sourceImage: Image, quality?: number): Color;
  }
}
