import { useEffect, useState, useRef } from "react";
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [selectedLayout, setSelectedLayout] = useState<PhotoLayout>(
    photoLayouts[0]
  );
  const [selectedDelay, setSelectedDelay] = useState(3);
  const [showSettings, setShowSettings] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    // Initialize camera
    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: 1920,
          height: 1080,
          facingMode: "user",
        },
      })
      .then((mediaStream) => {
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      })
      .catch((err) => {
        setError("Tidak dapat mengakses kamera: " + err.message);
      });

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

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
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Flip horizontally for mirror effect
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);

    const imageSrc = canvas.toDataURL("image/jpeg", 0.8);

    const newPhotos = [...capturedPhotos, imageSrc];
    const nextIndex = currentPhotoIndex + 1;
    setCapturedPhotos(newPhotos);
    setCurrentPhotoIndex(nextIndex);

    if (nextIndex >= selectedLayout.totalPhoto) {
      // Simulate upload process
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

  const handleLayoutChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const layout = photoLayouts.find((l) => l.name === e.target.value);
    if (layout) setSelectedLayout(layout);
  };

  const handleDelayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDelay(Number(e.target.value));
  };

  const handleSubmit = async (photos: string[]) => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            setIsUploading(false);
            alert(
              "Upload selesai! Dalam implementasi asli, akan redirect ke halaman hasil."
            );
          }, 1000);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center pt-6">
      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />

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
          <p className="text-sm text-purple-300">
            Foto ke-{currentPhotoIndex + 1} dari {selectedLayout.totalPhoto}
          </p>
        )}
        {isUploading && (
          <p className="text-sm text-green-400 animate-pulse">
            Sedang memproses foto Anda...
          </p>
        )}
      </div>

      {/* Progress Bar for Upload */}
      {isUploading && (
        <div className="w-full max-w-4xl mb-6 mx-6">
          <div className="bg-gray-700 rounded-full h-8 overflow-hidden border-4 border-white shadow-lg">
            <motion.div
              className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 h-full rounded-full flex items-center justify-center relative"
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
              <span
                className="text-white text-sm font-bold z-10 flex items-center gap-2"
                style={{ fontFamily: '"Press Start 2P", monospace' }}
              >
                <Upload size={16} />
                {Math.round(uploadProgress)}%
              </span>
            </motion.div>
          </div>
          <p
            className="text-center text-white text-xs mt-3"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            MENGUPLOAD & MEMPROSES FOTO...
          </p>
        </div>
      )}

      {showSettings ? (
        <div className="bg-black bg-opacity-70 p-6 rounded-xl mb-6 border-4 border-white max-w-4xl backdrop-blur-sm shadow-2xl">
          <div className="flex gap-6 items-end">
            <div className="flex-1">
              <label
                htmlFor="layout-select"
                className="text-white text-sm mb-3 block flex items-center gap-2"
                style={{ fontFamily: '"Press Start 2P", monospace' }}
              >
                <Image size={16} />
                PILIH POSE
              </label>
              <select
                id="layout-select"
                value={selectedLayout.name}
                onChange={handleLayoutChange}
                className="w-full p-3 rounded-lg bg-gray-700 text-white border-3 border-gray-600 focus:border-yellow-400 focus:outline-none text-sm hover:bg-gray-600 transition-colors"
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
                className="text-white text-sm mb-3 block flex items-center gap-2"
                style={{ fontFamily: '"Press Start 2P", monospace' }}
              >
                <Clock size={16} />
                PILIH DELAY
              </label>
              <select
                id="delay-select"
                value={selectedDelay}
                onChange={handleDelayChange}
                className="w-full p-3 rounded-lg bg-gray-700 text-white border-3 border-gray-600 focus:border-yellow-400 focus:outline-none text-sm hover:bg-gray-600 transition-colors"
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
              className="px-8 py-3 rounded-lg text-sm bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play size={16} />
              MULAI
            </motion.button>
          </div>
        </div>
      ) : (
        !isUploading && (
          <div className="w-full max-w-4xl bg-gray-800 rounded-full h-6 mb-6 mx-6 border-2 border-white shadow-lg">
            <div
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
              style={{
                width: `${
                  (currentPhotoIndex / selectedLayout.totalPhoto) * 100
                }%`,
              }}
            >
              <CheckCircle size={16} className="text-white" />
            </div>
          </div>
        )
      )}

      {!isUploading && (
        <>
          {/* Enhanced Camera Frame */}
          <div className="relative mb-8">
            {/* Outer decorative frame */}
            <div className="absolute -inset-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur-sm opacity-75 animate-pulse"></div>
            <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl opacity-80"></div>

            {/* Main camera container */}
            <div className="relative w-[900px] h-[500px] bg-black rounded-xl overflow-hidden border-8 border-white shadow-2xl">
              {/* Corner decorations */}
              <div className="absolute top-2 left-2 w-6 h-6 border-l-4 border-t-4 border-yellow-400 rounded-tl-lg"></div>
              <div className="absolute top-2 right-2 w-6 h-6 border-r-4 border-t-4 border-yellow-400 rounded-tr-lg"></div>
              <div className="absolute bottom-2 left-2 w-6 h-6 border-l-4 border-b-4 border-yellow-400 rounded-bl-lg"></div>
              <div className="absolute bottom-2 right-2 w-6 h-6 border-r-4 border-b-4 border-yellow-400 rounded-br-lg"></div>

              {/* LED indicators */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isCapturing ? "bg-red-500 animate-pulse" : "bg-green-500"
                  } shadow-lg`}
                ></div>
                <div className="w-3 h-3 rounded-full bg-blue-500 animate-ping shadow-lg"></div>
              </div>

              {/* Camera label */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 px-4 py-1 rounded-full">
                <span
                  className="text-white text-xs flex items-center gap-1"
                  style={{ fontFamily: '"Press Start 2P", monospace' }}
                >
                  <Camera size={12} />
                  LIVE
                </span>
              </div>

              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
            </div>

            {/* Countdown overlay */}
            {countdown !== null && (
              <motion.div className="absolute inset-0 bg-black bg-opacity-80 rounded-xl flex items-center justify-center">
                <motion.div
                  className="text-white text-9xl flex items-center gap-4"
                  style={{ fontFamily: '"Press Start 2P", monospace' }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  <Clock size={80} className="animate-spin" />
                  {countdown}
                </motion.div>
              </motion.div>
            )}

            {/* Flash effect */}
            {isCapturing && countdown === null && (
              <motion.div
                className="absolute inset-0 bg-white rounded-xl"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.3 }}
              />
            )}
          </div>

          {/* Photo thumbnails */}
          {capturedPhotos.length > 0 && (
            <div className="flex gap-4 mb-8">
              {capturedPhotos.map((photo, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="relative w-28 h-20 border-4 border-white rounded-lg overflow-hidden shadow-lg"
                >
                  <img
                    src={photo}
                    alt={`Photo ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1 right-1 bg-green-500 rounded-full p-1">
                    <CheckCircle size={12} className="text-white" />
                  </div>
                  <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 px-2 py-1 rounded text-xs text-white">
                    {idx + 1}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Action buttons */}
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
              className="text-center mt-8 bg-green-600 bg-opacity-80 p-6 rounded-xl border-4 border-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <CheckCircle size={48} className="text-white mx-auto mb-4" />
              <p
                className="text-white text-xl"
                style={{ fontFamily: '"Press Start 2P", monospace' }}
              >
                FOTO SELESAI!
              </p>
            </motion.div>
          )}
        </>
      )}

      {/* Enhanced Error Display */}
      {error && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-red-600 text-white p-8 rounded-xl max-w-md text-center shadow-2xl border-4 border-white"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
          >
            <div className="text-red-200 mb-4">
              <X size={48} className="mx-auto" />
            </div>
            <h3
              className="text-xl font-bold mb-4"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
            >
              ERROR!
            </h3>
            <p className="mb-6 text-red-100">{error}</p>
            <button
              onClick={() => setError(null)}
              className="px-8 py-3 bg-white text-red-600 rounded-lg font-bold hover:bg-gray-100 transition-colors flex items-center gap-2 mx-auto"
            >
              <X size={16} />
              TUTUP
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default PhotoCapturePage;
