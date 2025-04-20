package main

import (
	"fmt"
	"log"
	"net/http"

	"golang-streaming-service/internal/stream"

	"github.com/gorilla/mux"
)

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/stream/{id}", func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Request received for /stream/{id}")
		stream.StreamVideo(w, r)
	}).Methods("GET")

	port := "3000"
	fmt.Println("Streaming server running on port " + port)
	log.Printf("Server is listening on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}
