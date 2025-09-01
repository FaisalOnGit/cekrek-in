import { motion } from "framer-motion";

interface EffectProgressProps {
  isUploading: boolean;
  uploadProgress: number;
}

const EffectProgress = ({
  isUploading,
  uploadProgress,
}: EffectProgressProps) => {
  if (!isUploading) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="bg-white p-8 rounded-2xl border-4 border-purple-500 shadow-2xl max-w-md mx-4">
        <div className="text-center mb-6">
          <h3
            className="text-purple-800 font-bold text-lg mb-2"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            MEMPROSES FOTO
          </h3>
          <p
            className="text-purple-600 text-sm"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            DENGAN EFFECT & UPLOAD...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-300 rounded-full h-6 overflow-hidden border-2 border-purple-300 mb-4">
          <motion.div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full flex items-center justify-center"
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

        {/* Loading Animation */}
        <div className="flex justify-center">
          <motion.div
            className="flex space-x-1"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
            }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-purple-500 rounded-full"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default EffectProgress;
