import sharp from "sharp";

export async function base64ToPngBuffer(base64Data: string) {
  const buffer = Buffer.from(base64Data, "base64");
  return sharp(buffer).png().toBuffer();
}
export async function svgToPngBuffer(svgData: string) {
  return sharp(Buffer.from(svgData)).png().toBuffer();
}

export async function pngToBuffer(filePath: string) {
  const buffer = await sharp(filePath).toBuffer();
  console.log(buffer);
}
export const getImageData = async (
  imageSrc: string
): Promise<Uint8ClampedArray<ArrayBufferLike>> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // Cho phép tải ảnh từ nguồn bên ngoài nếu cần
    img.src = imageSrc;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);

      const imageData = ctx?.getImageData(0, 0, img.width, img.height).data;
      resolve(imageData as Uint8ClampedArray<ArrayBufferLike>);
    };

    img.onerror = reject;
  });
};
function createImage(objectURL: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.src = objectURL;
    image.setAttribute("crossOrigin", "anonymous");
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
  });
}
export type ImageFileType =
  | "image/apng"
  | "image/bmp"
  | "image/gif"
  | "image/jpeg"
  | "image/pjpeg"
  | "image/png"
  | "image/svg+xml"
  | "image/tiff"
  | "image/webp"
  | "image/x-icon";
export type ImageSize = {
  width: number;
  height: number;
};
export async function createCanvasContext(
  objectURL: string,
  canvasSize?: ImageSize
) {
  const img = await createImage(objectURL);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Failed to create a CanvasRenderingContext.");
  }
  const size: ImageSize = {
    width: 400,
    height: 300,
  };
  canvas.width = canvasSize ? canvasSize.width : size.width;
  canvas.height = canvasSize ? canvasSize.height : size.height;
  context.drawImage(img, 0, 0);
  return { context, size };
}

export const drawSvgOnCanvas = (svgUrl: string): Promise<HTMLCanvasElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // Cho phép vẽ ảnh từ nguồn ngoài
    img.src = svgUrl;
    const canvas = document.createElement("canvas");

    img.onload = () => {
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0); // Vẽ ảnh SVG lên canvas
      resolve(canvas);
    };

    img.onerror = reject;
  });
};
