import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import bgfinal from "/bg-final.png";

interface PhotoLayout {
  name: string;
  totalPhoto: number;
}

const photoLayouts: PhotoLayout[] = [
  {
    name: "4 Pose",
    totalPhoto: 4,
  },
  {
    name: "3 Pose",
    totalPhoto: 3,
  },
  {
    name: "2 Pose",
    totalPhoto: 2,
  },
];

function PhotoLayoutPage() {
  const navigate = useNavigate();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );
  const [selectedLayout, setSelectedLayout] = useState<PhotoLayout | null>(
    null
  );

  useEffect(() => {
    // Ambil template ID yang dipilih dari localStorage
    const templateId = localStorage.getItem("selectedTemplateId");
    if (!templateId) {
      // Jika tidak ada template yang dipilih, kembali ke halaman template
      navigate("/template");
      return;
    }
    setSelectedTemplateId(templateId);
  }, [navigate]);

  const handleLayoutSelect = (layout: PhotoLayout) => {
    setSelectedLayout(layout);
    // Simpan layout yang dipilih ke localStorage
    localStorage.setItem("selectedLayout", JSON.stringify(layout));
    // Lanjut ke halaman capture foto atau halaman berikutnya
    navigate("/capture");
  };

  const handleBack = () => {
    navigate("/template");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center pt-20"
      style={{ backgroundImage: `url(${bgfinal})` }}
    >
      <motion.h1
        className="text-3xl md:text-5xl text-white mb-4 text-center"
        style={{ fontFamily: '"Press Start 2P", monospace' }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        PILIH LAYOUT FOTO
      </motion.h1>

      <motion.p
        className="text-white text-sm mb-12 text-center px-4"
        style={{ fontFamily: '"Press Start 2P", monospace' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Berapa pose yang ingin kamu ambil?
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 mb-8">
        {photoLayouts.map((layout, index) => (
          <motion.div
            key={layout.name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer relative"
            onClick={() => handleLayoutSelect(layout)}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <div className="relative group">
              {/* Card untuk pilihan foto */}
              <div className="w-64 h-80 bg-gradient-to-br from-blue-600 to-purple-700 border-4 border-white rounded-lg shadow-lg transition-all duration-300 group-hover:border-yellow-400 flex flex-col justify-center items-center">
                {/* Angka besar di tengah */}
                <div
                  className="text-white text-8xl mb-4 font-bold"
                  style={{ fontFamily: '"Press Start 2P", monospace' }}
                >
                  {layout.totalPhoto}
                </div>

                {/* Label FOTO */}
                <div
                  className="text-white text-2xl mb-2"
                  style={{ fontFamily: '"Press Start 2P", monospace' }}
                >
                  FOTO
                </div>

                {/* Efek hover overlay */}
                <div className="absolute inset-0 bg-yellow-400 bg-opacity-20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Badge jumlah foto (opsional, bisa dihapus karena redundan) */}
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-black rounded-full w-12 h-12 flex items-center justify-center">
                <span
                  className="text-xs font-bold"
                  style={{ fontFamily: '"Press Start 2P", monospace' }}
                >
                  {layout.totalPhoto}
                </span>
              </div>
            </div>

            <p
              className="text-white text-center mt-4 text-lg"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
            >
              {layout.name}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Tombol kembali */}
      <motion.button
        onClick={handleBack}
        className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg transition-colors duration-300 mb-8"
        style={{ fontFamily: '"Press Start 2P", monospace' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        KEMBALI
      </motion.button>

      <motion.div
        className="text-white text-sm text-center px-4"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ fontFamily: '"Press Start 2P", monospace' }}
      >
        Pilih layout untuk mulai sesi foto!
      </motion.div>
    </div>
  );
}

export default PhotoLayoutPage;
