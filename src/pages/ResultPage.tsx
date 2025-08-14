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
  const [gifBlob, setGifBlob] = useState<Blob | null>(null);
  const [isGeneratingGif, setIsGeneratingGif] = useState(false);

  useEffect(() => {
    const stateData = location.state as {
      result: ProcessResult;
      capturedPhotos: string[];
    } | null;

    if (stateData) {
      setResult(stateData.result);
      setCapturedPhotos(stateData.capturedPhotos);
    } else {
      const savedPhotos = localStorage.getItem("capturedPhotos");
      if (savedPhotos) {
        setCapturedPhotos(JSON.parse(savedPhotos));
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

  // Fungsi untuk membuat GIF dari captured photos
  const createGifFromPhotos = async (photos: string[]): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      try {
        // Import GIF.js library (harus ditambahkan ke project)
        // npm install gif.js atau gunakan CDN
        const GIF = (window as any).GIF;

        if (!GIF) {
          throw new Error(
            "GIF.js library not found. Please add it to your project."
          );
        }

        const gif = new GIF({
          workers: 2,
          quality: 10,
          delay: 50,
          width: 640,
          height: 480,
        });

        let loadedImages = 0;
        const totalImages = photos.length;

        photos.forEach((photoSrc, index) => {
          const img = new Image();
          img.crossOrigin = "anonymous";

          img.onload = () => {
            // Create canvas to resize image if needed
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = 640;
            canvas.height = 480;

            if (ctx) {
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              gif.addFrame(canvas, { delay: 50 });
            }

            loadedImages++;

            if (loadedImages === totalImages) {
              gif.on("finished", (blob: Blob) => {
                resolve(blob);
              });

              gif.render();
            }
          };

          img.onerror = () => {
            reject(new Error(`Failed to load image ${index + 1}`));
          };

          img.src = photoSrc;
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  // Generate GIF when photos are available
  useEffect(() => {
    if (capturedPhotos.length > 0 && !gifBlob && !isGeneratingGif) {
      generateGif();
    }
  }, [capturedPhotos]);

  const generateGif = async () => {
    if (capturedPhotos.length === 0) return;

    setIsGeneratingGif(true);
    try {
      const blob = await createGifFromPhotos(capturedPhotos);
      setGifBlob(blob);
    } catch (error) {
      console.error("Error generating GIF:", error);
      // Show error message to user
      alert("Gagal membuat GIF. Pastikan library GIF.js sudah diinstall.");
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

      fetch("http://localhost:3000/save-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ base64Image }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "Image saved successfully") {
            alert("Image saved successfully to the folder!");
          } else {
            alert("Error saving image!");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Error saving image!");
        });
    }
  };

  const handleNewSession = () => {
    localStorage.removeItem("capturedPhotos");
    localStorage.removeItem("selectedLayout");
    navigate("/capture");
  };

  const handleBackToTemplate = () => {
    localStorage.removeItem("capturedPhotos");
    localStorage.removeItem("selectedLayout");
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
        {/* Original Photos and GIF */}
        <div className="flex-1 space-y-4">
          {/* Original Photos */}
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

          {/* Animated GIF */}
          <div className="bg-black bg-opacity-60 p-4 rounded-lg border-2 border-white">
            <h3
              className="text-white text-lg mb-4 text-center"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
            >
              ANIMASI GIF
            </h3>
            {isGeneratingGif ? (
              <div className="aspect-video bg-gray-700 rounded-lg flex items-center justify-center border-2 border-gray-500">
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
                  alt="Animated GIF"
                  className="w-full h-auto"
                />
              </motion.div>
            ) : (
              <div className="aspect-video bg-gray-700 rounded-lg flex items-center justify-center border-2 border-gray-500">
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

        {gifBlob && (
          <motion.button
            onClick={handleDownloadGif}
            className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-4 rounded-lg text-lg border-2 border-pink-400"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            DOWNLOAD GIF
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
