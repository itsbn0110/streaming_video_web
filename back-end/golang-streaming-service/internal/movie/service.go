package movie

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
)

type Movie struct {
	ID          int   `json:"id"`
	Title       string   `json:"title"`
	CategoryIDs []int    `json:"categoryIds"`
	ReleaseYear int      `json:"releaseYear"`
}

func getMoviesFromSpringBoot(title string, categoryIDs []int, fromYear, toYear int) ([]Movie, error) {
	apiURL := "http://localhost:8082/api/movies/filter"
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