import { BrowserRouter, Routes, Route } from "react-router-dom";
import Trangchu from "./pages/Trangchu"; // Kiểm tra đường dẫn
import TrangPhim from "./pages/Trangphim";
import TrangChieuPhim from "./pages/TrangChieuPhim";
import UploadMovie from "./pages/UpMovie";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Trangchu />} />
        <Route path="/phim" element={<TrangPhim />} />
        <Route path="/chieuphim" element={<TrangChieuPhim />} />
        <Route path="/upmovie" element={<UploadMovie />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
