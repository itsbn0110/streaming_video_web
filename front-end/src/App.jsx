import { BrowserRouter, Routes, Route } from "react-router-dom";
import Trangchu from "./pages/Trangchu"; // Kiểm tra đường dẫn
import TrangPhim from "./pages/Trangphim";
import TrangChieuPhim from "./pages/TrangChieuPhim";
import UploadMovie from "./pages/UpMovie";
import Login from "./pages/Login";
import Register from "./pages/Register";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Trangchu />} />
        <Route path="/phim" element={<TrangPhim />} />
        <Route path="/chieuphim" element={<TrangChieuPhim />} />
        <Route path="/upmovie" element={<UploadMovie />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
