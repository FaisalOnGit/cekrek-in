import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Mail, Search } from "lucide-react";
import bg from "/bg.png";

function HomePage() {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const navigate = useNavigate();

  const handleStartGame = () => {
    setIsGameStarted(true);
    setTimeout(() => setIsGameStarted(false), 2000);
  };

  const navigateToHowTo = () => {
    navigate("/how-to");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex flex-col justify-center items-center"
      style={{
        backgroundImage: `url(${bg})`,
      }}
    >
      {/* Main Title */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center space-x-4 mb-4">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronRight className="w-16 h-16 text-cyan-400" />
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-bold text-white tracking-wider"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
            animate={{
              textShadow: [
                "0 0 10px #a855f7, 0 0 20px #a855f7",
                "0 0 20px #a855f7, 0 0 30px #a855f7",
                "0 0 10px #a855f7, 0 0 20px #a855f7",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            CEKREK.IN
          </motion.h1>

          <motion.div
            animate={{ rotate: [0, -15, 15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronRight className="w-16 h-16 text-cyan-400 rotate-180" />
          </motion.div>
        </div>
      </motion.div>

      {/* Subtitle & Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-center mb-8"
      >
        <motion.button
          onClick={handleStartGame}
          className="text-xl md:text-2xl text-white hover:text-cyan-400 transition-colors cursor-pointer"
          style={{ fontFamily: '"Press Start 2P", monospace' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={isGameStarted ? { scale: [1, 1.2, 1] } : {}}
        >
          TAP SCREEN FOR START A GAME !
        </motion.button>

        <motion.div
          className="mt-4 text-sm text-gray-300"
          style={{ fontFamily: '"Press Start 2P", monospace' }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Cekrek Dulu Upload Kemudian
        </motion.div>

        <motion.button
          onClick={navigateToHowTo}
          className="mt-6 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
          style={{ fontFamily: '"Press Start 2P", monospace' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          HOW TO USE
        </motion.button>
      </motion.div>

      {/* Arrow Cursor */}
      <motion.div
        className="text-white text-4xl"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        ▲
      </motion.div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-between items-center px-8 text-xs text-gray-200">
        <div className="flex items-center space-x-2">
          <Mail className="w-4 h-4" />
          <span style={{ fontFamily: '"Press Start 2P", monospace' }}>
            cekrek.inbooth@gmail.com
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="text-blue-400 hover:text-blue-300"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            Login as admin
          </motion.button>

          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4" />
            <span style={{ fontFamily: '"Press Start 2P", monospace' }}>
              Find Us
            </span>
          </div>

          <span style={{ fontFamily: '"Press Start 2P", monospace' }}>
            @cekrek.inbooth
          </span>
        </div>
      </div>

      {/* Game Start Overlay */}
      {isGameStarted && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            className="text-6xl text-white font-bold"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{ duration: 0.5 }}
          >
            GAME START!
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default HomePage;
