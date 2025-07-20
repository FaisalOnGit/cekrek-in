import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import HowToPage from "./pages/HowToPage";
import PayPage from "./pages/PayPage";
import ChooseTemplatePage from "./pages/PlayPage";
import PhotoPage from "./pages/PhotoPage";
import PhotoCapturePage from "./pages/CapturePage";
import Dashboard from "./pages/DashboardPage";
import Test from "./pages/TestPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/how-to" element={<HowToPage />} />
      <Route path="/pay" element={<PayPage />} />
      <Route path="/template" element={<ChooseTemplatePage />} />
      <Route path="/photo" element={<PhotoPage />} />
      <Route path="/capture" element={<PhotoCapturePage />} />
      <Route path="/test" element={<Test />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
