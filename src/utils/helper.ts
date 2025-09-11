export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

export const downloadImages = (images: string[]): void => {
  images.forEach((image, index) => {
    const link = document.createElement("a");
    link.download = `cekrek-${Date.now()}-photo${index + 1}.jpg`;
    link.href = image;
    link.click();
  });
};

export const convertImageToFile = (
  base64Image: string,
  filename: string
): Blob => {
  const byteArray = Uint8Array.from(atob(base64Image.split(",")[1]), (c) =>
    c.charCodeAt(0)
  );
  return new Blob([byteArray], { type: "image/jpeg" });
};

export const createFormDataFromImages = (images: string[]): FormData => {
  const formData = new FormData();
  images.forEach((photo, index) => {
    const file = convertImageToFile(photo, `photo${index + 1}.jpg`);
    formData.append("photos", file, `photo${index + 1}.jpg`);
  });
  return formData;
};
