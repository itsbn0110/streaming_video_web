// const fs = require("fs");
// const https = require("https");
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import axios from "axios";

const app = express();

const port = 3000;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

const getVideoResponse = async (movieId) => {
  const res = await axios.get(
    `http://localhost:8082/api/movies/golang/${movieId}`
  );

  return res;
};
app.get("/stream/:movieId", async (req, res) => {
  const movieId = req.params.movieId;
  const range = req.headers.range;
  const videoResponse = await getVideoResponse(movieId);

  const videoID = videoResponse.data.result.videoId;

  console.log("videoID: ", videoID);
  if (!range) {
    return res.status(400).send("Requires Range header");
  }

  try {
    // Lấy thông tin về file từ Google Drive API
    const googleDriveURL = `https://www.googleapis.com/drive/v3/files/${videoID}?alt=media&key=AIzaSyACCAxVDycTZW5kg5MEe-EMmC0ZTyxMcok`;
    console.log("hello");
    // Gửi request đến Google Drive với range từ trình duyệt
    const response = await axios({
      method: "GET",
      url: googleDriveURL,
      responseType: "stream",
      headers: {
        "User-Agent": "Node.js Proxy Streaming",
        Accept: "video/mp4",
        Range: range, // Sử dụng range từ request của người dùng
      },
    });

    // Thiết lập headers từ response của Google Drive
    const contentRange = response.headers["content-range"];
    const contentLength = response.headers["content-length"];
    const contentType = response.headers["content-type"] || "video/mp4";

    // Trả về response với status 206 (Partial Content)
    res.status(206);
    res.setHeader("Accept-Ranges", "bytes");
    res.setHeader("Content-Length", contentLength);
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Range", contentRange);
    res.setHeader("Cache-Control", "public, max-age=3600");

    // Stream dữ liệu từ Google Drive đến client
    response.data.pipe(res);
  } catch (error) {
    console.error("Lỗi khi proxy video:", error.message);

    // Log chi tiết lỗi nếu có
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    }

    res.status(500).json({ error: "Không thể truy xuất video" });
  }
});

// Thêm route đơn giản để kiểm tra server có hoạt động không
app.get("/", (req, res) => {
  res.send("Video streaming server is running");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
// https
//   .createServer(
//     {
//       key: fs.readFileSync("cookies.com+2-key.pem"),
//       cert: fs.readFileSync("cookies.com+2.pem"),
//     },
//     app
//   )
//   .listen(port, () => {
//     console.log(`Demo App is running on port ${port}`);
//   });
