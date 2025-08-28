import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

interface AddTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // supaya bisa refresh list template setelah tambah
}

function AddTemplateModal({
  isOpen,
  onClose,
  onSuccess,
}: AddTemplateModalProps) {
  const [name, setName] = useState("");
  const [detectionMethod, setDetectionMethod] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const BASE_URL = import.meta.env.VITE_BASE_API_URL;

  if (!isOpen) return null;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !detectionMethod || !file) {
      alert("Semua field wajib diisi");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("detection_method", detectionMethod);
      formData.append("file", file);

      await axios.post(`${BASE_URL}/templates`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onSuccess(); // refresh list
      onClose(); // tutup modal
    } catch (err) {
      alert("Gagal menambahkan template");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Tambah Template Baru</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Detection Method */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Detection Method *
            </label>
            <select
              className="w-full border rounded px-3 py-2"
              value={detectionMethod}
              onChange={(e) => setDetectionMethod(e.target.value)}
              required
            >
              <option value="">Pilih metode</option>
              <option value="transparent">Transparent</option>
              <option value="white">White</option>
              <option value="green">Green</option>
            </select>
          </div>

          {/* File */}
          <div>
            <label className="block text-sm font-medium mb-1">File *</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTemplateModal;
