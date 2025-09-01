import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Palette, Camera, ArrowRight, RotateCcw } from "lucide-react";

interface EffectOption {
  id: string;
  name: string;
  displayName: string;
  description: string;
}

const effects: EffectOption[] = [
  {
    id: "original",
    name: "original",
    displayName: "ASLI",
    description: "Tanpa efek",
  },
  {
    id: "bw",
    name: "blackwhite",
    displayName: "HITAM PUTIH",
    description: "Efek klasik hitam putih",
  },
  {
    id: "sepia",
    name: "sepia",
    displayName: "SEPIA",
    description: "Efek vintage kecoklatan",
  },
];

// Mock data for development - replace with actual navigation logic
const mockCapturedPhotos = [
  "data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23ddd'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23666'%3EPhoto 1%3C/text%3E%3C/svg%3E",
  "data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23ccc'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23555'%3EPhoto 2%3C/text%3E%3C/svg%3E",
];

function EffectPage() {
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [selectedEffect, setSelectedEffect] = useState<EffectOption>(
    effects[0]
  );
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const BASE_URL = import.meta.env.VITE_BASE_API_URL || "http://localhost:8000";

  useEffect(() => {
    // In real implementation, get from navigation state
    // For demo purposes, use mock data
    setCapturedPhotos(mockCapturedPhotos);
    setPreviewImages(mockCapturedPhotos);

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // Apply effect to preview images when effect changes
  useEffect(() => {
    if (capturedPhotos.length > 0 && selectedEffect) {
      applyEffectToPreview();
    }
  }, [selectedEffect, capturedPhotos]);

  const applyEffectToPreview = async () => {
    if (selectedEffect.id === "original") {
      setPreviewImages(capturedPhotos);
      return;
    }

    try {
      const processedImages = await Promise.all(
        capturedPhotos.map(async (photo) => {
          if (selectedEffect.id === "bw") {
            return applyGrayscaleEffect(photo);
          } else if (selectedEffect.id === "sepia") {
            return applySepiaEffect(photo);
          }
          return photo;
        })
      );
      setPreviewImages(processedImages);
    } catch (error) {
      console.error("Error applying effect preview:", error);
      setPreviewImages(capturedPhotos);
    }
  };

  const applyGrayscaleEffect = (imageData: string): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = imageData;

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        const imgData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (imgData) {
          const data = imgData.data;
          for (let i = 0; i < data.length; i += 4) {
            const gray =
              data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
            data[i] = gray;
            data[i + 1] = gray;
            data[i + 2] = gray;
          }
          ctx?.putImageData(imgData, 0, 0);
        }
        resolve(canvas.toDataURL());
      };
    });
  };

  const applySepiaEffect = (imageData: string): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = imageData;

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        const imgData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (imgData) {
          const data = imgData.data;
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
            data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
            data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
          }
          ctx?.putImageData(imgData, 0, 0);
        }
        resolve(canvas.toDataURL());
      };
    });
  };

  const handleProcessWithEffect = async () => {
    setIsProcessing(true);
    setProcessingProgress(0);
    setError(null);

    // Simulate progress animation
    const progressInterval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 10;
      });
    }, 200);

    try {
      const formData = new FormData();

      // Use the effect-applied images for processing
      const imagesToProcess =
        selectedEffect.id === "original" ? capturedPhotos : previewImages;

      imagesToProcess.forEach((photo, index) => {
        const byteArray = Uint8Array.from(atob(photo.split(",")[1]), (c) =>
          c.charCodeAt(0)
        );
        const file = new Blob([byteArray], { type: "image/jpeg" });
        formData.append("photos", file, `photo${index + 1}.jpg`);
      });

      // Add effect parameter to the API call
      formData.append("effect", selectedEffect.name);

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
      console.log("Photos processed successfully with effect:", data);

      // Complete progress and navigate to result
      clearInterval(progressInterval);
      setProcessingProgress(100);

      // In real implementation, navigate to result page
      setTimeout(() => {
        // navigate("/result", {
        //   state: {
        //     result: data,
        //     capturedPhotos: imagesToProcess,
        //     selectedEffect: selectedEffect.displayName,
        //   },
        // });
        alert(
          `Processing completed with ${selectedEffect.displayName} effect!`
        );
        setIsProcessing(false);
        setProcessingProgress(0);
      }, 1000);
    } catch (err: any) {
      console.error("Processing failed:", err);
      clearInterval(progressInterval);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to process photos with effect"
      );
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  };

  const handleBackToCapture = () => {
    // In real implementation, navigate back to capture page
    alert("Navigating back to capture page...");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 flex flex-col items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div
            className="text-4xl font-bold mb-8 tracking-wider"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            <span
              className="text-white drop-shadow-lg animate-bounce"
              style={{ textShadow: "3px 3px 0px #666" }}
            >
              MEMUAT
            </span>
            <br />
            <span
              className="text-purple-800 drop-shadow-lg animate-bounce"
              style={{
                textShadow: "3px 3px 0px #333",
                animationDelay: "0.2s",
              }}
            >
              EFEK
            </span>
          </div>

          <motion.div
            className="w-16 h-16 border-4 border-white border-t-transparent rounded-full mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 relative overflow-hidden font-mono">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute top-0 left-0 w-full h-full bg-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 20 0 L 0 0 0 20' fill='none' stroke='%23000' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)' /%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 flex justify-between items-center">
        <div
          className="text-xl text-purple-800 hover:scale-105 transition-transform"
          style={{ fontFamily: '"Press Start 2P", monospace' }}
        >
          CEKREK.IN
        </div>
        <button
          onClick={handleBackToCapture}
          className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg border-2 border-purple-300 shadow-lg hover:scale-105 transition-transform"
        >
          <div className="text-purple-800 font-bold text-sm flex items-center gap-2">
            <RotateCcw size={16} />
            KEMBALI
          </div>
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center px-6">
        {/* Title Section */}
        <div
          className="text-center mb-8"
          style={{ fontFamily: '"Press Start 2P", monospace' }}
        >
          <div className="text-3xl md:text-4xl font-bold mb-2 tracking-wider">
            <span
              className="text-white drop-shadow-lg animate-bounce"
              style={{ textShadow: "3px 3px 0px #666" }}
            >
              PILIH
            </span>
          </div>
          <div className="text-3xl md:text-4xl font-bold mb-4 tracking-wider">
            <span
              className="text-blue-800 drop-shadow-lg animate-bounce"
              style={{
                textShadow: "3px 3px 0px #333",
                animationDelay: "0.2s",
              }}
            >
              EFEK
            </span>
            <span
              className="ml-4 text-orange-500 drop-shadow-lg animate-bounce"
              style={{
                textShadow: "3px 3px 0px #cc5500",
                animationDelay: "0.4s",
              }}
            >
              FOTO
            </span>
          </div>
          {!isProcessing && (
            <p className="text-sm text-purple-800">
              Pilih efek untuk foto Anda sebelum diproses
            </p>
          )}
          {isProcessing && (
            <p className="text-sm text-green-600 animate-pulse">
              Memproses foto dengan efek {selectedEffect.displayName}...
            </p>
          )}
        </div>

        {/* Processing Progress Bar */}
        {isProcessing && (
          <div className="w-full max-w-3xl mb-6">
            <div className="bg-gray-700 rounded-full h-6 overflow-hidden border-2 border-white">
              <motion.div
                className="bg-gradient-to-r from-purple-400 to-pink-500 h-full rounded-full flex items-center justify-center"
                initial={{ width: 0 }}
                animate={{ width: `${processingProgress}%` }}
                transition={{ duration: 0.3 }}
              >
                <span
                  className="text-white text-xs font-bold"
                  style={{ fontFamily: '"Press Start 2P", monospace' }}
                >
                  {Math.round(processingProgress)}%
                </span>
              </motion.div>
            </div>
            <p
              className="text-center text-purple-800 text-xs mt-2"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
            >
              MEMPROSES DENGAN EFEK {selectedEffect.displayName}...
            </p>
          </div>
        )}

        {/* Photo Preview */}
        {!isProcessing && (
          <motion.div
            className="w-full max-w-4xl bg-gray-900 rounded-2xl overflow-hidden border-4 border-purple-500 shadow-2xl mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Preview Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-3">
              <div className="flex items-center justify-center space-x-2">
                <Palette className="text-white" size={24} />
                <span className="text-white font-bold text-lg">
                  PREVIEW EFEK: {selectedEffect.displayName}
                </span>
              </div>
            </div>

            {/* Photos Grid */}
            <div className="bg-black p-4">
              <div className="grid grid-cols-2 gap-4">
                {previewImages.map((image, idx) => (
                  <motion.div
                    key={idx}
                    className="aspect-video border-4 border-gray-400 rounded-lg overflow-hidden shadow-lg bg-white"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * idx }}
                  >
                    <img
                      src={image}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Effect Selection */}
        {!isProcessing && (
          <motion.div
            className="w-full max-w-4xl bg-white/90 backdrop-blur-sm rounded-2xl border-4 border-purple-300 shadow-2xl p-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3
              className="text-center text-purple-800 text-xl mb-6"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
            >
              PILIHAN EFEK
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {effects.map((effect) => (
                <motion.button
                  key={effect.id}
                  onClick={() => setSelectedEffect(effect)}
                  className={`p-4 rounded-lg border-3 transition-all duration-200 ${
                    selectedEffect.id === effect.id
                      ? "border-purple-600 bg-purple-100 shadow-lg scale-105"
                      : "border-gray-300 bg-white hover:border-purple-400 hover:shadow-md"
                  }`}
                  whileHover={{
                    scale: selectedEffect.id === effect.id ? 1.05 : 1.02,
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-center">
                    <div
                      className={`text-lg font-bold mb-2 ${
                        selectedEffect.id === effect.id
                          ? "text-purple-800"
                          : "text-gray-700"
                      }`}
                      style={{ fontFamily: '"Press Start 2P", monospace' }}
                    >
                      {effect.displayName}
                    </div>
                    <p
                      className={`text-xs ${
                        selectedEffect.id === effect.id
                          ? "text-purple-600"
                          : "text-gray-500"
                      }`}
                    >
                      {effect.description}
                    </p>
                    {selectedEffect.id === effect.id && (
                      <motion.div
                        className="mt-2 w-full h-2 bg-purple-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        {!isProcessing && (
          <motion.div
            className="flex flex-wrap gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              onClick={handleProcessWithEffect}
              className="flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full text-xl border-3 border-white shadow-2xl"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Camera size={24} />
              <span>PROSES FOTO</span>
              <ArrowRight size={24} />
            </motion.button>

            <motion.button
              onClick={handleBackToCapture}
              className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-4 rounded-full font-bold transition-all duration-200"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw size={20} />
              <span>FOTO ULANG</span>
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-red-600 text-white p-6 rounded-lg max-w-md text-center mx-4">
            <h3
              className="text-lg font-bold mb-4"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
            >
              ERROR!
            </h3>
            <p className="mb-4 text-sm">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setIsProcessing(false);
                setProcessingProgress(0);
              }}
              className="px-6 py-2 bg-white text-red-600 rounded-lg font-bold hover:bg-gray-100 transition-colors"
            >
              TUTUP
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default EffectPage;
