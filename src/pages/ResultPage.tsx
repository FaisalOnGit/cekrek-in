import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import bg from "/bg2.png";
import { convertToGif } from "../utils/gifCoverter";
import RetroButton from "../components/ui/RetroButton";

interface ProcessResult {
  image_base64?: string;
  message?: string;
  status?: string;
}

function ResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [originalPhotos, setOriginalPhotos] = useState<string[]>([]);
  const [processedPhotos, setProcessedPhotos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [gifBlob, setGifBlob] = useState<Blob | null>(null);
  const [isGeneratingGif, setIsGeneratingGif] = useState(false);

  useEffect(() => {
    const stateData = location.state as {
      result: ProcessResult;
      originalPhotos: string[];
      processedPhotos: string[];
    } | null;

    if (stateData) {
      setResult(stateData.result);
      setOriginalPhotos(stateData.originalPhotos || []);
      setProcessedPhotos(stateData.processedPhotos || []);
    } else {
      const savedPhotos = localStorage.getItem("capturedPhotos");
      if (savedPhotos) {
        const photos = JSON.parse(savedPhotos);
        setOriginalPhotos(photos);
        setProcessedPhotos(photos); // Fallback jika tidak ada processed photos
      }

      if (!savedPhotos) {
        navigate("/capture");
        return;
      }
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, [location.state, navigate]);

  // Generate GIF menggunakan processedPhotos (yang sudah ada effect)
  useEffect(() => {
    if (processedPhotos.length > 0 && !gifBlob && !isGeneratingGif) {
      generateGif();
    }
  }, [processedPhotos]);

  const generateGif = async () => {
    if (processedPhotos.length === 0) return; // UBAH: gunakan processedPhotos

    setIsGeneratingGif(true);

    // Convert processed photos from data URL to File objects for gifshot
    const imageFiles = processedPhotos.map((photo) => {
      // UBAH: gunakan processedPhotos
      const byteString = atob(photo.split(",")[1]); // Decode base64 string
      const mimeString = photo.split(",")[0].split(":")[1].split(";")[0]; // Get mime type
      const buffer = new ArrayBuffer(byteString.length);
      const view = new Uint8Array(buffer);

      for (let i = 0; i < byteString.length; i++) {
        view[i] = byteString.charCodeAt(i);
      }

      return new File([buffer], `image-${Date.now()}.png`, {
        type: mimeString,
      });
    });

    try {
      // Call the convertToGif function with the image files
      const gifUrl = await convertToGif(imageFiles, {
        width: 756,
        height: 720,
        frameDuration: 0.5,
        quality: 10,
      });

      // Convert the result from URL to Blob and set it
      const response = await fetch(gifUrl);
      const blob = await response.blob();
      setGifBlob(blob);
    } catch (error) {
      console.error("Error generating GIF:", error);
      alert("Gagal membuat GIF. Pastikan library gifshot sudah diinstall.");
    } finally {
      setIsGeneratingGif(false);
    }
  };

  const handleDownloadGif = () => {
    if (gifBlob) {
      const url = URL.createObjectURL(gifBlob);
      const link = document.createElement("a");
      link.download = `cekrek-animation-${Date.now()}.gif`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleDownload = () => {
    if (result?.image_base64) {
      const base64Image = result.image_base64;
      const mode = localStorage.getItem("layout") || "cut";

      fetch(`http://localhost:8000/save-image/?mode=${mode}`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ base64Image }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "Image saved successfully") {
            console.log("Image saved successfully");
          } else {
            console.log("Error saving image");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        })
        .finally(() => {
          // apapun hasilnya, tetap navigate ke /thanks
          navigate("/thanks");
        });
    } else {
      // kalau tidak ada image tetap navigate juga
      navigate("/thanks");
    }
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
        {/* Photos with Effects and GIF */}
        <div className="flex-1 space-y-4">
          {/* Photos with Effects */}
          <div className="bg-black bg-opacity-60 p-4 rounded-lg border-2 border-blue-400">
            <h3
              className="text-blue-400 text-lg mb-4 text-center"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
            >
              FOTO DENGAN EFFECT
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {processedPhotos.map((photo, idx) => (
                <motion.div
                  key={idx}
                  className="aspect-[756/720] border-2 border-blue-400 rounded overflow-hidden"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * idx }}
                >
                  <img
                    src={photo}
                    alt={`Processed Photo ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Animated GIF */}
          <div className="bg-black bg-opacity-60 p-4 rounded-lg border-2 border-white">
            <h3
              className="text-white text-lg mb-4 text-center"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
            >
              ANIMASI GIF (DENGAN EFFECT)
            </h3>
            {isGeneratingGif ? (
              <div className="aspect-[756/720] bg-gray-700 rounded-lg flex items-center justify-center border-2 border-gray-500">
                <div className="text-center">
                  <motion.div
                    className="w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-2"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <p
                    className="text-gray-400 text-xs"
                    style={{ fontFamily: '"Press Start 2P", monospace' }}
                  >
                    MEMBUAT GIF...
                  </p>
                </div>
              </div>
            ) : gifBlob ? (
              <motion.div
                className="border-4 border-green-400 rounded-lg overflow-hidden shadow-2xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <img
                  src={URL.createObjectURL(gifBlob)}
                  alt="Animated GIF with Effects"
                  className="w-full h-auto"
                />
              </motion.div>
            ) : (
              <div className="aspect-[756/720] bg-gray-700 rounded-lg flex items-center justify-center border-2 border-gray-500">
                <div className="text-center">
                  <p
                    className="text-gray-400 text-xs"
                    style={{ fontFamily: '"Press Start 2P", monospace' }}
                  >
                    GIF TIDAK
                    <br />
                    TERSEDIA
                  </p>
                  <button
                    onClick={generateGif}
                    className="mt-2 px-4 py-2 bg-green-600 text-white text-xs rounded"
                    style={{ fontFamily: '"Press Start 2P", monospace' }}
                  >
                    BUAT GIF
                  </button>
                </div>
              </div>
            )}
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
          <RetroButton onClick={handleDownload}>Print</RetroButton>
        )}

        {gifBlob && (
          <RetroButton onClick={handleDownloadGif}>DOWNLOAD GIF</RetroButton>
        )}
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
