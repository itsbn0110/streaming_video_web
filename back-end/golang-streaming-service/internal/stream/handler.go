package stream

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
)


func StreamVideo(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    movieID := vars["id"]

    videoID, err := getVideoID(movieID)
    if err != nil {
        http.Error(w, fmt.Sprintf("Failed to get video ID: %v", err), http.StatusInternalServerError)
        return
    }

    apiKey := os.Getenv("GOOGLE_DRIVE_API_KEY")
    if apiKey == "" {
        http.Error(w, "Missing Google Drive API key", http.StatusInternalServerError)
        return
    }

    googleURL := fmt.Sprintf("https://www.googleapis.com/drive/v3/files/%s?alt=media&key=%s", videoID, apiKey)

    req, err := http.NewRequest("GET", googleURL, nil)
    if err != nil {
        http.Error(w, "Failed to create request to Google Drive", http.StatusInternalServerError)
        return
    }

    // Forward Range header
    rangeHeader := r.Header.Get("Range")
    if rangeHeader != "" {
        req.Header.Set("Range", rangeHeader)
    }

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        http.Error(w, "Failed to fetch video from Google Drive", http.StatusBadGateway)
        return
    }
    defer resp.Body.Close()

    // Debug log
    log.Printf("Google Drive responded with status: %s", resp.Status)
    log.Printf("Request Range: %s", rangeHeader)

    // Kiểm tra nếu trình duyệt yêu cầu Range mà Google không trả về 206
    if rangeHeader != "" && resp.StatusCode != http.StatusPartialContent {
        http.Error(w, "Google Drive không hỗ trợ Range", http.StatusBadGateway)
        return
    }

    // CORS headers
    w.Header().Set("Access-Control-Allow-Origin", "*")
    w.Header().Set("Access-Control-Expose-Headers", "Content-Length, Content-Range, Content-Type, Accept-Ranges")

    // Copy headers
    if ct := resp.Header.Get("Content-Type"); ct != "" {
        w.Header().Set("Content-Type", ct)
    } else {
        w.Header().Set("Content-Type", "video/mp4")
    }

    if cr := resp.Header.Get("Content-Range"); cr != "" {
        w.Header().Set("Content-Range", cr)
    }

    if cl := resp.Header.Get("Content-Length"); cl != "" {
        w.Header().Set("Content-Length", cl)
    }

    w.Header().Set("Accept-Ranges", "bytes")

    // Set status code
    w.WriteHeader(resp.StatusCode)

    // Stream to client
    _, err = io.Copy(w, resp.Body)
    if err != nil {
        log.Printf("Failed to stream video: %v", err)
    }
}
