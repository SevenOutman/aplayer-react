import { FastAverageColor } from "fast-average-color";

let facSingleton: FastAverageColor;

/**
 * @returns hex color
 */
export function getImageColor(imageUrl: string): Promise<string> {
  const fac = facSingleton ?? (facSingleton = new FastAverageColor());

  return fac
    .getColorAsync(imageUrl, {
      ignoredColor: [255, 255, 255, 255], // Ignore white because the default background color of APlayer is white
    })
    .then((color) => {
      return color.hex;
    });
}
