import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  availableEffects,
  Effect,
  processMultipleImages,
} from "../utils/effectHelper";
import { createFormDataFromImages } from "../utils/helper";

export const useEffectPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const BASE_URL = import.meta.env.VITE_BASE_API_URL;

  // Get captured photos from navigation state
  const capturedPhotos = location.state?.capturedPhotos || [];

  // States
  const [selectedEffect, setSelectedEffect] = useState<Effect>(
    availableEffects[0]
  );
  const [processedImages, setProcessedImages] = useState<string[]>([]);
  const [isProcessingEffect, setIsProcessingEffect] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Initialize with original images
  useEffect(() => {
    if (capturedPhotos.length > 0) {
      setProcessedImages(capturedPhotos);
    } else {
      // If no photos, redirect back
      navigate("/capture");
    }
  }, [capturedPhotos, navigate]);

  const handleEffectChange = async (effect: Effect) => {
    setSelectedEffect(effect);
    setIsProcessingEffect(true);

    try {
      if (effect.id === "original") {
        setProcessedImages(capturedPhotos);
      } else {
        const processed = await processMultipleImages(capturedPhotos, effect);
        setProcessedImages(processed);
      }
    } catch (err) {
      console.error("Error processing effect:", err);
      setError("Failed to apply effect");
    } finally {
      setIsProcessingEffect(false);
    }
  };

  const handleContinueToResult = async () => {
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
      // Use processed images (with effects) for API call
      const formData = createFormDataFromImages(processedImages);
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
      console.log("Processed photos uploaded successfully", data);

      // Complete progress and navigate to result
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Navigate to Result page with result data and processed photos
      setTimeout(() => {
        navigate("/result", {
          state: {
            result: data,
            capturedPhotos: processedImages, // Use processed images
            effectUsed: selectedEffect,
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

  const handleRetakePhotos = () => {
    navigate("/capture");
  };

  const clearError = () => {
    setError(null);
    setIsUploading(false);
    setUploadProgress(0);
  };

  return {
    // States
    capturedPhotos,
    selectedEffect,
    processedImages,
    isProcessingEffect,
    isUploading,
    uploadProgress,
    error,
    availableEffects,

    // Actions
    handleEffectChange,
    handleContinueToResult,
    handleRetakePhotos,
    clearError,
  };
};
