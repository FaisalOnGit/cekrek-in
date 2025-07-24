import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mail, Search } from "lucide-react";
import bgfinal from "/bg-final.png";
import love from "/love.png";
import awan1 from "/awan1.png";
import awan2 from "/awan2.png";
import awan3 from "/awan3.png";
import awan4 from "/awan4.png";
import awan5 from "/awan5.png";
import bulan from "/bulan.png";
import left from "/left.png";
import right from "/right.png";

function HomePage() {
  const navigate = useNavigate();
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [showGameStart, setShowGameStart] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const handleStartGame = () => {
    setIsGameStarted(true);
    setShowGameStart(true);

    // Setelah 1 detik, sembunyikan "GAME START!" dan mulai countdown
    setTimeout(() => {
      setShowGameStart(false);
      setCountdown(3);

      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setIsGameStarted(false);
            setCountdown(null);
            navigate("/pay");
            return null;
          }
          return prev! - 1;
        });
      }, 1000);
    }, 1000);
  };

  const navigateToHowTo = () => {
    navigate("/how-to");
  };

  const cloudData = [
    { src: awan1, top: "10%", left: "5%", size: "w-16 md:w-24", delay: 0 },
    { src: awan2, top: "20%", right: "10%", size: "w-20 md:w-28", delay: 0.5 },
    { src: awan3, bottom: "30%", left: "15%", size: "w-16 md:w-24", delay: 1 },
    {
      src: awan4,
      bottom: "20%",
      right: "5%",
      size: "w-24 md:w-32",
      delay: 1.2,
    },
    { src: awan5, top: "20%", left: "40%", size: "w-20 md:w-28", delay: 0.3 },
  ];

  const renderedClouds = cloudData.map((cloud, index) => (
    <motion.img
      key={index}
      src={cloud.src}
      alt={`Cloud ${index + 1}`}
      className="absolute w-20 md:w-28 opacity-70"
      style={{
        ...("top" in cloud ? { top: cloud.top } : {}),
        ...("bottom" in cloud ? { bottom: cloud.bottom } : {}),
        ...("left" in cloud ? { left: cloud.left } : {}),
        ...("right" in cloud ? { right: cloud.right } : {}),
        zIndex: 10,
      }}
      animate={{ y: [0, -15, 0] }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: cloud.delay,
      }}
    />
  ));

  const loveIcons = Array.from({ length: 5 }, (_, index) => (
    <motion.img
      key={index}
      src={love}
      alt="Love"
      className="w-6 h-6 md:w-8 md:h-8"
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 1, repeat: Infinity, delay: index * 0.2 }}
    />
  ));

  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex flex-col justify-center items-center"
      style={{
        backgroundImage: `url(${bgfinal})`,
      }}
    >
      {renderedClouds}
      <div className="absolute top-4 right-4 flex space-x-2 z-50">
        {loveIcons}
      </div>
      <div className="absolute -top-6 -left-6 flex space-x-2 z-50">
        <motion.img
          src={bulan}
          alt="Cloud"
          className="w-16 h-16 md:w-32 md:h-32"
          initial={{ scale: 1 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center space-x-4 mb-4">
          <motion.div
            className="text-4xl md:text-6xl font-bold text-white tracking-wider"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
            animate={{
              rotate: [0, -15, 15, 0],
              textShadow: [
                "0 0 10px #a855f7, 0 0 20px #a855f7",
                "0 0 20px #a855f7, 0 0 30px #a855f7",
                "0 0 10px #a855f7, 0 0 20px #a855f7",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            &gt;
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
            className="text-4xl md:text-6xl font-bold text-white tracking-wider"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
            animate={{
              rotate: [0, -15, 15, 0],
              textShadow: [
                "0 0 10px #a855f7, 0 0 20px #a855f7",
                "0 0 20px #a855f7, 0 0 30px #a855f7",
                "0 0 10px #a855f7, 0 0 20px #a855f7",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            &lt;
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

      {isGameStarted && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
        >
          <motion.div
            className="text-6xl text-white font-bold"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5 }}
          >
            {showGameStart ? "GAME START!" : countdown}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default HomePage;
