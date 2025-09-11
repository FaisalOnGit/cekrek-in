// Effect helper functions for image processing

export interface Effect {
  id: string;
  name: string;
  filter: string;
  intensity?: number;
}

export const availableEffects: Effect[] = [
  { id: "original", name: "Original", filter: "none" },
  {
    id: "vintage",
    name: "Vintage",
    filter: "sepia(80%) saturate(120%) contrast(110%)",
  },
  { id: "blackwhite", name: "B&W", filter: "grayscale(100%) contrast(120%)" },
  { id: "cool", name: "Cool", filter: "hue-rotate(180deg) saturate(150%)" },
  {
    id: "warm",
    name: "Warm",
    filter: "hue-rotate(30deg) saturate(130%) brightness(110%)",
  },
  {
    id: "dramatic",
    name: "Dramatic",
    filter: "contrast(150%) brightness(90%) saturate(120%)",
  },
  {
    id: "soft",
    name: "Soft",
    filter: "blur(0.5px) brightness(110%) saturate(90%)",
  },
  {
    id: "vibrant",
    name: "Vibrant",
    filter: "saturate(200%) contrast(120%) brightness(105%)",
  },
];

export const applyEffectToImage = (
  imageElement: HTMLImageElement,
  effect: Effect
): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      resolve(imageElement.src);
      return;
    }

    canvas.width = imageElement.naturalWidth;
    canvas.height = imageElement.naturalHeight;

    // Apply CSS filter to canvas context
    ctx.filter = effect.filter;
    ctx.drawImage(imageElement, 0, 0);

    // Convert to base64
    const dataURL = canvas.toDataURL("image/jpeg", 0.9);
    resolve(dataURL);
  });
};

export const processMultipleImages = async (
  images: string[],
  effect: Effect
): Promise<string[]> => {
  const processedImages: string[] = [];

  for (const imageSrc of images) {
    const img = new Image();
    img.crossOrigin = "anonymous";

    const processedImage = await new Promise<string>((resolve) => {
      img.onload = async () => {
        const result = await applyEffectToImage(img, effect);
        resolve(result);
      };
      img.src = imageSrc;
    });

    processedImages.push(processedImage);
  }

  return processedImages;
};

export const downloadProcessedImages = (
  images: string[],
  effectName: string
): void => {
  images.forEach((image, index) => {
    const link = document.createElement("a");
    link.download = `cekrek-${effectName}-${Date.now()}-photo${index + 1}.jpg`;
    link.href = image;
    link.click();
  });
};
