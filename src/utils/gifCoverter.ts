// @ts-ignore - gifshot doesn't have proper TypeScript definitions
import gifshot from "gifshot";

interface GifOptions {
  width: number;
  height: number;
  frameDuration: number;
  quality: number;
}

export const convertToGif = (
  images: File[],
  options: GifOptions
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Convert File objects to image URLs
    const imageUrls = images.map((file) => URL.createObjectURL(file));

    // Configure gifshot options
    const gifOptions = {
      images: imageUrls,
      gifWidth: options.width,
      gifHeight: options.height,
      interval: options.frameDuration,
      quality: options.quality,
      numWorkers: 2,
      progressCallback: (captureProgress: number) => {
        console.log("Progress:", captureProgress);
      },
      completeCallback: () => {
        // Clean up object URLs
        imageUrls.forEach((url) => URL.revokeObjectURL(url));
      },
    };

    gifshot.createGIF(gifOptions, (obj: any) => {
      if (!obj.error) {
        resolve(obj.image);
      } else {
        reject(new Error(obj.error));
      }
    });
  });
};
