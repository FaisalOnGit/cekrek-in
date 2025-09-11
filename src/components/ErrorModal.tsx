import { motion } from "framer-motion";

interface ErrorModalProps {
  error: string | null;
  onClose: () => void;
}

const ErrorModal = ({ error, onClose }: ErrorModalProps) => {
  if (!error) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="bg-red-600 text-white p-6 rounded-lg max-w-md text-center mx-4">
        <h3
          className="text-lg font-bold mb-4"
          style={{ fontFamily: '"Press Start 2P", monospace' }}
        >
          ERROR!
        </h3>
        <p className="mb-4 text-sm">{error}</p>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-white text-red-600 rounded-lg font-bold hover:bg-gray-100 transition-colors"
        >
          TUTUP
        </button>
      </div>
    </motion.div>
  );
};

export default ErrorModal;
