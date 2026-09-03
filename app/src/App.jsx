import { BrowserRouter, Routes, Route } from "react-router-dom";
import DayBoardPage from "./pages/DayBoardPage";
import MapPage from "./pages/MapPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DayBoardPage />} />
        <Route path="/map" element={<MapPage />} />
      </Routes>
    </BrowserRouter>
  );
}
