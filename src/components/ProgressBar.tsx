import { motion } from "framer-motion";

interface ProgressBarProps {
  uploadProgress: number;
  isUploading: boolean;
  currentPhotoIndex: number;
  totalPhotos: number;
  showSettings: boolean;
}

const ProgressBar = ({
  uploadProgress,
  isUploading,
  currentPhotoIndex,
  totalPhotos,
  showSettings,
}: ProgressBarProps) => {
  return (
    <>
      {/* Upload Progress Bar */}
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
              width: `${(currentPhotoIndex / totalPhotos) * 100}%`,
            }}
          />
        </div>
      )}
    </>
  );
};

export default ProgressBar;
