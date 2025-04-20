package movie

import (
	"encoding/json"
	"net/http"
)

func MovieHandler(w http.ResponseWriter, r *http.Request) {
	title := r.URL.Query().Get("title")
	fromYear := 2015
	toYear := 2023
	categoryIDs := []int{1, 2}

	movies, err := getMoviesFromSpringBoot(title, categoryIDs, fromYear, toYear)
	if err != nil {
		http.Error(w, "Failed to fetch movies", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(movies)
}