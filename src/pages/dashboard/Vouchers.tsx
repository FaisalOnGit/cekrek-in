import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../layout/Layout";
import AddVoucherModal from "../../components/AddVoucherModal";

interface Voucher {
  id: number;
  code: string;
  name: string;
  description: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  max_discount_amount: number;
  min_order_amount: number;
  usage_limit: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
}

function SetupVouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const BASE_URL = import.meta.env.VITE_BASE_API_URL;

  const fetchVouchers = async () => {
    try {
      setLoading(true);

      // ambil token dari localStorage
      const token = localStorage.getItem("access_token");

      const res = await axios.get<Voucher[]>(`${BASE_URL}/vouchers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setVouchers(res.data);
    } catch (err) {
      setError("Gagal memuat vouchers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isVoucherExpired = (validUntil: string) => {
    return new Date(validUntil) < new Date();
  };

  const getDiscountText = (voucher: Voucher) => {
    if (voucher.discount_type === "percentage") {
      return `${voucher.discount_value}%`;
    }
    return formatPrice(voucher.discount_value);
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Daftar Vouchers</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          + Add Voucher
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {vouchers.map((voucher) => {
          const expired = isVoucherExpired(voucher.valid_until);

          return (
            <div
              key={voucher.id}
              className="bg-white rounded-xl shadow-md p-4 flex flex-col border-l-4 border-purple-500"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-sm font-mono rounded">
                    {voucher.code}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      voucher.is_active && !expired
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {expired
                      ? "Expired"
                      : voucher.is_active
                      ? "Active"
                      : "Inactive"}
                  </span>
                </div>
              </div>

              <h2 className="text-lg font-semibold mb-2">{voucher.name}</h2>
              <p className="text-sm text-gray-600 mb-3 flex-1">
                {voucher.description}
              </p>

              <div className="space-y-2 mb-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Diskon:</span>
                  <span className="font-semibold text-purple-600">
                    {getDiscountText(voucher)}
                  </span>
                </div>

                {voucher.max_discount_amount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Maks Diskon:</span>
                    <span className="text-sm font-medium">
                      {formatPrice(voucher.max_discount_amount)}
                    </span>
                  </div>
                )}

                {voucher.min_order_amount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Min Order:</span>
                    <span className="text-sm font-medium">
                      {formatPrice(voucher.min_order_amount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Limit Penggunaan:
                  </span>
                  <span className="text-sm font-medium">
                    {voucher.usage_limit === 0
                      ? "Unlimited"
                      : voucher.usage_limit}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Berlaku: {formatDate(voucher.valid_from)}</span>
                  <span>Sampai: {formatDate(voucher.valid_until)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AddVoucherModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchVouchers}
      />
    </Layout>
  );
}

export default SetupVouchersPage;
