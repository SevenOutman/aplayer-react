/// <reference types="lib" />

declare module "@pioug/colorthief" {
  type Color = [r: number, g: number, b: number];

  export default class ColorThief {
    getColor(sourceImage: Image, quality?: number): Color;
  }
}
