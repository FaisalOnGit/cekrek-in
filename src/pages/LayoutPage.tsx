import { motion } from "framer-motion";
import { Mail, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import bgfinal from "/bg-final.png";
import love from "/love.png";
import awan1 from "/awan1.png";
import awan2 from "/awan2.png";
import awan3 from "/awan3.png";
import awan4 from "/awan4.png";
import awan5 from "/awan5.png";
import bulan from "/bulan.png";
import cut from "/cut.png";
import noCut from "/nocut.png";

function LayoutPage() {
  const navigate = useNavigate();
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

  const handleSelect = (type: "cut" | "nocut") => {
    localStorage.setItem("layout", type);
    navigate("/capture");
  };

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
        <div className="flex items-center justify-center space-x-4 mb-4"></div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-center mb-8"
      >
        <motion.button
          className="text-2xl md:text-5xl text-white bg-transparent hover:bg-transparent transition-all cursor-pointer"
          style={{ fontFamily: '"Press Start 2P", monospace' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-white">Choose</span>
          <span className="text-red-500"> Layout</span>
        </motion.button>
      </motion.div>

      {/* Cards Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="flex gap-8 md:gap-12 mb-16"
      >
        {/* Cut Card */}
        <motion.div
          onClick={() => handleSelect("cut")}
          className="bg-blue-500/50 backdrop-blur-md rounded-xl p-16 text-center cursor-pointer border border-white/20"
          whileHover={{
            scale: 1.05,
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <motion.img
            src={cut}
            alt="Cut Layout"
            className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 object-contain"
            whileHover={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.5 }}
          />
          <h3
            className="text-white text-sm md:text-base font-bold"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            CUT
          </h3>
        </motion.div>

        {/* No Cut Card */}
        <motion.div
          onClick={() => handleSelect("nocut")}
          className="bg-red-600/50 backdrop-blur-md rounded-xl p-16 text-center cursor-pointer border border-white/20"
          whileHover={{
            scale: 1.05,
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <motion.img
            src={noCut}
            alt="No Cut Layout"
            className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 object-contain"
            whileHover={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 0.5 }}
          />
          <h3
            className="text-white text-sm md:text-base font-bold"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            NO CUT
          </h3>
        </motion.div>
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
    </div>
  );
}

export default LayoutPage;
