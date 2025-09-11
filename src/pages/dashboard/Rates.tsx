import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../layout/Layout";
import AddRateModal from "../../components/AddRatesModal";

interface Rate {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  is_active: boolean;
}

function SetupRatesPage() {
  const [rates, setRates] = useState<Rate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const BASE_URL = import.meta.env.VITE_BASE_API_URL;

  const fetchRates = async () => {
    try {
      setLoading(true);
      const res = await axios.get<Rate[]>(`${BASE_URL}/rates`);
      setRates(res.data);
    } catch (err) {
      setError("Gagal memuat rates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Daftar Rates</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          + Add Rate
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rates.map((rate) => (
          <div
            key={rate.id}
            className="bg-white rounded-xl shadow-md p-4 flex flex-col"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">{rate.name}</h2>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  rate.is_active
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {rate.is_active ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3 flex-1">
              {rate.description}
            </p>
            <div className="mt-auto">
              <p className="text-lg font-bold text-purple-600 mb-1">
                {formatPrice(rate.price)}
              </p>
              <p className="text-sm text-gray-500 capitalize">
                {rate.category}
              </p>
            </div>
          </div>
        ))}
      </div>

      <AddRateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchRates}
      />
    </Layout>
  );
}

export default SetupRatesPage;
