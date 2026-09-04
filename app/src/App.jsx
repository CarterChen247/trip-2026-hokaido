import { HashRouter, Routes, Route } from "react-router-dom";
import DayBoardPage from "./pages/DayBoardPage";
import MapPage from "./pages/MapPage";
import InterestsPage from "./pages/InterestsPage";
import LogisticsPage from "./pages/LogisticsPage";
import PackingPage from "./pages/PackingPage";
import SyncPage from "./pages/SyncPage";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<DayBoardPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/interests" element={<InterestsPage />} />
        <Route path="/logistics" element={<LogisticsPage />} />
        <Route path="/packing" element={<PackingPage />} />
        <Route path="/sync" element={<SyncPage />} />
      </Routes>
    </HashRouter>
  );
}
