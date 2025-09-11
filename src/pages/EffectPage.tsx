import { useEffectPage } from "../hooks/useEffectPage";
import EffectHeader from "../components/EffectHeader";
import EffectSelector from "../components/EffectSelector";
import PhotoPreview from "../components/PhotoPreview";
import EffectActions from "../components/EffectAction";
import EffectProgress from "../components/EffectProgress";
import ErrorModal from "../components/ErrorModal";

function EffectPage() {
  const {
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
  } = useEffectPage();

  if (capturedPhotos.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 flex items-center justify-center">
        <div className="text-center">
          <h1
            className="text-2xl text-purple-800 font-bold mb-4"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            TIDAK ADA FOTO
          </h1>
          <p className="text-purple-600 mb-4">
            Silakan ambil foto terlebih dahulu
          </p>
          <button
            onClick={handleRetakePhotos}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-bold"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            KEMBALI
          </button>
        </div>
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

      <EffectHeader
        photoCount={capturedPhotos.length}
        selectedEffectName={selectedEffect.name}
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center px-6 pb-8">
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
              Choose
            </span>
          </div>
          <div className="text-3xl md:text-4xl font-bold mb-6 tracking-wider">
            <span
              className="text-blue-800 drop-shadow-lg animate-bounce"
              style={{
                textShadow: "3px 3px 0px #333",
                animationDelay: "0.2s",
              }}
            >
              Your
            </span>
            <span
              className="ml-4 text-orange-500 drop-shadow-lg animate-bounce"
              style={{
                textShadow: "3px 3px 0px #cc5500",
                animationDelay: "0.4s",
              }}
            >
              Effect
            </span>
          </div>

          <p className="text-sm text-purple-800 mb-2">
            Pilih effect untuk membuat foto Anda lebih menarik!
          </p>
        </div>

        <EffectSelector
          effects={availableEffects}
          selectedEffect={selectedEffect}
          onEffectChange={handleEffectChange}
          isProcessing={isProcessingEffect}
        />

        <PhotoPreview
          images={processedImages}
          selectedEffect={selectedEffect}
          isProcessing={isProcessingEffect}
        />

        <EffectActions
          processedImages={processedImages}
          selectedEffect={selectedEffect}
          isUploading={isUploading}
          isProcessing={isProcessingEffect}
          onRetakePhotos={handleRetakePhotos}
          onContinueToResult={handleContinueToResult}
        />
      </div>

      <EffectProgress
        isUploading={isUploading}
        uploadProgress={uploadProgress}
      />

      <ErrorModal error={error} onClose={clearError} />
    </div>
  );
}

export default EffectPage;
