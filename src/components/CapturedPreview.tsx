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
    <>
      {/* Captured Photos Preview */}
      <div className="mt-6 flex gap-3 flex-wrap justify-center">
        {capturedImages.map((image, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-16 border-4 border-white rounded-lg overflow-hidden shadow-lg bg-white"
          >
            <img
              src={image}
              alt={`Photo ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </div>

      {/* Completion Message - Only show if not uploading and session complete without result */}
      {isSessionComplete && !showSettings && !result && (
        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p
            className="text-purple-800 text-2xl font-bold mb-2"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            FOTO SELESAI!
          </p>
          <p
            className="text-purple-600 text-sm mb-2"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            {capturedImages.length} foto berhasil diambil
          </p>
        </motion.div>
      )}

      {/* Result Success Message */}
      {result && !isUploading && (
        <motion.div
          className="text-center mt-6 bg-green-100 p-4 rounded-lg border-2 border-green-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p
            className="text-green-800 text-xl font-bold mb-2"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            UPLOAD BERHASIL!
          </p>
          <p
            className="text-green-600 text-sm"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            Menuju halaman hasil...
          </p>
        </motion.div>
      )}
    </>
  );
};

export default CapturedPreview;
