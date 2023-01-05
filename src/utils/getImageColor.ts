import ColorThief from "@pioug/colorthief";

let colorThiefSingleton: ColorThief;

export function getImageColor(
  imageUrl: string
): Promise<[r: number, g: number, b: number]> {
  const colorThief =
    colorThiefSingleton ?? (colorThiefSingleton = new ColorThief());

  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => {
      resolve(colorThief.getColor(img));
    };
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
  });
}
