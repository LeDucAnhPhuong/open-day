import pixelmatch from "pixelmatch";
export const checkPoint = async (
  canvasCode: HTMLCanvasElement,
  canvasSVG: HTMLCanvasElement
): Promise<{ percent: number; diffImage: string }> => {
  const width = 400;
  const height = 300;

  const diffSize = {
    width: 400,
    height: 300,
  };

  const image1 = canvasCode.getContext("2d") as CanvasRenderingContext2D;
  const image2 = canvasSVG.getContext("2d") as CanvasRenderingContext2D;

  const diffCanvas = document.createElement("canvas");
  diffCanvas.width = width;
  diffCanvas.height = height;
  const diffContext = diffCanvas.getContext("2d");

  const outputDiff =
    diffContext?.createImageData(diffSize.width, diffSize.height) ?? null;
  const numDiffPixels = pixelmatch(
    image1?.getImageData(0, 0, diffSize.width, diffSize.height).data,
    image2?.getImageData(0, 0, diffSize.width, diffSize.height).data,
    outputDiff?.data ?? null,
    width,
    height,
    {
      threshold: 0.1,
    }
  );
  const totalPixels = width * height;
  const similarity = ((totalPixels - numDiffPixels) / totalPixels) * 100;
  if (diffContext && outputDiff) diffContext.putImageData(outputDiff, 0, 0);

  const blob = await getBlobByCanvas(diffCanvas);
  return { percent: similarity, diffImage: URL.createObjectURL(blob) };
};

export async function getBlobByCanvas(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject();
      }
    }, "image/png");
  });
}
