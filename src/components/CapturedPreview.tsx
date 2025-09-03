import { motion } from "framer-motion";

interface CapturedPreviewProps {
  capturedImages: string[];
  isUploading: boolean;
  isSessionComplete: boolean;
  showSettings: boolean;
  result: any;
}

const CapturedPreview = ({
  capturedImages,
  isUploading,
  isSessionComplete,
  showSettings,
  result,
}: CapturedPreviewProps) => {
  if (capturedImages.length === 0 || isUploading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-[380px] min-h-[720px] bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-2xl p-4 shadow-xl"
    >
      {/* Header */}
      <div className="text-center mb-4">
        <h3
          className="text-white text-lg font-bold mb-2 drop-shadow-lg"
          style={{
            fontFamily: '"Press Start 2P", monospace',
            textShadow: "2px 2px 0px #666",
          }}
        >
          PREVIEW
        </h3>
        <div className="h-0.5 bg-gradient-to-r from-transparent via-white to-transparent opacity-50"></div>
      </div>

      {/* Captured Photos Grid */}
      <div className="flex flex-col gap-3 mb-4 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent">
        {capturedImages.map((image, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative group"
          >
            {/* Photo Container with 756x720 aspect ratio */}
            <div className="w-full aspect-[756/720] border-3 border-white rounded-xl overflow-hidden shadow-lg bg-white/90 hover:shadow-2xl transition-all duration-300">
              <img
                src={image}
                alt={`Photo ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Photo Number Badge */}
              <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                #{idx + 1}
              </div>
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-white text-xs font-bold bg-black/50 px-3 py-1 rounded-full">
                  Foto {idx + 1}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats Section */}
      <div className="bg-white/30 rounded-xl p-3 mb-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-purple-800 font-semibold">Total Foto:</span>
          <span className="text-purple-600 font-bold text-lg">
            {capturedImages.length}
          </span>
        </div>
        <div className="h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full mt-2"></div>
      </div>

      {/* Completion Message - Only show if not uploading and session complete without result */}
      {isSessionComplete && !showSettings && !result && (
        <motion.div
          className="text-center bg-purple-500/20 rounded-xl p-4 border border-purple-300/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-3">
            <div className="text-4xl animate-bounce">🎉</div>
          </div>
          <p
            className="text-purple-800 text-sm font-bold mb-2"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            FOTO SELESAI!
          </p>
          <p
            className="text-purple-600 text-xs"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            {capturedImages.length} foto berhasil diambil
          </p>
          <div className="mt-2 flex justify-center">
            <div className="flex gap-1">
              {[...Array(capturedImages.length)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                ></div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Result Success Message */}
      {result && !isUploading && (
        <motion.div
          className="text-center bg-green-500/20 rounded-xl p-4 border border-green-300/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-3">
            <div className="text-4xl animate-bounce">✅</div>
          </div>
          <p
            className="text-green-800 text-sm font-bold mb-2"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            UPLOAD BERHASIL!
          </p>
          <p
            className="text-green-600 text-xs"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            Menuju halaman hasil...
          </p>
          <div className="mt-3">
            <div className="w-full bg-green-200/50 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-green-400 to-green-600 h-full rounded-full animate-pulse"></div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Footer */}
      <div className="mt-auto pt-4">
        <div className="text-center text-xs text-white/70">
          <div className="h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent mb-2"></div>
          <span style={{ fontFamily: '"Press Start 2P", monospace' }}>
            PHOTOBOOTH PREVIEW
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default CapturedPreview;
