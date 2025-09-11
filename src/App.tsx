import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import HowToPage from "./pages/HowToPage";
import PayPage from "./pages/PayPage";
import ChooseTemplatePage from "./pages/PlayPage";
import PhotoPage from "./pages/PhotoPage";
import PhotoCapturePage from "./pages/CapturePage";
import Dashboard from "./pages/dashboard/DashboardPage";
import Test from "./pages/TestPage";
import ResultPage from "./pages/ResultPage";
import PhotoUploadPage from "./pages/UploadPage";
import LayoutPage from "./pages/LayoutPage";
import SetupPage from "./pages/dashboard/Setup";
import EffectPage from "./pages/EffectPage";
import Login from "./pages/LoginPage";
import ThanksPage from "./pages/Thanks";
import TempPage from "./pages/ChoosePage";
import SetupRatesPage from "./pages/dashboard/Rates";
import SetupVouchersPage from "./pages/dashboard/Vouchers";
import OrdersPage from "./pages/dashboard/Orders";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/how-to" element={<HowToPage />} />
      <Route path="/pay" element={<PayPage />} />
      <Route path="/layout" element={<LayoutPage />} />
      <Route path="/template" element={<ChooseTemplatePage />} />
      <Route path="/photo" element={<PhotoPage />} />
      <Route path="/capture1" element={<PhotoCapturePage />} />
      <Route path="/result" element={<ResultPage />} />
      <Route path="/capture" element={<Test />} />
      <Route path="/upload" element={<PhotoUploadPage />} />
      <Route path="/effect" element={<EffectPage />} />
      <Route path="/thanks" element={<ThanksPage />} />
      <Route path="/temp" element={<TempPage />} />

      <Route path="/login" element={<Login />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/setup" element={<SetupPage />} />
      <Route path="/dashboard/rates" element={<SetupRatesPage />} />
      <Route path="/dashboard/vouchers" element={<SetupVouchersPage />} />
      <Route path="/dashboard/orders" element={<OrdersPage />} />
    </Routes>
  );
}

export default App;
