import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import bgfinal from "/bg-final.png";

interface PhotoLayout {
  name: string;
  totalPhoto: number;
}

const photoLayouts: PhotoLayout[] = [
  {
    name: "2 Pose",
    totalPhoto: 2,
  },
  {
    name: "3 Pose",
    totalPhoto: 3,
  },
  {
    name: "4 Pose",
    totalPhoto: 4,
  },
];

const delayOptions = [
  { label: "3 Detik", value: 3 },
  { label: "5 Detik", value: 5 },
  { label: "10 Detik", value: 10 },
];

function PhotoCapturePage() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );
  const [selectedLayout, setSelectedLayout] = useState<PhotoLayout>(
    photoLayouts[0]
  );
  const [selectedDelay, setSelectedDelay] = useState(3);
  const [showSettings, setShowSettings] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    // Ambil template ID dari localStorage
    const templateId = localStorage.getItem("selectedTemplateId");

    if (!templateId) {
      navigate("/template");
      return;
    }

    setSelectedTemplateId(templateId);

    // Inisialisasi kamera
    initCamera();
  }, [navigate]);

  const initCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setCameraReady(true);
        };
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setCameraError(
        "Tidak dapat mengakses kamera. Pastikan browser memiliki izin kamera."
      );
    }
  };

  const startPhotoSession = () => {
    setShowSettings(false);
    setCurrentPhotoIndex(0);
    setCapturedPhotos([]);
  };

  const startCountdown = () => {
    if (isCapturing) return;

    setIsCapturing(true);
    setCountdown(selectedDelay);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(countdownInterval);
          capturePhoto();
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Set canvas size sesuai video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Gambar video ke canvas (flip horizontal)
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0);
    ctx.scale(-1, 1);

    // Convert ke base64
    const photoData = canvas.toDataURL("image/jpeg", 0.8);

    // Simpan foto
    const newPhotos = [...capturedPhotos, photoData];
    setCapturedPhotos(newPhotos);

    // Update index
    const nextIndex = currentPhotoIndex + 1;
    setCurrentPhotoIndex(nextIndex);

    // Cek apakah sudah selesai semua foto
    if (nextIndex >= selectedLayout.totalPhoto) {
      // Simpan semua foto ke localStorage
      localStorage.setItem("capturedPhotos", JSON.stringify(newPhotos));
      localStorage.setItem("selectedLayout", JSON.stringify(selectedLayout));
      setTimeout(() => {
        navigate("/result");
      }, 2000);
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
  };

  const handleBack = () => {
    // Stop camera stream
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }
    navigate("/template");
  };

  const handleLayoutChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLayoutName = e.target.value;
    const layout = photoLayouts.find((l) => l.name === selectedLayoutName);
    if (layout) {
      setSelectedLayout(layout);
    }
  };

  const handleDelayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDelay(Number(e.target.value));
  };

  if (cameraError) {
    return (
      <div
        className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center"
        style={{ backgroundImage: `url(${bgfinal})` }}
      >
        <div className="text-center text-white p-8">
          <h1
            className="text-2xl mb-4"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            ERROR KAMERA
          </h1>
          <p className="mb-8">{cameraError}</p>
          <button
            onClick={handleBack}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            KEMBALI
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center pt-6"
      style={{ backgroundImage: `url(${bgfinal})` }}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h1
          className="text-2xl md:text-4xl text-white mb-2"
          style={{ fontFamily: '"Press Start 2P", monospace' }}
        >
          {showSettings ? "ATUR SESI FOTO" : "SESI FOTO"}
        </h1>
        {!showSettings && (
          <p
            className="text-white text-sm"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            Foto ke-{currentPhotoIndex + 1} dari {selectedLayout.totalPhoto}
          </p>
        )}
      </div>

      {/* Settings Panel */}
      {showSettings ? (
        <div className="bg-black bg-opacity-60 p-6 rounded-lg mb-6 border-2 border-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Layout Selection */}
            <div>
              <label
                htmlFor="layout-select"
                className="text-white text-lg mb-4 block"
                style={{ fontFamily: '"Press Start 2P", monospace' }}
              >
                PILIH JUMLAH POSE
              </label>
              <select
                id="layout-select"
                value={selectedLayout.name}
                onChange={handleLayoutChange}
                className="w-full p-3 rounded-lg bg-gray-700 text-white border-2 border-gray-600 focus:border-yellow-400 focus:outline-none"
                style={{ fontFamily: '"Press Start 2P", monospace' }}
              >
                {photoLayouts.map((layout) => (
                  <option key={layout.name} value={layout.name}>
                    {layout.name} ({layout.totalPhoto} foto)
                  </option>
                ))}
              </select>
            </div>

            {/* Delay Selection */}
            <div>
              <label
                htmlFor="delay-select"
                className="text-white text-lg mb-4 block"
                style={{ fontFamily: '"Press Start 2P", monospace' }}
              >
                PILIH DELAY
              </label>
              <select
                id="delay-select"
                value={selectedDelay}
                onChange={handleDelayChange}
                className="w-full p-3 rounded-lg bg-gray-700 text-white border-2 border-gray-600 focus:border-yellow-400 focus:outline-none"
                style={{ fontFamily: '"Press Start 2P", monospace' }}
              >
                {delayOptions.map((delay) => (
                  <option key={delay.value} value={delay.value}>
                    {delay.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Start Button */}
          <motion.button
            onClick={startPhotoSession}
            disabled={!cameraReady}
            className={`w-full mt-6 py-4 rounded-lg text-lg transition-all duration-300 ${
              !cameraReady
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            } text-white`}
            style={{ fontFamily: '"Press Start 2P", monospace' }}
            whileHover={cameraReady ? { scale: 1.02 } : {}}
            whileTap={cameraReady ? { scale: 0.98 } : {}}
          >
            {!cameraReady ? "LOADING KAMERA..." : "MULAI SESI FOTO"}
          </motion.button>
        </div>
      ) : (
        /* Progress Bar */
        <div className="w-80 bg-gray-700 rounded-full h-4 mb-6">
          <div
            className="bg-yellow-400 h-4 rounded-full transition-all duration-500"
            style={{
              width: `${
                (currentPhotoIndex / selectedLayout.totalPhoto) * 100
              }%`,
            }}
          ></div>
        </div>
      )}

      {/* Camera Container */}
      <div className="relative mb-6">
        <div className="w-80 h-96 bg-black rounded-lg overflow-hidden border-4 border-white shadow-lg">
          {!cameraReady ? (
            <div className="w-full h-full flex items-center justify-center">
              <p
                className="text-white text-sm"
                style={{ fontFamily: '"Press Start 2P", monospace' }}
              >
                Loading camera...
              </p>
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform scale-x-[-1]"
            />
          )}
        </div>

        {/* Countdown Overlay */}
        {countdown !== null && (
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-70 rounded-lg flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
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

        {/* Flash Effect */}
        {isCapturing && countdown === null && (
          <motion.div
            className="absolute inset-0 bg-white rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>

      {/* Captured Photos Preview */}
      {capturedPhotos.length > 0 && (
        <div className="flex gap-2 mb-6">
          {capturedPhotos.map((photo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-16 h-20 border-2 border-white rounded overflow-hidden"
            >
              <img
                src={photo}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Controls */}
      {!showSettings && (
        <div className="flex gap-4 mb-6">
          {/* Capture Button */}
          {currentPhotoIndex < selectedLayout.totalPhoto && (
            <motion.button
              onClick={startCountdown}
              disabled={!cameraReady || isCapturing}
              className={`px-8 py-4 rounded-lg text-lg transition-all duration-300 ${
                !cameraReady || isCapturing
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 hover:scale-105"
              } text-white`}
              style={{ fontFamily: '"Press Start 2P", monospace' }}
              whileTap={{ scale: 0.95 }}
            >
              {isCapturing ? "BERSIAP..." : "AMBIL FOTO"}
            </motion.button>
          )}

          {/* Retake Button */}
          {capturedPhotos.length > 0 && (
            <motion.button
              onClick={retakePhoto}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-4 rounded-lg text-lg transition-all duration-300"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ULANGI
            </motion.button>
          )}

          {/* Reset Button */}
          <motion.button
            onClick={resetSession}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg text-lg transition-all duration-300"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            RESET
          </motion.button>
        </div>
      )}

      {/* Back Button */}
      <motion.button
        onClick={handleBack}
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg text-sm transition-all duration-300"
        style={{ fontFamily: '"Press Start 2P", monospace' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        KEMBALI
      </motion.button>

      {/* Completion Message */}
      {currentPhotoIndex >= selectedLayout.totalPhoto && !showSettings && (
        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p
            className="text-white text-lg mb-2"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            FOTO SELESAI!
          </p>
          <p
            className="text-white text-sm"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            Memproses hasil...
          </p>
        </motion.div>
      )}

      {/* Hidden Canvas for capturing */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}

export default PhotoCapturePage;
