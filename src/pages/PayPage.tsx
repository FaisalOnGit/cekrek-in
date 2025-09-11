import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mail, Search } from "lucide-react";
import { useState } from "react";
import bgfinal from "/bg-final.png";
import love from "/love.png";
import awan1 from "/awan1.png";
import awan2 from "/awan2.png";
import awan3 from "/awan3.png";
import awan4 from "/awan4.png";
import bulan from "/bulan.png";

function PayPage() {
  const navigate = useNavigate();
  const [voucherCode, setVoucherCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (!voucherCode.trim()) {
      alert("Masukkan kode voucher terlebih dahulu!");
      return;
    }

    setIsLoading(true);

    try {
      // Ambil token dari localStorage
      const token = localStorage.getItem("access_token");

      const response = await fetch("http://localhost:8888/orders/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // <<--- tambah token di sini
        },
        body: JSON.stringify({
          rate_id: 1,
          quantity: 1,
          voucher_code: voucherCode,
          notes: "string",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Order created successfully:", data);
        navigate("/template");
      } else {
        const errorData = await response.json();
        console.error("Error creating order:", errorData);
        alert("Gagal memproses voucher. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Terjadi kesalahan jaringan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
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

      <div className="flex items-center justify-center space-x-4 mb-4">
        <motion.div
          className="text-2xl text-white"
          style={{ fontFamily: '"Press Start 2P", monospace' }}
          animate={{
            y: [0, -4, 0], // bounce effect: naik - turun
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          SCAN HERE!
        </motion.div>
      </div>

      <div className="flex items-center justify-center space-x-4 mb-4">
        <motion.div
          className="text-xl text-cyan-400"
          style={{ fontFamily: '"Press Start 2P", monospace' }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          IDR: 30,000
        </motion.div>
      </div>

      <div className="flex items-center justify-center space-x-4 mb-4">
        <motion.div
          className="text-xl text-white"
          style={{ fontFamily: '"Press Start 2P", monospace' }}
          animate={{
            opacity: [1, 0.6, 1],
            x: [0, -1, 1, -1, 0], // glitch effect
            skewX: [0, 5, -5, 0],
          }}
          transition={{
            duration: 0.2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        >
          Time Remaining 6:53
        </motion.div>
      </div>

      <div className="mb-6">
        <img
          src="https://api.qrserver.com/v1/create-qr-code/?data=cekrek.inbooth&size=200x200"
          alt="QR Code"
          className="w-40 h-40 md:w-52 md:h-52 rounded-lg shadow-lg"
        />
      </div>

      {/* Tombol Input Voucher */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-4 flex items-center space-x-4"
      >
        <input
          type="text"
          placeholder="Kode Voucher"
          value={voucherCode}
          onChange={(e) => setVoucherCode(e.target.value)}
          className="px-4 py-2 rounded-lg text-sm focus:outline-none"
          style={{
            fontFamily: '"Press Start 2P", monospace',
          }}
          disabled={isLoading}
        />
        <button
          className={`px-4 py-2 ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-yellow-400 hover:bg-yellow-300"
          } text-black rounded-lg text-sm tracking-wider transition-all`}
          style={{ fontFamily: '"Press Start 2P", monospace' }}
          onClick={handleClick}
          disabled={isLoading}
        >
          {isLoading ? "..." : "Use"}
        </button>
      </motion.div>
      <div className="flex items-center justify-center mt-2">
        <motion.div
          className="text-xs text-white"
          style={{ fontFamily: '"Press Start 2P", monospace' }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Masukan Code Voucher Jika Tersedia (cek instgram)
        </motion.div>
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

export default PayPage;
