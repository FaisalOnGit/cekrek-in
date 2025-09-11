import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Upload,
  RefreshCw,
  ArrowLeft,
  Image,
  CheckCircle,
  X,
  Trash2,
} from "lucide-react";
import axios from "axios";

import bg from "/bg2.png";

interface PhotoLayout {
  name: string;
  totalPhoto: number;
}

const photoLayouts: PhotoLayout[] = [
  { name: "2 Pose", totalPhoto: 2 },
  { name: "3 Pose", totalPhoto: 3 },
  { name: "4 Pose", totalPhoto: 4 },
];

function PhotoUploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );
  const [selectedLayout, setSelectedLayout] = useState<PhotoLayout>(
    photoLayouts[0]
  );
  const [timeLeft, setTimeLeft] = useState(35 * 60);
  const [showSettings, setShowSettings] = useState(true);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);

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
    setUploadedPhotos([]);
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const remainingSlots = selectedLayout.totalPhoto - uploadedPhotos.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setUploadedPhotos((prev) => {
            const newPhotos = [...prev, result];

            // Auto-submit when all photos are uploaded
            if (newPhotos.length === selectedLayout.totalPhoto) {
              setTimeout(() => handleSubmit(newPhotos), 500);
            }

            return newPhotos;
          });
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removePhoto = (index: number) => {
    const newPhotos = uploadedPhotos.filter((_, i) => i !== index);
    setUploadedPhotos(newPhotos);
  };

  const resetSession = () => {
    setShowSettings(true);
    setUploadedPhotos([]);
    setIsUploading(false);
    setUploadProgress(0);
    setError(null);
  };

  const handleBack = () => navigate("/template");
  const BASE_URL = import.meta.env.VITE_BASE_API_URL;

  const handleLayoutChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const layout = photoLayouts.find((l) => l.name === e.target.value);
    if (layout) {
      setSelectedLayout(layout);
      // Remove excess photos if new layout requires fewer photos
      if (uploadedPhotos.length > layout.totalPhoto) {
        setUploadedPhotos((prev) => prev.slice(0, layout.totalPhoto));
      }
    }
  };

  const handleSubmit = async (photos: string[]) => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate progress animation
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 10;
      });
    }, 200);

    try {
      const formData = new FormData();
      photos.forEach((photo, index) => {
        const byteArray = Uint8Array.from(atob(photo.split(",")[1]), (c) =>
          c.charCodeAt(0)
        );
        const file = new Blob([byteArray], { type: "image/jpeg" });
        formData.append("photos", file, `photo${index + 1}.jpg`);
      });

      const selectedTemplateId = localStorage.getItem("selectedTemplateId");
      const response = await axios.post(
        `${BASE_URL}/process/${selectedTemplateId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            accept: "application/json",
          },
        }
      );

      console.log("Photos uploaded successfully", response.data);

      // Complete progress and navigate directly to result
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Navigate immediately to Result page with result data
      setTimeout(() => {
        navigate("/result", {
          state: {
            result: response.data,
            capturedPhotos: photos,
          },
        });
      }, 1000);
    } catch (err: any) {
      console.error("Upload failed:", err);
      clearInterval(progressInterval);
      setError(
        err.response?.data?.message || err.message || "Failed to upload photos"
      );
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const canUploadMore = uploadedPhotos.length < selectedLayout.totalPhoto;
  const isComplete = uploadedPhotos.length === selectedLayout.totalPhoto;

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center pt-6"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="relative z-10 p-6 flex justify-between items-start w-full">
        <div
          className="text-xl text-purple-800 hover:scale-105 transition-transform"
          style={{ fontFamily: '"Press Start 2P", monospace' }}
        >
          CEKREK.IN
        </div>
        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg border-2 border-purple-300 shadow-lg">
          <div className="text-orange-600 font-bold text-xl">
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      <div
        className="text-center mb-6"
        style={{ fontFamily: '"Press Start 2P", monospace' }}
      >
        <div className="text-3xl md:text-4xl font-bold mb-2 tracking-wider">
          <span
            className="text-white drop-shadow-lg animate-bounce"
            style={{ textShadow: "3px 3px 0px #666" }}
          >
            {showSettings ? "ATUR" : isUploading ? "MEMPROSES" : "UPLOAD"}
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
            SESI
          </span>
          <span
            className="ml-4 text-orange-500 drop-shadow-lg animate-bounce"
            style={{
              textShadow: "3px 3px 0px #cc5500",
              animationDelay: "0.4s",
            }}
          >
            FOTO
          </span>
        </div>
        {!showSettings && !isUploading && (
          <p className="text-sm text-purple-800">
            Foto {uploadedPhotos.length} dari {selectedLayout.totalPhoto} telah
            diupload
          </p>
        )}
        {isUploading && (
          <p className="text-sm text-green-600 animate-pulse">
            Sedang memproses foto Anda...
          </p>
        )}
      </div>

      {/* Progress Bar for Upload */}
      {isUploading && (
        <div className="w-full max-w-2xl mb-6 mx-6">
          <div className="bg-gray-700 rounded-full h-6 overflow-hidden border-2 border-white">
            <motion.div
              className="bg-gradient-to-r from-green-400 to-blue-500 h-full rounded-full flex items-center justify-center"
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
              transition={{ duration: 0.3 }}
            >
              <span
                className="text-white text-xs font-bold"
                style={{ fontFamily: '"Press Start 2P", monospace' }}
              >
                {Math.round(uploadProgress)}%
              </span>
            </motion.div>
          </div>
          <p
            className="text-center text-white text-xs mt-2"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            MENGUPLOAD & MEMPROSES FOTO...
          </p>
        </div>
      )}

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
        !isUploading && (
          <div className="w-full max-w-2xl bg-gray-700 rounded-full h-4 mb-6 mx-6">
            <div
              className="bg-yellow-400 h-4 rounded-full transition-all duration-500"
              style={{
                width: `${
                  (uploadedPhotos.length / selectedLayout.totalPhoto) * 100
                }%`,
              }}
            />
          </div>
        )
      )}

      {!isUploading && !showSettings && (
        <>
          {/* File Upload Area */}
          <div className="w-full max-w-2xl mb-6 mx-6">
            <div
              className={`border-4 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                dragOver
                  ? "border-yellow-400 bg-yellow-400/20"
                  : canUploadMore
                  ? "border-white bg-black/40 hover:bg-black/60"
                  : "border-gray-500 bg-gray-500/20"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileInputChange}
                className="hidden"
                disabled={!canUploadMore}
              />

              {canUploadMore ? (
                <>
                  <Upload size={48} className="mx-auto mb-4 text-white" />
                  <p
                    className="text-white text-lg mb-2"
                    style={{ fontFamily: '"Press Start 2P", monospace' }}
                  >
                    DRAG & DROP FOTO
                  </p>
                  <p className="text-white text-sm mb-4">
                    Atau klik tombol di bawah untuk memilih file
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors"
                    style={{ fontFamily: '"Press Start 2P", monospace' }}
                  >
                    PILIH FOTO
                  </button>
                  <p className="text-white text-xs mt-2">
                    Tersisa {selectedLayout.totalPhoto - uploadedPhotos.length}{" "}
                    foto lagi
                  </p>
                </>
              ) : (
                <>
                  <CheckCircle
                    size={48}
                    className="mx-auto mb-4 text-green-400"
                  />
                  <p
                    className="text-green-400 text-lg"
                    style={{ fontFamily: '"Press Start 2P", monospace' }}
                  >
                    SEMUA FOTO SUDAH DIUPLOAD!
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Uploaded Photos Preview */}
          {uploadedPhotos.length > 0 && (
            <div className="w-full max-w-2xl mb-6 mx-6">
              <h3
                className="text-white text-lg mb-4 text-center"
                style={{ fontFamily: '"Press Start 2P", monospace' }}
              >
                FOTO YANG DIUPLOAD
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {uploadedPhotos.map((photo, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group"
                  >
                    <div className="aspect-square border-2 border-white rounded-lg overflow-hidden">
                      <img
                        src={photo}
                        alt={`Upload ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => removePhoto(idx)}
                      className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {idx + 1}
                    </div>
                  </motion.div>
                ))}

                {/* Empty slots */}
                {Array.from({
                  length: selectedLayout.totalPhoto - uploadedPhotos.length,
                }).map((_, idx) => (
                  <div
                    key={`empty-${idx}`}
                    className="aspect-square border-2 border-dashed border-gray-500 rounded-lg flex items-center justify-center bg-gray-800/50"
                  >
                    <Image size={32} className="text-gray-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 mb-6">
            {canUploadMore && (
              <motion.button
                onClick={() => fileInputRef.current?.click()}
                className="px-10 py-5 rounded-xl text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3"
                style={{ fontFamily: '"Press Start 2P", monospace' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Upload size={24} />
                TAMBAH FOTO
              </motion.button>
            )}

            {uploadedPhotos.length > 0 && (
              <motion.button
                onClick={() => setUploadedPhotos([])}
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-5 rounded-xl text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3"
                style={{ fontFamily: '"Press Start 2P", monospace' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Trash2 size={24} />
                HAPUS SEMUA
              </motion.button>
            )}

            <motion.button
              onClick={resetSession}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-5 rounded-xl text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw size={24} />
              RESET
            </motion.button>
          </div>

          {isComplete && (
            <motion.button
              onClick={() => handleSubmit(uploadedPhotos)}
              className="px-12 py-6 rounded-xl text-xl bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3 mb-4"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <CheckCircle size={28} />
              PROSES FOTO
            </motion.button>
          )}

          <motion.button
            onClick={handleBack}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={20} />
            KEMBALI
          </motion.button>
        </>
      )}

      {/* Error Display */}
      {error && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-red-600 text-white p-6 rounded-lg max-w-md text-center">
            <h3
              className="text-lg font-bold mb-4"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
            >
              ERROR!
            </h3>
            <p className="mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setIsUploading(false);
                setUploadProgress(0);
              }}
              className="px-6 py-2 bg-white text-red-600 rounded-lg font-bold"
            >
              TUTUP
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default PhotoUploadPage;
