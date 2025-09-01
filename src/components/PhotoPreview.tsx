import { motion } from "framer-motion";
import { Effect } from "../utils/effectHelper";

interface PhotoPreviewProps {
  images: string[];
  selectedEffect: Effect;
  isProcessing: boolean;
}

const PhotoPreview = ({
  images,
  selectedEffect,
  isProcessing,
}: PhotoPreviewProps) => {
  return (
    <div className="w-full max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
        {images.map((image, index) => (
          <motion.div
            key={index}
            className="relative bg-white rounded-2xl overflow-hidden border-4 border-purple-300 shadow-2xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Photo Frame Header */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-700 p-2">
              <div className="flex justify-center items-center">
                <span
                  className="text-white font-bold text-xs"
                  style={{ fontFamily: '"Press Start 2P", monospace' }}
                >
                  FOTO {index + 1}
                </span>
              </div>
            </div>

            {/* Photo Container */}
            <div
              className="relative bg-gray-100"
              style={{ aspectRatio: "4/3" }}
            >
              <img
                src={image}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover"
                style={{
                  filter: isProcessing ? "blur(2px)" : "none",
                  transition: "filter 0.3s ease",
                }}
              />

              {/* Processing Overlay */}
              {isProcessing && (
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <motion.div
                    className="text-white font-bold text-xs"
                    style={{ fontFamily: '"Press Start 2P", monospace' }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    PROCESSING...
                  </motion.div>
                </div>
              )}
            </div>

            {/* Effect Label */}
            <div className="bg-gray-800 p-2">
              <div className="text-center">
                <span
                  className="text-white text-xs font-bold"
                  style={{ fontFamily: '"Press Start 2P", monospace' }}
                >
                  {selectedEffect.name.toUpperCase()}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PhotoPreview;
