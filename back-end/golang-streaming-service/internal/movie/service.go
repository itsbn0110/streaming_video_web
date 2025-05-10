package movie

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"
)

type Movie struct {
	ID          int   `json:"id"`
	Title       string   `json:"title"`
	CategoryIDs []int    `json:"categoryIds"`
	ReleaseYear int      `json:"releaseYear"`
}

func getMoviesFromSpringBoot(title string, categoryIDs []int, fromYear, toYear int) ([]Movie, error) {
	apiBase := os.Getenv("SPRING_BOOT_API_URL")
	if apiBase == "" {
		apiBase = "http://spring-boot-service:8082/api" // fallback
	}
	apiURL := apiBase + "/movies/filter"
	params := url.Values{}
	if title != "" {
		params.Add("title", title)
	}
	for _, id := range categoryIDs {
		params.Add("categoryIds", fmt.Sprintf("%d", id))
	}
	if fromYear > 0 {
		params.Add("fromYear", fmt.Sprintf("%d", fromYear))
	}
	if toYear > 0 {
		params.Add("toYear", fmt.Sprintf("%d", toYear))
	}

	resp, err := http.Get(apiURL + "?" + params.Encode())
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var movies []Movie
	err = json.NewDecoder(resp.Body).Decode(&movies)
	return movies, err
}