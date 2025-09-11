import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Camera,
  RotateCcw,
  RefreshCw,
  ArrowLeft,
  Play,
  Settings,
  Image,
  Clock,
  CheckCircle,
  X,
  Upload,
} from "lucide-react";
import Webcam from "react-webcam";
import axios from "axios";
import bgfinal from "/bg-final.png";
import bg from "/bg2.png";

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

function PhotoCapturePage() {
  const navigate = useNavigate();
  const webcamRef = useRef<Webcam>(null);

  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );
  const [selectedLayout, setSelectedLayout] = useState<PhotoLayout>(
    photoLayouts[0]
  );
  const [timeLeft, setTimeLeft] = useState(35 * 60);
  const [selectedDelay, setSelectedDelay] = useState(3);
  const [showSettings, setShowSettings] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const BASE_URL = import.meta.env.VITE_BASE_API_URL;

  const webcamProps = {
    audio: false,
    screenshotFormat: "image/jpeg",
    mirrored: true,
    videoConstraints: {
      facingMode: "user",
      width: 756,
      height: 720,
    },
  };

  useEffect(() => {
    const templateId = localStorage.getItem("selectedTemplateId");
    if (!templateId) {
      navigate("/template");
      return;
    }
    setSelectedTemplateId(templateId);
  }, [navigate]);

  const startPhotoSession = () => {
    setShowSettings(false);
    setCurrentPhotoIndex(0);
    setCapturedPhotos([]);
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

  const capturePhoto = () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      setIsCapturing(false);
      return;
    }

    const newPhotos = [...capturedPhotos, imageSrc];
    const nextIndex = currentPhotoIndex + 1;
    setCapturedPhotos(newPhotos);
    setCurrentPhotoIndex(nextIndex);

    if (nextIndex >= selectedLayout.totalPhoto) {
      // Save only essential data to localStorage (not the API result)
      localStorage.setItem("capturedPhotos", JSON.stringify(newPhotos));
      localStorage.setItem("selectedLayout", JSON.stringify(selectedLayout));

      // Call the API to upload photos after all are captured
      handleSubmit(newPhotos);
    }

    setIsCapturing(false);
  };

  const retakePhoto = () => {
    if (capturedPhotos.length === 0) return;
    const newPhotos = capturedPhotos.slice(0, -1);
    setCapturedPhotos(newPhotos);
    setCurrentPhotoIndex(Math.max(0, currentPhotoIndex - 1));
  };

  const resetSession = () => {
    setShowSettings(true);
    setCurrentPhotoIndex(0);
    setCapturedPhotos([]);
    setCountdown(null);
    setIsCapturing(false);
    setIsUploading(false);
    setUploadProgress(0);
  };

  const handleBack = () => navigate("/template");

  const handleLayoutChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const layout = photoLayouts.find((l) => l.name === e.target.value);
    if (layout) setSelectedLayout(layout);
  };

  const handleDelayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDelay(Number(e.target.value));
  };

  // Function to handle the POST request and upload photos to the API
  const handleSubmit = async (photos: string[]) => {
    setIsUploading(true);
    setUploadProgress(0);

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

      const selectedTemplateId = localStorage.getItem("selectedTemplateId");
      const response = await axios.post(
        `${BASE_URL}/process/${selectedTemplateId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            accept: "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("Photos uploaded successfully", response.data);

      // Complete progress and navigate directly to result
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Navigate immediately to Result page with result data
      setTimeout(() => {
        navigate("/result", {
          state: {
            result: response.data,
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center pt-6"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="relative z-10 p-6 flex justify-between items-start w-full">
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
      <div
        className="text-center mb-6"
        style={{ fontFamily: '"Press Start 2P", monospace' }}
      >
        <div className="text-3xl md:text-4xl font-bold mb-2 tracking-wider">
          <span
            className="text-white drop-shadow-lg animate-bounce"
            style={{ textShadow: "3px 3px 0px #666" }}
          >
            {showSettings ? "ATUR" : isUploading ? "MEMPROSES" : "SESI"}
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
            SESI
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
        <div className="w-full max-w-2xl mb-6 mx-6">
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
            className="text-center text-white text-xs mt-2"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            MENGUPLOAD & MEMPROSES FOTO...
          </p>
        </div>
      )}

      {showSettings ? (
        <div className="bg-black bg-opacity-60 p-4 rounded-lg mb-4 border-2 border-white max-w-2xl">
          <div className="flex gap-6 items-end">
            <div className="flex-1">
              <label
                htmlFor="layout-select"
                className="text-white text-sm mb-2 block"
                style={{ fontFamily: '"Press Start 2P", monospace' }}
              >
                PILIH POSE
              </label>
              <select
                id="layout-select"
                value={selectedLayout.name}
                onChange={handleLayoutChange}
                className="w-full p-2 rounded-lg bg-gray-700 text-white border-2 border-gray-600 focus:border-yellow-400 focus:outline-none text-sm"
                style={{ fontFamily: '"Press Start 2P", monospace' }}
              >
                {photoLayouts.map((layout) => (
                  <option key={layout.name} value={layout.name}>
                    {layout.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label
                htmlFor="delay-select"
                className="text-white text-sm mb-2 block"
                style={{ fontFamily: '"Press Start 2P", monospace' }}
              >
                PILIH DELAY
              </label>
              <select
                id="delay-select"
                value={selectedDelay}
                onChange={handleDelayChange}
                className="w-full p-2 rounded-lg bg-gray-700 text-white border-2 border-gray-600 focus:border-yellow-400 focus:outline-none text-sm"
                style={{ fontFamily: '"Press Start 2P", monospace' }}
              >
                {delayOptions.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            <motion.button
              onClick={startPhotoSession}
              className="px-6 py-2 rounded-lg text-sm bg-green-600 hover:bg-green-700 text-white"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
            >
              MULAI
            </motion.button>
          </div>
        </div>
      ) : (
        !isUploading && (
          <div className="w-full max-w-2xl bg-gray-700 rounded-full h-4 mb-6 mx-6">
            <div
              className="bg-yellow-400 h-4 rounded-full transition-all duration-500"
              style={{
                width: `${
                  (currentPhotoIndex / selectedLayout.totalPhoto) * 100
                }%`,
              }}
            />
          </div>
        )
      )}

      {!isUploading && (
        <>
          <div className="relative mb-6">
            <div className="w-[640px] h-[360px] bg-black rounded-lg overflow-hidden border-4 border-white shadow-lg">
              <Webcam
                ref={webcamRef}
                className="w-full h-full object-cover"
                {...webcamProps}
              />
            </div>

            {countdown !== null && (
              <motion.div className="absolute inset-0 bg-black bg-opacity-70 rounded-lg flex items-center justify-center">
                <motion.div
                  className="text-white text-8xl"
                  style={{ fontFamily: '"Press Start 2P", monospace' }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  {countdown}
                </motion.div>
              </motion.div>
            )}

            {isCapturing && countdown === null && (
              <motion.div
                className="absolute inset-0 bg-white rounded-lg"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.3 }}
              />
            )}
          </div>

          {capturedPhotos.length > 0 && (
            <div className="flex gap-2 mb-6">
              {capturedPhotos.map((photo, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-20 h-12 border-2 border-white rounded overflow-hidden"
                >
                  <img
                    src={photo}
                    alt={`Photo ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          )}

          {!showSettings && (
            <div className="flex gap-4 mb-6">
              {currentPhotoIndex < selectedLayout.totalPhoto && (
                <motion.button
                  onClick={startCountdown}
                  className="px-10 py-5 rounded-xl text-lg bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3"
                  style={{ fontFamily: '"Press Start 2P", monospace' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isCapturing}
                >
                  <Camera size={24} />
                  {isCapturing ? "BERSIAP..." : "AMBIL FOTO"}
                </motion.button>
              )}

              {capturedPhotos.length > 0 && (
                <motion.button
                  onClick={retakePhoto}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-5 rounded-xl text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3"
                  style={{ fontFamily: '"Press Start 2P", monospace' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RotateCcw size={24} />
                  ULANGI
                </motion.button>
              )}

              <motion.button
                onClick={resetSession}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-5 rounded-xl text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3"
                style={{ fontFamily: '"Press Start 2P", monospace' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw size={24} />
                RESET
              </motion.button>
            </div>
          )}

          <motion.button
            onClick={() =>
              alert("Dalam implementasi asli akan navigasi kembali ke template")
            }
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={20} />
            KEMBALI
          </motion.button>

          {currentPhotoIndex >= selectedLayout.totalPhoto && !showSettings && (
            <motion.div
              className="text-center mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p
                className="text-white text-lg"
                style={{ fontFamily: '"Press Start 2P", monospace' }}
              >
                FOTO SELESAI!
              </p>
            </motion.div>
          )}
        </>
      )}

      {/* Error Display */}
      {error && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-red-600 text-white p-6 rounded-lg max-w-md text-center">
            <h3
              className="text-lg font-bold mb-4"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
            >
              ERROR!
            </h3>
            <p className="mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setIsUploading(false);
                setUploadProgress(0);
              }}
              className="px-6 py-2 bg-white text-red-600 rounded-lg font-bold"
            >
              TUTUP
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default PhotoCapturePage;
