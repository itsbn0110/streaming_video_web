package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"golang-streaming-service/internal/stream"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func CORSMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				fmt.Println("CORS middleware triggered for", r.Method, r.URL.Path)
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Range, Origin, X-Requested-With, Content-Type, Accept")
        w.Header().Set("Access-Control-Expose-Headers", "Content-Length, Content-Range, Content-Type, Accept-Ranges")

        if r.Method == http.MethodOptions {
            w.WriteHeader(http.StatusOK)
            return
        }
        next.ServeHTTP(w, r)
    })
}

func LoggingMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        log.Printf("Started %s %s from %s", r.Method, r.URL.Path, r.RemoteAddr)
        next.ServeHTTP(w, r)
        duration := time.Since(start)
        log.Printf("Completed %s %s in %v", r.Method, r.URL.Path, duration)
    })
}

func main() {
    err := godotenv.Load("../../.env")
		if err != nil {
			fmt.Println("Warning: Could not load .env file from root directory")
		}

    r := mux.NewRouter()
    r.Use(CORSMiddleware)
    r.Use(LoggingMiddleware)

    r.HandleFunc("/stream/{id}", stream.StreamVideo).Methods("GET", "HEAD", "OPTIONS")
    r.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusOK)
        w.Write([]byte(`{"status":"ok","message":"Server is running"}`))
    }).Methods("GET")

    port := os.Getenv("PORT")
    if port == "" {
        port = "3000"
    }

    fmt.Printf("Streaming server running on port %s\n", port)
    log.Fatal(http.ListenAndServe(":"+port, r))
}
