package main

import (
	"fmt"
	"log"
	"net/http"

	"golang-streaming-service/internal/stream"

	"github.com/gorilla/mux"
)

// CORSMiddleware xử lý Cross-Origin Resource Sharing cho tất cả các requests
func CORSMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Cho phép truy cập từ tất cả các origins
		w.Header().Set("Access-Control-Allow-Origin", "https://streaming-video-web.vercel.app, https://*.streaming-video-web.vercel.app")

		// Cho phép các phương thức
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")

		// Cho phép các header cụ thể
		w.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Range")

		// Cho phép client đọc các header nhất định từ response
		w.Header().Set("Access-Control-Expose-Headers", "Content-Length, Content-Range, Content-Type")

		// Nếu là preflight request, trả về 200 OK
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	r := mux.NewRouter()

	// Áp dụng middleware CORS cho tất cả các route
	r.Use(CORSMiddleware)

	// Route để stream video
	r.HandleFunc("/stream/{id}", func(w http.ResponseWriter, r *http.Request) {
		id := mux.Vars(r)["id"]
		log.Printf("Request received for /stream/%s", id)
		stream.StreamVideo(w, r)
	}).Methods("GET", "OPTIONS")

	// Route kiểm tra trạng thái server
	r.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Server is running"))
	}).Methods("GET")

	port := "3000"
	fmt.Printf("Streaming server running on port %s\n", port)
	log.Printf("Server is listening on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}