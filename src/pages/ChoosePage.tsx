import { motion } from "framer-motion";
import { useState } from "react";
import bg from "/bg4.png";

function TempPage() {
  const [selectedFrame, setSelectedFrame] = useState(null);

  // Sample frames data - you can replace with your actual frames
  const frames = [
    { id: 1, name: "Frame 1", preview: "🖼️", color: "bg-blue-200" },
    { id: 2, name: "Frame 2", preview: "🎨", color: "bg-red-200" },
    { id: 3, name: "Frame 3", preview: "🌟", color: "bg-green-200" },
    { id: 4, name: "Frame 4", preview: "🎭", color: "bg-yellow-200" },
    { id: 5, name: "Frame 5", preview: "🎪", color: "bg-purple-200" },
    { id: 6, name: "Frame 6", preview: "🎯", color: "bg-pink-200" },
  ];

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center pt-20 px-4"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Container untuk kedua frame */}
      <div className="w-full max-w-6xl flex gap-6 h-96">
        {/* Frame Kiri - Preview Frame (1/3 screen) */}
        <motion.div
          className="w-1/3 bg-transparent rounded-none shadow-lg p-6 border-4 border-white"
          style={{
            imageRendering: "pixelated",
            fontFamily: '"Press Start 2P", monospace',
          }}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-sm font-bold mb-4 text-white">PREVIEW</h2>
          <div className="h-full flex items-center justify-center">
            {selectedFrame ? (
              <motion.div
                className={`${selectedFrame.color} ${selectedFrame.pattern} w-full h-48 flex flex-col items-center justify-center shadow-lg`}
                style={{
                  imageRendering: "pixelated",
                  boxShadow:
                    "inset -4px -4px 0px rgba(0,0,0,0.3), inset 4px 4px 0px rgba(255,255,255,0.3)",
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-4xl mb-2">{selectedFrame.preview}</div>
                <p className="text-xs text-black text-center px-2">
                  {selectedFrame.name}
                </p>
              </motion.div>
            ) : (
              <div className="text-center text-white">
                <div className="text-2xl mb-2 animate-pulse">⬜</div>
                <p className="text-xs">SELECT FRAME</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Frame Kanan - Koleksi Frame (2/3 screen) */}
        <motion.div
          className="w-2/3 bg-transparent rounded-none shadow-lg p-6 overflow-auto border-4 border-white"
          style={{
            imageRendering: "pixelated",
            fontFamily: '"Press Start 2P", monospace',
          }}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-sm font-bold mb-4 text-white">
            FRAME COLLECTION
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {frames.map((frame) => (
              <motion.div
                key={frame.id}
                className={`${frame.color} ${
                  frame.pattern
                } p-3 cursor-pointer transition-all ${
                  selectedFrame?.id === frame.id
                    ? "shadow-lg scale-105"
                    : "hover:scale-102"
                }`}
                style={{
                  imageRendering: "pixelated",
                  boxShadow:
                    selectedFrame?.id === frame.id
                      ? "inset -2px -2px 0px rgba(0,0,0,0.5), inset 2px 2px 0px rgba(255,255,255,0.5), 0 0 0 2px #00ff00"
                      : "inset -2px -2px 0px rgba(0,0,0,0.3), inset 2px 2px 0px rgba(255,255,255,0.3)",
                }}
                onClick={() => setSelectedFrame(frame)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">{frame.preview}</div>
                  <p className="text-xs text-black font-bold">{frame.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default TempPage;
