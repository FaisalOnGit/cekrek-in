import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import HowToPage from "./pages/HowToPage";
import PayPage from "./pages/PayPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/how-to" element={<HowToPage />} />
      <Route path="/pay" element={<PayPage />} />
    </Routes>
  );
}

export default App;
