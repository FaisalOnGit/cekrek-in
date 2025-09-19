import { ArrowLeft, ArrowRight, Download } from "lucide-react";
import { downloadProcessedImages } from "../utils/effectHelper";
import { Effect } from "../utils/effectHelper";
import RetroButton from "./ui/RetroButton";

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
  onContinueToResult,
}: EffectActionsProps) => {
  const handleDownload = () => {
    downloadProcessedImages(processedImages, selectedEffect.name);
  };

  return (
    <div className="w-full max-w-4xl mt-8 flex justify-center gap-4 flex-wrap">
      {/* Retake Photos Button */}

      {/* Continue to Result Button */}
      <RetroButton
        onClick={onContinueToResult}
        disabled={isUploading || isProcessing || processedImages.length === 0}
      >
        Submit
      </RetroButton>
    </div>
  );
};

export default EffectActions;
