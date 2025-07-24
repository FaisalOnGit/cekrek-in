import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { Camera, RotateCcw, Download, Settings, Upload, X } from "lucide-react";

interface PhotoLayout {
  name: string;
  totalPhoto: number;
}

const photoLayouts: PhotoLayout[] = [
  { name: "2 Pose", totalPhoto: 2 },
  { name: "3 Pose", totalPhoto: 3 },
  { name: "4 Pose", totalPhoto: 4 },
];

const delayOptions = [
  { label: "3 Detik", value: 3 },
  { label: "5 Detik", value: 5 },
  { label: "10 Detik", value: 10 },
];

function Test() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(35 * 60); // 35 minutes in seconds
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

  // New states for POST logic
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const webcamRef = useRef<Webcam>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

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

  // POST logic from capture page with navigation to result
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
      const formData = new FormData();
      photos.forEach((photo, index) => {
        const byteArray = Uint8Array.from(atob(photo.split(",")[1]), (c) =>
          c.charCodeAt(0)
        );
        const file = new Blob([byteArray], { type: "image/jpeg" });
        formData.append("photos", file, `photo${index + 1}.jpg`);
      });

      // Using fetch instead of axios to avoid external dependencies
      const response = await fetch("http://localhost:8888/process/1", {
        method: "POST",
        headers: {
          accept: "application/json",
        },
        body: formData,
      });

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
        navigate("/result", {
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

  const downloadImages = () => {
    capturedImages.forEach((image, index) => {
      const link = document.createElement("a");
      link.download = `cekrek-${Date.now()}-photo${index + 1}.jpg`;
      link.href = image;
      link.click();
    });
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

  const videoConstraints = {
    facingMode,
  };

  const isSessionComplete =
    currentPhotoIndex >= selectedLayout.totalPhoto && !isUploading;

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
      <div className="relative z-10 p-6 flex justify-between items-start">
        <div
          className="text-xl text-purple-800 hover:scale-105 transition-transform"
          style={{ fontFamily: '"Press Start 2P", monospace' }}
        >
          CEKREK.IN
        </div>
        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg border-2 border-purple-300 shadow-lg">
          <div className="text-orange-600 font-bold text-xl">
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center px-6">
        {/* Title Section */}
        <div
          className="text-center mb-6"
          style={{ fontFamily: '"Press Start 2P", monospace' }}
        >
          <div className="text-3xl md:text-4xl font-bold mb-2 tracking-wider">
            <span
              className="text-white drop-shadow-lg animate-bounce"
              style={{ textShadow: "3px 3px 0px #666" }}
            >
              Lets
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
              Start
            </span>
            <span
              className="ml-4 text-orange-500 drop-shadow-lg animate-bounce"
              style={{
                textShadow: "3px 3px 0px #cc5500",
                animationDelay: "0.4s",
              }}
            >
              Photo
            </span>
          </div>
          {!showSettings && !isUploading && (
            <p className="text-sm text-purple-800">
              Foto ke-{currentPhotoIndex + 1} dari {selectedLayout.totalPhoto}
            </p>
          )}
          {isUploading && (
            <p className="text-sm text-green-600 animate-pulse">
              Sedang memproses foto Anda...
            </p>
          )}
        </div>

        {/* Progress Bar for Upload */}
        {isUploading && (
          <div className="max-w-3xl mb-6">
            <div className="bg-gray-700 rounded-full h-6 overflow-hidden border-2 border-white">
              <motion.div
                className="bg-gradient-to-r from-green-400 to-blue-500 h-full rounded-full flex items-center justify-center"
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.3 }}
              >
                <span
                  className="text-white text-xs font-bold"
                  style={{ fontFamily: '"Press Start 2P", monospace' }}
                >
                  {Math.round(uploadProgress)}%
                </span>
              </motion.div>
            </div>
            <p
              className="text-center text-purple-800 text-xs mt-2"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
            >
              MENGUPLOAD & MEMPROSES FOTO...
            </p>
          </div>
        )}

        {/* Session Progress Bar */}
        {!showSettings && !isUploading && (
          <div className="w-full max-w-3xl bg-white/50 rounded-full h-4 mb-6">
            <div
              className="bg-purple-600 h-4 rounded-full transition-all duration-500"
              style={{
                width: `${
                  (currentPhotoIndex / selectedLayout.totalPhoto) * 100
                }%`,
              }}
            />
          </div>
        )}

        {/* Camera Box */}
        {!isUploading && (
          <div className="w-full max-w-3xl bg-gray-900 rounded-2xl overflow-hidden border-4 border-purple-500 shadow-2xl">
            {/* Camera Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-2">
              <div className="flex items-center justify-center space-x-2">
                <Camera className="text-white" size={24} />
                <span className="text-white font-bold text-lg">
                  CEKREK.IN Camera
                </span>
              </div>
            </div>

            {/* Camera View */}
            <div className="relative bg-black" style={{ aspectRatio: "16/9" }}>
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="w-full h-full object-cover"
              />

              {/* Countdown Overlay */}
              {countdown !== null && (
                <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                  <motion.div
                    className="text-white text-8xl font-bold"
                    style={{ fontFamily: '"Press Start 2P", monospace' }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                  >
                    {countdown}
                  </motion.div>
                </div>
              )}

              {/* Flash Effect */}
              {isCapturing && countdown === null && (
                <motion.div
                  className="absolute inset-0 bg-white"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.3 }}
                />
              )}

              {/* Overlay decorations */}
              <div className="absolute inset-0 pointer-events-none">
                <div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin"
                  style={{ animationDuration: "8s" }}
                >
                  <div className="w-8 h-0.5 bg-white/50"></div>
                  <div className="w-0.5 h-8 bg-white/50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-gray-800 p-2">
              {showSettings ? (
                <div className="flex justify-center">
                  <div className="flex items-center space-x-2 text-white">
                    <Settings size={20} />
                    <span className="font-bold">
                      Atur pengaturan terlebih dahulu
                    </span>
                  </div>
                </div>
              ) : isSessionComplete && !result ? (
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={downloadImages}
                    className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-bold transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <Download size={24} />
                    <span>DOWNLOAD SEMUA</span>
                  </button>
                  <button
                    onClick={resetSession}
                    className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-4 rounded-full font-bold transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <Settings size={20} />
                    <span>SESI BARU</span>
                  </button>
                </div>
              ) : (
                <div className="flex justify-center space-x-4">
                  {capturedImages.length > 0 &&
                    currentPhotoIndex < selectedLayout.totalPhoto && (
                      <button
                        onClick={retakePhoto}
                        className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-bold transition-all duration-200 hover:scale-105 active:scale-95"
                      >
                        <RotateCcw size={20} />
                      </button>
                    )}

                  {currentPhotoIndex < selectedLayout.totalPhoto && (
                    <button
                      onClick={startCountdown}
                      disabled={isCapturing}
                      className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-8 py-4 rounded-full font-bold text-xl transition-all duration-200 shadow-lg hover:scale-105 active:scale-95 animate-pulse"
                    >
                      <Camera size={24} />
                    </button>
                  )}

                  <button
                    onClick={resetSession}
                    className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-bold transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <Settings size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings Panel - Now positioned below camera */}
        {showSettings && (
          <div className="bg-transparent  p-2 rounded-2xl mt-2 w-1/2 mb-6">
            <div className="flex gap-6 items-end justify-center">
              <div className="flex-1 max-w-xs">
                {/* The disabled option is displayed first */}
                <select
                  id="layout-select"
                  value={selectedLayout.name}
                  onChange={handleLayoutChange}
                  className="w-full p-3 rounded-lg bg-purple-100 text-purple-800 border-2 border-purple-300 focus:border-purple-500 focus:outline-none text-sm font-bold"
                  style={{ fontFamily: '"Press Start 2P", monospace' }}
                >
                  <option value={3} disabled>
                    Pilih Pose
                  </option>
                  {photoLayouts.map((layout) => (
                    <option key={layout.name} value={layout.name}>
                      {layout.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 max-w-xs">
                {/* The disabled option for delay */}
                <select
                  id="delay-select"
                  value={selectedDelay}
                  onChange={handleDelayChange}
                  className="w-full p-3 rounded-lg bg-purple-100 text-purple-800 border-2 border-purple-300 focus:border-purple-500 focus:outline-none text-sm font-bold"
                  style={{ fontFamily: '"Press Start 2P", monospace' }}
                >
                  <option value={1} disabled>
                    Pilih Delay
                  </option>
                  {delayOptions.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={startPhotoSession}
                className="px-8 py-3 rounded-lg text-sm bg-purple-800 hover:bg-purple-700 text-white font-bold transition-all duration-200 hover:scale-105 active:scale-95"
                style={{ fontFamily: '"Press Start 2P", monospace' }}
              >
                MULAI
              </button>
            </div>
          </div>
        )}

        {/* Captured Photos Preview */}
        {capturedImages.length > 0 && !isUploading && (
          <div className="mt-6 flex gap-3 flex-wrap justify-center">
            {capturedImages.map((image, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-24 h-16 border-4 border-white rounded-lg overflow-hidden shadow-lg bg-white"
              >
                <img
                  src={image}
                  alt={`Photo ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Completion Message - Only show if not uploading and session complete without result */}
        {isSessionComplete && !showSettings && !result && (
          <motion.div
            className="text-center mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p
              className="text-purple-800 text-2xl font-bold mb-2"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
            >
              FOTO SELESAI!
            </p>
            <p
              className="text-purple-600 text-sm mb-2"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
            >
              {capturedImages.length} foto berhasil diambil
            </p>
          </motion.div>
        )}

        {/* Result Success Message */}
        {result && !isUploading && (
          <motion.div
            className="text-center mt-6 bg-green-100 p-4 rounded-lg border-2 border-green-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p
              className="text-green-800 text-xl font-bold mb-2"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
            >
              UPLOAD BERHASIL!
            </p>
            <p
              className="text-green-600 text-sm"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
            >
              Menuju halaman hasil...
            </p>
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
                setIsUploading(false);
                setUploadProgress(0);
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

export default Test;
