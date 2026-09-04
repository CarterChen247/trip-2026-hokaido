import { BrowserRouter, Routes, Route } from "react-router-dom";
import DayBoardPage from "./pages/DayBoardPage";
import MapPage from "./pages/MapPage";
import InterestsPage from "./pages/InterestsPage";
import LogisticsPage from "./pages/LogisticsPage";
import PackingPage from "./pages/PackingPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DayBoardPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/interests" element={<InterestsPage />} />
        <Route path="/logistics" element={<LogisticsPage />} />
        <Route path="/packing" element={<PackingPage />} />
      </Routes>
    </BrowserRouter>
  );
}
