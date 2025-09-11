import { motion } from "framer-motion";
import Webcam from "react-webcam";
import { Camera, RotateCcw, Download, Settings } from "lucide-react";
import { downloadImages } from "../utils/helper";
import { PhotoLayout } from "../hooks/usePhotoSession";

interface CameraBoxProps {
  webcamRef: React.RefObject<Webcam>;
  facingMode: "user" | "environment";
  countdown: number | null;
  isCapturing: boolean;
  showSettings: boolean;
  isSessionComplete: boolean;
  currentPhotoIndex: number;
  selectedLayout: PhotoLayout;
  capturedImages: string[];
  result: any;
  onStartCountdown: () => void;
  onRetakePhoto: () => void;
  onResetSession: () => void;
}

const CameraBox = ({
  webcamRef,
  facingMode,
  countdown,
  isCapturing,
  showSettings,
  isSessionComplete,
  currentPhotoIndex,
  selectedLayout,
  capturedImages,
  result,
  onStartCountdown,
  onRetakePhoto,
  onResetSession,
}: CameraBoxProps) => {
  const videoConstraints = {
    width: 756,
    height: 720,
    facingMode,
  };

  const renderControls = () => {
    if (showSettings) {
      return (
        <div className="flex justify-center">
          <div className="flex items-center space-x-2 text-white">
            <Settings size={20} />
            <span className="font-bold">Atur pengaturan terlebih dahulu</span>
          </div>
        </div>
      );
    }

    if (isSessionComplete && !result) {
      return (
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => downloadImages(capturedImages)}
            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-bold transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Download size={24} />
            <span>DOWNLOAD SEMUA</span>
          </button>
          <button
            onClick={onResetSession}
            className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-4 rounded-full font-bold transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Settings size={20} />
            <span>SESI BARU</span>
          </button>
        </div>
      );
    }

    return (
      <div className="flex justify-center space-x-4">
        {capturedImages.length > 0 &&
          currentPhotoIndex < selectedLayout.totalPhoto && (
            <button
              onClick={onRetakePhoto}
              className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-bold transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <RotateCcw size={20} />
            </button>
          )}

        {currentPhotoIndex < selectedLayout.totalPhoto && (
          <button
            onClick={onStartCountdown}
            disabled={isCapturing}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-8 py-4 rounded-full font-bold text-xl transition-all duration-200 shadow-lg hover:scale-105 active:scale-95 animate-pulse"
          >
            <Camera size={24} />
          </button>
        )}

        <button
          onClick={onResetSession}
          className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-bold transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <Settings size={20} />
        </button>
      </div>
    );
  };

  return (
    <div className="w-full max-w-3xl bg-gray-900 rounded-2xl overflow-hidden border-4 border-purple-500 shadow-2xl">
      {/* Camera Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-2">
        <div className="flex items-center justify-center space-x-2">
          <Camera className="text-white" size={24} />
          <span className="text-white font-bold text-lg">CEKREK.IN Camera</span>
        </div>
      </div>

      {/* Camera View */}
      <div className="relative bg-black" style={{ aspectRatio: "756 / 720" }}>
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
      <div className="bg-gray-800 p-2">{renderControls()}</div>
    </div>
  );
};

export default CameraBox;
