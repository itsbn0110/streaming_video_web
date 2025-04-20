package stream

import (
	"fmt"
	"io"
	"net/http"

	"github.com/gorilla/mux"
)

const googleDriveAPIKey = "AIzaSyAQINhuGU9lFotdZBKLbV0F8jHuy8JGsGc"

func StreamVideo(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	movieID := vars["id"]
	fmt.Println("Movie ID -----------------------------:", movieID)

	videoID, err := getVideoID(movieID)
	if err != nil {
		http.Error(w, "Không thể lấy videoId", http.StatusInternalServerError)
		return
	}


	fmt.Println("Video ID -----------------------------:", videoID)
	if err != nil {
		http.Error(w, "Không thể lấy videoId", http.StatusInternalServerError)
		return
	}

	googleDriveURL := fmt.Sprintf("https://www.googleapis.com/drive/v3/files/%s?alt=media&key=%s", videoID, googleDriveAPIKey)

	rangeHeader := r.Header.Get("Range")
	if rangeHeader == "" {
		http.Error(w, "Requires Range header", http.StatusBadRequest)
		return
	}

	req, err := http.NewRequest("GET", googleDriveURL, nil)
	if err != nil {
		http.Error(w, "Lỗi tạo request", http.StatusInternalServerError)
		return
	}

	req.Header.Set("Range", rangeHeader)
	req.Header.Set("User-Agent", "Golang Proxy Streaming")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		http.Error(w, "Lỗi khi truy cập Google Drive", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	for key, values := range resp.Header {
		for _, value := range values {
			w.Header().Add(key, value)
		}
	}

	w.WriteHeader(resp.StatusCode)
	io.Copy(w, resp.Body)
}
