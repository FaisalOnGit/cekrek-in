import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import bgfinal from "/bg-final.png";
import bg from "/bg2.png";

// Tentukan tipe untuk template
type Template = {
  id: string;
  name: string;
  image_base64: string;
};

function ChooseTemplatePage() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("http://localhost:8888/templates/")
      .then((res) => res.json())
      .then((data: Template[]) => {
        setTemplates(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch templates:", err);
        setLoading(false);
      });
  }, []);

  const handleSelect = (templateId: string) => {
    localStorage.setItem("selectedTemplateId", templateId);
    navigate("/photo");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center pt-20"
      style={{ backgroundImage: `url(${bgfinal})` }}
    >
      <motion.h1
        className="text-3xl md:text-5xl text-white mb-12 text-center"
        style={{ fontFamily: '"Press Start 2P", monospace' }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        PILIH TEMPLATE
      </motion.h1>

      {loading ? (
        <p
          className="text-white"
          style={{ fontFamily: '"Press Start 2P", monospace' }}
        >
          Loading templates...
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          {templates.map((tpl) => (
            <motion.div
              key={tpl.id}
              whileHover={{ scale: 1.05 }}
              className="cursor-pointer"
              onClick={() => handleSelect(tpl.id)}
            >
              <img
                src={`data:image/png;base64,${tpl.image_base64}`}
                alt={tpl.name}
                className="w-64 h-80 object-cover border-4 border-white rounded-lg shadow-lg"
              />
              <p
                className="text-white text-center mt-2"
                style={{ fontFamily: '"Press Start 2P", monospace' }}
              >
                {tpl.name}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      <motion.div
        className="mt-16 text-white text-sm"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ fontFamily: '"Press Start 2P", monospace' }}
      >
        Tap template untuk lanjut ke sesi foto!
      </motion.div>
    </div>
  );
}

export default ChooseTemplatePage;
