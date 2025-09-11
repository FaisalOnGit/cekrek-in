import { useState } from "react";
import axios from "axios";

interface AddVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface VoucherForm {
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

function AddVoucherModal({ isOpen, onClose, onSuccess }: AddVoucherModalProps) {
  const [form, setForm] = useState<VoucherForm>({
    code: "",
    name: "",
    description: "",
    discount_type: "percentage",
    discount_value: 0,
    max_discount_amount: 0,
    min_order_amount: 0,
    usage_limit: 0,
    valid_from: "",
    valid_until: "",
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const BASE_URL = import.meta.env.VITE_BASE_API_URL;

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      is_active: e.target.checked,
    }));
  };

  const formatDateTimeLocal = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.code ||
      !form.name ||
      !form.description ||
      !form.valid_from ||
      !form.valid_until
    ) {
      setError("Semua field wajib diisi");
      return;
    }

    if (new Date(form.valid_from) >= new Date(form.valid_until)) {
      setError("Tanggal mulai harus lebih awal dari tanggal berakhir");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Ambil token dari localStorage
      const token = localStorage.getItem("access_token");

      // Convert datetime-local ke ISO string
      const payload = {
        ...form,
        valid_from: new Date(form.valid_from).toISOString(),
        valid_until: new Date(form.valid_until).toISOString(),
      };

      await axios.post(`${BASE_URL}/vouchers`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      onSuccess();
      onClose();

      // Reset form
      setForm({
        code: "",
        name: "",
        description: "",
        discount_type: "percentage",
        discount_value: 0,
        max_discount_amount: 0,
        min_order_amount: 0,
        usage_limit: 0,
        valid_from: "",
        valid_until: "",
        is_active: true,
      });
    } catch (err) {
      setError("Gagal menambah voucher");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setForm({
      code: "",
      name: "",
      description: "",
      discount_type: "percentage",
      discount_value: 0,
      max_discount_amount: 0,
      min_order_amount: 0,
      usage_limit: 0,
      valid_from: "",
      valid_until: "",
      is_active: true,
    });
    setError(null);
  };

  // Set default dates when modal opens
  const setDefaultDates = () => {
    if (!form.valid_from && !form.valid_until) {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date(now);
      nextWeek.setDate(nextWeek.getDate() + 7);

      setForm((prev) => ({
        ...prev,
        valid_from: formatDateTimeLocal(tomorrow),
        valid_until: formatDateTimeLocal(nextWeek),
      }));
    }
  };

  if (!isOpen) return null;

  // Set default dates when modal opens
  if (isOpen && !form.valid_from && !form.valid_until) {
    setTimeout(setDefaultDates, 0);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Add New Voucher</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Code *
              </label>
              <input
                type="text"
                name="code"
                value={form.code}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g. WELCOME10"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Welcome Discount"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Deskripsi voucher..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Type *
              </label>
              <select
                name="discount_type"
                value={form.discount_type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (IDR)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Value *
              </label>
              <input
                type="number"
                name="discount_value"
                value={form.discount_value}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder={
                  form.discount_type === "percentage" ? "10" : "50000"
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Discount Amount
              </label>
              <input
                type="number"
                name="max_discount_amount"
                value={form.max_discount_amount}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="0 = No limit"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Order Amount
              </label>
              <input
                type="number"
                name="min_order_amount"
                value={form.min_order_amount}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="0 = No minimum"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usage Limit
            </label>
            <input
              type="number"
              name="usage_limit"
              value={form.usage_limit}
              onChange={handleInputChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="0 = Unlimited"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valid From *
              </label>
              <input
                type="datetime-local"
                name="valid_from"
                value={form.valid_from}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valid Until *
              </label>
              <input
                type="datetime-local"
                name="valid_until"
                value={form.valid_until}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_active"
              id="is_active"
              checked={form.is_active}
              onChange={handleCheckboxChange}
              className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
            />
            <label
              htmlFor="is_active"
              className="ml-2 text-sm font-medium text-gray-700"
            >
              Active
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Voucher"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddVoucherModal;
