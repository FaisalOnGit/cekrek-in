import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../layout/Layout";
import AddTemplateModal from "../../components/addTemplateModal";

interface Template {
  id: number;
  name: string;
  detection_method: string;
  image_base64: string;
}

function SetupPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const res = await axios.get<Template[]>(
        "http://localhost:8888/templates"
      );
      setTemplates(res.data);
    } catch (err) {
      setError("Gagal memuat template");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <Layout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Daftar Template</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          + Add Template
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center"
          >
            <img
              src={`data:image/png;base64,${template.image_base64}`}
              alt={template.name}
              className="w-40 h-40 object-contain mb-3"
            />
            <h2 className="text-lg font-semibold">{template.name}</h2>
            <p className="text-sm text-gray-500">{template.detection_method}</p>
          </div>
        ))}
      </div>

      <AddTemplateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchTemplates}
      />
    </Layout>
  );
}

export default SetupPage;
