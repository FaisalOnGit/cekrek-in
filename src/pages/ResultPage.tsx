import { useLocation, useNavigate } from "react-router-dom";

function ResultPage() {
  const location = useLocation();
  const { result } = location.state || {}; // Retrieve the result data passed from the previous page
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col items-center pt-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-4">Hasil Proses</h2>
        {result ? (
          <div>
            <img
              src={`data:image/png;base64,${result.image_base64}`}
              alt="Processed Image"
              className="w-full max-h-80 object-cover rounded-lg"
            />
            <p className="text-sm text-gray-600 mt-4">{result.description}</p>
          </div>
        ) : (
          <p className="text-red-500">Tidak ada hasil untuk ditampilkan.</p>
        )}
      </div>

      <button
        onClick={() => navigate("/")}
        className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg"
      >
        Kembali ke Halaman Utama
      </button>
    </div>
  );
}

export default ResultPage;
