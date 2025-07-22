import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Webcam from "react-webcam";
import axios from "axios"; // Import axios for POST requests
import bgfinal from "/bg-final.png";
import bg from "/bg.png";

interface PhotoLayout {
  name: string;
  totalPhoto: number;
}

const photoLayouts: PhotoLayout[] = [
  { name: "2 Pose", totalPhoto: 2 },
  { name: "3 Pose", totalPhoto: 3 },
  { name: "4 Pose", totalPhoto: 4 },
];

const delayOptions = [
  { label: "3 Detik", value: 3 },
  { label: "5 Detik", value: 5 },
  { label: "10 Detik", value: 10 },
];

function PhotoCapturePage() {
  const navigate = useNavigate();
  const webcamRef = useRef<Webcam>(null);

  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );
  const [selectedLayout, setSelectedLayout] = useState<PhotoLayout>(
    photoLayouts[0]
  );
  const [selectedDelay, setSelectedDelay] = useState(3);
  const [showSettings, setShowSettings] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null); // Error state for API failure
  const [result, setResult] = useState<any>(null); // Result state for API success
  const [isPopupVisible, setIsPopupVisible] = useState(false); // Show popup after upload

  const webcamProps = {
    audio: false,
    screenshotFormat: "image/jpeg",
    mirrored: true,
    videoConstraints: {
      facingMode: "user",
      width: 1280,
      height: 720,
    },
  };

  useEffect(() => {
    const templateId = localStorage.getItem("selectedTemplateId");
    if (!templateId) {
      navigate("/template");
      return;
    }
    setSelectedTemplateId(templateId);
  }, [navigate]);

  const startPhotoSession = () => {
    setShowSettings(false);
    setCurrentPhotoIndex(0);
    setCapturedPhotos([]);
  };

  const startCountdown = () => {
    if (isCapturing) return;
    setIsCapturing(true);
    setCountdown(selectedDelay);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          capturePhoto();
          return null;
        }
        return (prev ?? 0) - 1;
      });
    }, 1000);
  };

  const capturePhoto = () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      setIsCapturing(false);
      return;
    }

    const newPhotos = [...capturedPhotos, imageSrc];
    const nextIndex = currentPhotoIndex + 1;
    setCapturedPhotos(newPhotos);
    setCurrentPhotoIndex(nextIndex);

    if (nextIndex >= selectedLayout.totalPhoto) {
      localStorage.setItem("capturedPhotos", JSON.stringify(newPhotos));
      localStorage.setItem("selectedLayout", JSON.stringify(selectedLayout));

      // Call the API to upload photos after all are captured
      handleSubmit(newPhotos); // Pass the captured photos to the submit function

      setTimeout(() => setIsPopupVisible(true), 2000); // Show popup after a brief timeout
    }

    setIsCapturing(false);
  };

  const retakePhoto = () => {
    if (capturedPhotos.length === 0) return;
    const newPhotos = capturedPhotos.slice(0, -1);
    setCapturedPhotos(newPhotos);
    setCurrentPhotoIndex(Math.max(0, currentPhotoIndex - 1));
  };

  const resetSession = () => {
    setShowSettings(true);
    setCurrentPhotoIndex(0);
    setCapturedPhotos([]);
    setCountdown(null);
    setIsCapturing(false);
  };

  const handleBack = () => navigate("/template");

  const handleLayoutChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const layout = photoLayouts.find((l) => l.name === e.target.value);
    if (layout) setSelectedLayout(layout);
  };

  const handleDelayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDelay(Number(e.target.value));
  };

  // Function to handle the POST request and upload photos to the API
  const handleSubmit = async (photos: string[]) => {
    try {
      const formData = new FormData();
      photos.forEach((photo, index) => {
        const byteArray = Uint8Array.from(atob(photo.split(",")[1]), (c) =>
          c.charCodeAt(0)
        );
        const file = new Blob([byteArray], { type: "image/jpeg" });
        formData.append("photos", file, `photo${index + 1}.jpg`);
      });

      const response = await axios.post(
        "http://localhost:8888/process/1", // API endpoint
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            accept: "application/json",
          },
        }
      );

      console.log("Photos uploaded successfully", response.data);
      setResult(response.data); // Save the result response
    } catch (err: any) {
      console.error("Upload failed:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to upload photos"
      );
    }
  };

  const closePopup = () => {
    setIsPopupVisible(false); // Hide popup when closed
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center pt-6"
      style={{ backgroundImage: `url(${bgfinal})` }}
    >
      <div className="text-center mb-6">
        <h1
          className="text-2xl md:text-4xl text-white mb-2"
          style={{ fontFamily: '"Press Start 2P", monospace' }}
        >
          {showSettings ? "ATUR SESI FOTO" : "SESI FOTO"}
        </h1>
        {!showSettings && (
          <p
            className="text-white text-sm"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            Foto ke-{currentPhotoIndex + 1} dari {selectedLayout.totalPhoto}
          </p>
        )}
      </div>

      {showSettings ? (
        <div className="bg-black bg-opacity-60 p-4 rounded-lg mb-4 border-2 border-white max-w-2xl">
          <div className="flex gap-6 items-end">
            <div className="flex-1">
              <label
                htmlFor="layout-select"
                className="text-white text-sm mb-2 block"
                style={{ fontFamily: '"Press Start 2P", monospace' }}
              >
                PILIH POSE
              </label>
              <select
                id="layout-select"
                value={selectedLayout.name}
                onChange={handleLayoutChange}
                className="w-full p-2 rounded-lg bg-gray-700 text-white border-2 border-gray-600 focus:border-yellow-400 focus:outline-none text-sm"
                style={{ fontFamily: '"Press Start 2P", monospace' }}
              >
                {photoLayouts.map((layout) => (
                  <option key={layout.name} value={layout.name}>
                    {layout.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label
                htmlFor="delay-select"
                className="text-white text-sm mb-2 block"
                style={{ fontFamily: '"Press Start 2P", monospace' }}
              >
                PILIH DELAY
              </label>
              <select
                id="delay-select"
                value={selectedDelay}
                onChange={handleDelayChange}
                className="w-full p-2 rounded-lg bg-gray-700 text-white border-2 border-gray-600 focus:border-yellow-400 focus:outline-none text-sm"
                style={{ fontFamily: '"Press Start 2P", monospace' }}
              >
                {delayOptions.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            <motion.button
              onClick={startPhotoSession}
              className="px-6 py-2 rounded-lg text-sm bg-green-600 hover:bg-green-700 text-white"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
            >
              MULAI
            </motion.button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-2xl bg-gray-700 rounded-full h-4 mb-6 mx-6">
          <div
            className="bg-yellow-400 h-4 rounded-full transition-all duration-500"
            style={{
              width: `${
                (currentPhotoIndex / selectedLayout.totalPhoto) * 100
              }%`,
            }}
          />
        </div>
      )}

      <div className="relative mb-6">
        <div className="w-[640px] h-[360px] bg-black rounded-lg overflow-hidden border-4 border-white shadow-lg">
          <Webcam
            ref={webcamRef}
            className="w-full h-full object-cover"
            {...webcamProps}
          />
        </div>

        {countdown !== null && (
          <motion.div className="absolute inset-0 bg-black bg-opacity-70 rounded-lg flex items-center justify-center">
            <motion.div
              className="text-white text-8xl"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5 }}
            >
              {countdown}
            </motion.div>
          </motion.div>
        )}

        {isCapturing && countdown === null && (
          <motion.div
            className="absolute inset-0 bg-white rounded-lg"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>

      {capturedPhotos.length > 0 && (
        <div className="flex gap-2 mb-6">
          {capturedPhotos.map((photo, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-20 h-12 border-2 border-white rounded overflow-hidden"
            >
              <img
                src={photo}
                alt={`Photo ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>
      )}

      {!showSettings && (
        <div className="flex gap-4 mb-6">
          {currentPhotoIndex < selectedLayout.totalPhoto && (
            <motion.button
              onClick={startCountdown}
              className="px-8 py-4 rounded-lg text-lg bg-green-600 hover:bg-green-700 text-white"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
            >
              {isCapturing ? "BERSIAP..." : "AMBIL FOTO"}
            </motion.button>
          )}

          {capturedPhotos.length > 0 && (
            <motion.button
              onClick={retakePhoto}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-4 rounded-lg text-lg"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
            >
              ULANGI
            </motion.button>
          )}

          <motion.button
            onClick={resetSession}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg text-lg"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            RESET
          </motion.button>
        </div>
      )}

      <motion.button
        onClick={handleBack}
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg text-sm"
        style={{ fontFamily: '"Press Start 2P", monospace' }}
      >
        KEMBALI
      </motion.button>

      {currentPhotoIndex >= selectedLayout.totalPhoto && !showSettings && (
        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p
            className="text-white text-lg"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            FOTO SELESAI!
          </p>
          <p
            className="text-white text-sm"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            Memproses hasil...
          </p>
        </motion.div>
      )}

      {/* Popup for displaying the API response */}
      {isPopupVisible && result && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg max-w-lg">
            <h3 className="text-lg font-semibold">Hasil Proses</h3>
            <div className="mt-4">
              {result.image_base64 && (
                <img
                  src={`data:image/png;base64,${result.image_base64}`}
                  alt="Processed Result"
                  className="w-full max-h-80 object-cover rounded-lg"
                />
              )}
            </div>
            <button
              onClick={closePopup}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PhotoCapturePage;
