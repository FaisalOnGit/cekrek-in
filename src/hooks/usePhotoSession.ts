import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createFormDataFromImages } from "../utils/helper";

export interface PhotoLayout {
  name: string;
  totalPhoto: number;
}

export const photoLayouts: PhotoLayout[] = [
  { name: "4 Pose", totalPhoto: 4 },
  { name: "6 Pose", totalPhoto: 6 },
];

export const delayOptions = [
  { label: "3 Detik", value: 3 },
  { label: "5 Detik", value: 5 },
  { label: "10 Detik", value: 10 },
];

export const usePhotoSession = () => {
  const navigate = useNavigate();
  const webcamRef = useRef<any>(null);
  const BASE_URL = import.meta.env.VITE_BASE_API_URL;

  // States
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [showSettings, setShowSettings] = useState(true);
  const [selectedLayout, setSelectedLayout] = useState<PhotoLayout>(
    photoLayouts[0]
  );
  const [selectedDelay, setSelectedDelay] = useState(3);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  // Upload states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const startPhotoSession = () => {
    setShowSettings(false);
    setCurrentPhotoIndex(0);
    setCapturedImages([]);
  };

  const startCountdown = () => {
    if (isCapturing) return;
    setIsCapturing(true);
    setCountdown(selectedDelay);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          capturePhoto();
          return null;
        }
        return (prev ?? 0) - 1;
      });
    }, 1000);
  };

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) {
      setIsCapturing(false);
      return;
    }

    const newImages = [...capturedImages, imageSrc];
    const nextIndex = currentPhotoIndex + 1;
    setCapturedImages(newImages);
    setCurrentPhotoIndex(nextIndex);

    // Auto-upload when all photos are captured
    if (nextIndex >= selectedLayout.totalPhoto) {
      handleSubmit(newImages);
    }

    setIsCapturing(false);
  }, [webcamRef, capturedImages, currentPhotoIndex, selectedLayout.totalPhoto]);

  const handleSubmit = async (photos: string[]) => {
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    // Simulate progress animation
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 10;
      });
    }, 200);

    try {
      const formData = createFormDataFromImages(photos);
      const selectedTemplateId = localStorage.getItem("selectedTemplateId");

      const response = await fetch(
        `${BASE_URL}/process/${selectedTemplateId}`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Photos uploaded successfully", data);

      // Complete progress and navigate directly to result
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Navigate immediately to Result page with result data
      setTimeout(() => {
        navigate("/effect", {
          state: {
            result: data,
            capturedPhotos: photos,
          },
        });
      }, 1000);
    } catch (err: any) {
      console.error("Upload failed:", err);
      clearInterval(progressInterval);
      setError(
        err.response?.data?.message || err.message || "Failed to upload photos"
      );
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const retakePhoto = () => {
    if (capturedImages.length === 0) return;
    const newImages = capturedImages.slice(0, -1);
    setCapturedImages(newImages);
    setCurrentPhotoIndex(Math.max(0, currentPhotoIndex - 1));
  };

  const resetSession = () => {
    setShowSettings(true);
    setCurrentPhotoIndex(0);
    setCapturedImages([]);
    setCountdown(null);
    setIsCapturing(false);
    setIsUploading(false);
    setUploadProgress(0);
    setError(null);
    setResult(null);
  };

  const switchCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  const handleLayoutChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const layout = photoLayouts.find((l) => l.name === e.target.value);
    if (layout) setSelectedLayout(layout);
  };

  const handleDelayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDelay(Number(e.target.value));
  };

  const clearError = () => {
    setError(null);
    setIsUploading(false);
    setUploadProgress(0);
  };

  const isSessionComplete =
    currentPhotoIndex >= selectedLayout.totalPhoto && !isUploading;

  return {
    // Refs
    webcamRef,

    // States
    capturedImages,
    facingMode,
    showSettings,
    selectedLayout,
    selectedDelay,
    currentPhotoIndex,
    countdown,
    isCapturing,
    isUploading,
    uploadProgress,
    error,
    result,
    isSessionComplete,

    // Actions
    startPhotoSession,
    startCountdown,
    retakePhoto,
    resetSession,
    switchCamera,
    handleLayoutChange,
    handleDelayChange,
    clearError,
  };
};
