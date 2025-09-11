import { ArrowLeft, ArrowRight, Download } from "lucide-react";
import { downloadProcessedImages } from "../utils/effectHelper";
import { Effect } from "../utils/effectHelper";

interface EffectActionsProps {
  processedImages: string[];
  selectedEffect: Effect;
  isUploading: boolean;
  isProcessing: boolean;
  onRetakePhotos: () => void;
  onContinueToResult: () => void;
}

const EffectActions = ({
  processedImages,
  selectedEffect,
  isUploading,
  isProcessing,
  onRetakePhotos,
  onContinueToResult,
}: EffectActionsProps) => {
  const handleDownload = () => {
    downloadProcessedImages(processedImages, selectedEffect.name);
  };

  return (
    <div className="w-full max-w-4xl mt-8 flex justify-center gap-4 flex-wrap">
      {/* Retake Photos Button */}
      <button
        onClick={onRetakePhotos}
        disabled={isUploading || isProcessing}
        className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-full font-bold transition-all duration-200 hover:scale-105 active:scale-95"
        style={{ fontFamily: '"Press Start 2P", monospace' }}
      >
        <ArrowLeft size={20} />
        <span className="text-xs">FOTO ULANG</span>
      </button>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        disabled={isUploading || isProcessing || processedImages.length === 0}
        className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-full font-bold transition-all duration-200 hover:scale-105 active:scale-95"
        style={{ fontFamily: '"Press Start 2P", monospace' }}
      >
        <Download size={20} />
        <span className="text-xs">DOWNLOAD</span>
      </button>

      {/* Continue to Result Button */}
      <button
        onClick={onContinueToResult}
        disabled={isUploading || isProcessing || processedImages.length === 0}
        className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-full font-bold transition-all duration-200 hover:scale-105 active:scale-95 animate-pulse"
        style={{ fontFamily: '"Press Start 2P", monospace' }}
      >
        <span className="text-xs">LANJUTKAN</span>
        <ArrowRight size={20} />
      </button>
    </div>
  );
};

export default EffectActions;
