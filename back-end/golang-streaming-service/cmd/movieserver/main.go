package main

import (
	"fmt"
	"golang-streaming-service/internal/movie"
	"log"
	"net/http"
	// "github.com/itsbn0110/streaming_video_web/go-backend/internal/movie/handler"
)

func main() {
	http.HandleFunc("/api/golang/movies", movie.MovieHandler)

	fmt.Println("Movie service is running on port 8081...")
	log.Fatal(http.ListenAndServe(":8081", nil))
}
