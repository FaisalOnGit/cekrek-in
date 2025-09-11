import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Search } from "lucide-react";
import bgfinal from "/bg-final.png";

interface StepPanelProps {
  title: string;
  steps: string[];
  className?: string;
}

const StepPanel: React.FC<StepPanelProps> = ({
  title,
  steps,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className={`relative bg-gradient-to-br from-blue-600/80 to-purple-700/80 backdrop-blur-sm rounded-lg p-6 border-4 border-cyan-400 shadow-2xl ${className}`}
      style={{
        clipPath:
          "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
      }}
    >
      <div className="absolute top-0 right-0 w-6 h-6 bg-cyan-400 transform rotate-45 translate-x-3 -translate-y-3"></div>
      <div className="absolute bottom-0 left-0 w-6 h-6 bg-cyan-400 transform rotate-45 -translate-x-3 translate-y-3"></div>
      <div className="absolute inset-0 rounded-lg border-2 border-cyan-300/50 animate-pulse"></div>

      <h2
        className="text-xl md:text-2xl font-bold text-cyan-300 mb-6 text-center"
        style={{ fontFamily: '"Press Start 2P", monospace' }}
      >
        {title}
      </h2>

      <ul className="space-y-4">
        {steps.map((step, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
            className="flex items-start space-x-3"
          >
            <div className="w-2 h-2 bg-cyan-400 rounded-full mt-3 flex-shrink-0 animate-pulse"></div>
            <p
              className="text-white text-sm leading-relaxed"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
            >
              {step}
            </p>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

function HowToPage() {
  const navigate = useNavigate();

  const leftSteps = [
    "Tap the screen to make a payment via QRIS (Add Voucher Code if u have)",
    "After the payment is complete, choose your preferred template.",
    "For each photo session, you can retake up to 2 times.",
    "After the photoshoot, select a filter of your choice.",
    "Please enter your email address to receive the soft file.",
    'Proceed to print the photo by tapping "Print".',
  ];

  const rightSteps = [
    "Tap layar untuk melakukan pembayaran melalui QRIS (Gunakan code voucher jika ada)",
    "Setelah pembayaran selesai, pilih template sesuai keinginan Anda.",
    "Untuk setiap sesi foto, Anda dapat melakukan retake hingga 2 kali.",
    "Setelah sesi pemotretan selesai, pilih filter yang Anda sukai.",
    "Silakan masukkan alamat email Anda untuk pengiriman file digital (soft file).",
    'Lanjutkan untuk mencetak foto dengan menekan tombol "Print".',
  ];

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url(${bgfinal})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.button
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          onClick={handleBackClick}
          className="mb-8 flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
          <span
            className="text-sm"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            BACK
          </span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1
            className="text-3xl md:text-5xl font-bold text-white mb-4"
            style={{
              fontFamily: '"Press Start 2P", monospace',
              textShadow:
                "0 0 20px #a855f7, 0 0 30px #a855f7, 0 0 40px #a855f7",
            }}
          >
            HOW TO USE
          </h1>
          <div
            className="text-lg text-cyan-300"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            STEP BY STEP GUIDE
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <StepPanel title="STEP BY STEP" steps={leftSteps} />
          <StepPanel title="Langkah - Langkah" steps={rightSteps} />
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-between items-center px-8 text-xs text-gray-200">
        <div className="flex items-center space-x-2">
          <Mail className="w-4 h-4" />
          <span style={{ fontFamily: '"Press Start 2P", monospace' }}>
            cekrek.inbooth@gmail.com
          </span>
        </div>

        <div className="flex items-center space-x-4">
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

export default HowToPage;
