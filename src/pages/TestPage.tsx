import { useState, useEffect } from "react";
import { usePhotoSession } from "../hooks/usePhotoSession";
import Header1 from "../components/Header1";
import ProgressBar from "../components/ProgressBar";
import CameraBox from "../components/CameraBox";
import SettingsPanel from "../components/SettingPanel";
import CapturedPreview from "../components/CapturedPreview";
import ErrorModal from "../components/ErrorModal";

function Test() {
  const [timeLeft, setTimeLeft] = useState(35 * 60);

  const {
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
  } = usePhotoSession();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

      <Header1 timeLeft={timeLeft} />

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

        <ProgressBar
          uploadProgress={uploadProgress}
          isUploading={isUploading}
          currentPhotoIndex={currentPhotoIndex}
          totalPhotos={selectedLayout.totalPhoto}
          showSettings={showSettings}
        />

        {/* Camera Box */}
        {!isUploading && (
          <CameraBox
            webcamRef={webcamRef}
            facingMode={facingMode}
            countdown={countdown}
            isCapturing={isCapturing}
            showSettings={showSettings}
            isSessionComplete={isSessionComplete}
            currentPhotoIndex={currentPhotoIndex}
            selectedLayout={selectedLayout}
            capturedImages={capturedImages}
            result={result}
            onStartCountdown={startCountdown}
            onRetakePhoto={retakePhoto}
            onResetSession={resetSession}
          />
        )}

        {/* Settings Panel */}
        {showSettings && (
          <SettingsPanel
            selectedLayout={selectedLayout}
            selectedDelay={selectedDelay}
            onLayoutChange={handleLayoutChange}
            onDelayChange={handleDelayChange}
            onStartSession={startPhotoSession}
          />
        )}

        <CapturedPreview
          capturedImages={capturedImages}
          isUploading={isUploading}
          isSessionComplete={isSessionComplete}
          showSettings={showSettings}
          result={result}
        />
      </div>

      <ErrorModal error={error} onClose={clearError} />
    </div>
  );
}

export default Test;
