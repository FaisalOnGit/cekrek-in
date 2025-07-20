import { useState, useEffect, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { Camera, RotateCcw, Download, Settings } from "lucide-react";

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
    setIsCapturing(false);
  }, [webcamRef, capturedImages, currentPhotoIndex]);

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

  const isSessionComplete = currentPhotoIndex >= selectedLayout.totalPhoto;

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
      <div className="relative z-10 flex flex-col items-center px-6 pt-4">
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
              {showSettings ? "ATUR" : "SESI"}
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
          {!showSettings && (
            <p className="text-sm text-purple-800">
              Foto ke-{currentPhotoIndex + 1} dari {selectedLayout.totalPhoto}
            </p>
          )}
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl mb-6 border-2 border-purple-300 shadow-lg max-w-4xl w-full">
            <div className="flex gap-6 items-end justify-center">
              <div className="flex-1 max-w-xs">
                <label
                  htmlFor="layout-select"
                  className="text-purple-800 text-sm mb-2 block font-bold"
                  style={{ fontFamily: '"Press Start 2P", monospace' }}
                >
                  PILIH POSE
                </label>
                <select
                  id="layout-select"
                  value={selectedLayout.name}
                  onChange={handleLayoutChange}
                  className="w-full p-3 rounded-lg bg-purple-100 text-purple-800 border-2 border-purple-300 focus:border-purple-500 focus:outline-none text-sm font-bold"
                  style={{ fontFamily: '"Press Start 2P", monospace' }}
                >
                  {photoLayouts.map((layout) => (
                    <option key={layout.name} value={layout.name}>
                      {layout.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 max-w-xs">
                <label
                  htmlFor="delay-select"
                  className="text-purple-800 text-sm mb-2 block font-bold"
                  style={{ fontFamily: '"Press Start 2P", monospace' }}
                >
                  PILIH DELAY
                </label>
                <select
                  id="delay-select"
                  value={selectedDelay}
                  onChange={handleDelayChange}
                  className="w-full p-3 rounded-lg bg-purple-100 text-purple-800 border-2 border-purple-300 focus:border-purple-500 focus:outline-none text-sm font-bold"
                  style={{ fontFamily: '"Press Start 2P", monospace' }}
                >
                  {delayOptions.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={startPhotoSession}
                className="px-8 py-3 rounded-lg text-sm bg-green-600 hover:bg-green-700 text-white font-bold transition-all duration-200 hover:scale-105 active:scale-95"
                style={{ fontFamily: '"Press Start 2P", monospace' }}
              >
                MULAI
              </button>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {!showSettings && (
          <div className="w-full max-w-6xl bg-white/50 rounded-full h-4 mb-6">
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
        <div className="w-full max-w-6xl bg-gray-900 rounded-2xl overflow-hidden border-4 border-purple-500 shadow-2xl">
          {/* Camera Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-4">
            <div className="flex items-center justify-center space-x-2">
              <Camera className="text-white" size={24} />
              <span className="text-white font-bold text-lg">
                CEKREK.IN Camera
              </span>
            </div>
          </div>

          {/* Camera View */}
          <div className="relative bg-black" style={{ aspectRatio: "21/9" }}>
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="w-full h-full object-cover"
            />

            {/* Countdown Overlay */}
            {countdown !== null && (
              <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                <div
                  className="text-white text-8xl font-bold animate-pulse"
                  style={{ fontFamily: '"Press Start 2P", monospace' }}
                >
                  {countdown}
                </div>
              </div>
            )}

            {/* Flash Effect */}
            {isCapturing && countdown === null && (
              <div className="absolute inset-0 bg-white animate-pulse" />
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
          <div className="bg-gray-800 p-6">
            {showSettings ? (
              <div className="flex justify-center">
                <div className="flex items-center space-x-2 text-white">
                  <Settings size={20} />
                  <span className="font-bold">
                    Atur pengaturan terlebih dahulu
                  </span>
                </div>
              </div>
            ) : isSessionComplete ? (
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
                <button
                  onClick={switchCamera}
                  className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-full font-bold transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <RotateCcw size={20} />
                  <span>Switch</span>
                </button>

                {capturedImages.length > 0 && (
                  <button
                    onClick={retakePhoto}
                    className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-bold transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <RotateCcw size={20} />
                    <span>ULANGI</span>
                  </button>
                )}

                <button
                  onClick={startCountdown}
                  disabled={isCapturing}
                  className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-8 py-4 rounded-full font-bold text-xl transition-all duration-200 shadow-lg hover:scale-105 active:scale-95 animate-pulse"
                >
                  <Camera size={24} />
                  <span>{isCapturing ? "BERSIAP..." : "AMBIL FOTO"}</span>
                </button>

                <button
                  onClick={resetSession}
                  className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-bold transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <Settings size={20} />
                  <span>RESET</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Captured Photos Preview */}
        {capturedImages.length > 0 && (
          <div className="mt-6 flex gap-3 flex-wrap justify-center">
            {capturedImages.map((image, idx) => (
              <div
                key={idx}
                className="w-24 h-16 border-4 border-white rounded-lg overflow-hidden shadow-lg bg-white"
              >
                <img
                  src={image}
                  alt={`Photo ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Completion Message */}
        {isSessionComplete && !showSettings && (
          <div className="text-center mt-6">
            <p
              className="text-purple-800 text-2xl font-bold mb-2"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
            >
              FOTO SELESAI!
            </p>
            <p
              className="text-purple-600 text-sm"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
            >
              {capturedImages.length} foto berhasil diambil
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Test;
