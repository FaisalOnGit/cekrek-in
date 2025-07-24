import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import bg from "/bg2.png";

interface ProcessResult {
  image_base64?: string;
  message?: string;
  status?: string;
}

function ResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get result from navigation state or localStorage as fallback
    const stateData = location.state as {
      result: ProcessResult;
      capturedPhotos: string[];
    } | null;

    if (stateData) {
      setResult(stateData.result);
      setCapturedPhotos(stateData.capturedPhotos);
    } else {
      // Fallback to localStorage (for smaller data)
      const savedPhotos = localStorage.getItem("capturedPhotos");
      if (savedPhotos) {
        setCapturedPhotos(JSON.parse(savedPhotos));
      }

      // If no data available, redirect back
      if (!savedPhotos) {
        navigate("/capture");
        return;
      }
    }

    // Simulate loading time for better UX
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, [location.state, navigate]);

  const handleDownload = () => {
    if (result?.image_base64) {
      const link = document.createElement("a");
      link.href = `data:image/png;base64,${result.image_base64}`;
      link.download = `photobooth-result-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleNewSession = () => {
    // Clear localStorage
    localStorage.removeItem("capturedPhotos");
    localStorage.removeItem("selectedLayout");

    // Navigate back to photo capture
    navigate("/capture");
  };

  const handleBackToTemplate = () => {
    // Clear localStorage
    localStorage.removeItem("capturedPhotos");
    localStorage.removeItem("selectedLayout");

    // Navigate back to template selection
    navigate("/template");
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div
            className="text-4xl font-bold mb-8 tracking-wider"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            <span
              className="text-white drop-shadow-lg animate-bounce"
              style={{ textShadow: "3px 3px 0px #666" }}
            >
              MEMUAT
            </span>
            <br />
            <span
              className="text-green-500 drop-shadow-lg animate-bounce"
              style={{
                textShadow: "3px 3px 0px #333",
                animationDelay: "0.2s",
              }}
            >
              HASIL
            </span>
          </div>

          <motion.div
            className="w-16 h-16 border-4 border-white border-t-transparent rounded-full mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center pt-6"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        style={{ fontFamily: '"Press Start 2P", monospace' }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-3xl md:text-4xl font-bold mb-2 tracking-wider">
          <span
            className="text-white drop-shadow-lg animate-bounce"
            style={{ textShadow: "3px 3px 0px #666" }}
          >
            HASIL
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
            FOTO
          </span>
          <span
            className="ml-4 text-orange-500 drop-shadow-lg animate-bounce"
            style={{
              textShadow: "3px 3px 0px #cc5500",
              animationDelay: "0.4s",
            }}
          >
            BOOTH
          </span>
        </div>
      </motion.div>

      {/* Main Result Display */}
      <motion.div
        className="flex flex-col lg:flex-row gap-8 max-w-6xl w-full px-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        {/* Original Photos */}
        <div className="flex-1">
          <div className="bg-black bg-opacity-60 p-4 rounded-lg border-2 border-white">
            <h3
              className="text-white text-lg mb-4 text-center"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
            >
              FOTO ASLI
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {capturedPhotos.map((photo, idx) => (
                <motion.div
                  key={idx}
                  className="aspect-video border-2 border-gray-400 rounded overflow-hidden"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * idx }}
                >
                  <img
                    src={photo}
                    alt={`Original Photo ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Processed Result */}
        <div className="flex-1">
          <div className="bg-black bg-opacity-60 p-4 rounded-lg border-2 border-white">
            <h3
              className="text-white text-lg mb-4 text-center"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
            >
              HASIL AKHIR
            </h3>
            {result?.image_base64 ? (
              <motion.div
                className="border-4 border-yellow-400 rounded-lg overflow-hidden shadow-2xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <img
                  src={`data:image/png;base64,${result.image_base64}`}
                  alt="Processed Result"
                  className="w-full h-auto"
                />
              </motion.div>
            ) : (
              <div className="aspect-video bg-gray-700 rounded-lg flex items-center justify-center border-2 border-gray-500">
                <p
                  className="text-gray-400 text-center"
                  style={{ fontFamily: '"Press Start 2P", monospace' }}
                >
                  HASIL TIDAK
                  <br />
                  TERSEDIA
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        className="flex flex-wrap gap-4 mt-8 justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        {result?.image_base64 && (
          <motion.button
            onClick={handleDownload}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg border-2 border-green-400"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            DOWNLOAD
          </motion.button>
        )}

        <motion.button
          onClick={handleNewSession}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg border-2 border-blue-400"
          style={{ fontFamily: '"Press Start 2P", monospace' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          SESI BARU
        </motion.button>

        <motion.button
          onClick={handleBackToTemplate}
          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg text-lg border-2 border-purple-400"
          style={{ fontFamily: '"Press Start 2P", monospace' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          PILIH TEMPLATE
        </motion.button>
      </motion.div>

      {/* Status Message */}
      {result?.message && (
        <motion.div
          className="mt-6 bg-black bg-opacity-60 p-4 rounded-lg border-2 border-green-400 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <p
            className="text-green-400 text-center text-sm"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            {result.message}
          </p>
        </motion.div>
      )}

      {/* Success Animation */}
      <motion.div
        className="fixed top-4 right-4"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
      >
        <div className="bg-green-500 text-white p-3 rounded-full shadow-lg">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </motion.div>

      {/* Floating Particles Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-70"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 10,
            }}
            animate={{
              y: -10,
              x: Math.random() * window.innerWidth,
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default ResultPage;
