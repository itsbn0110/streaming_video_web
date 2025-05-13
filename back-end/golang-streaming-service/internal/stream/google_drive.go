package stream

import (
	"encoding/json"
	"fmt"
	"net/http"
)

const springBootAPI = "http://localhost:8082/api/movies/golang/%s"

func getVideoID(movieID string) (string, error) {
	url := fmt.Sprintf(springBootAPI, movieID)
	resp, err := http.Get(url)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	// Parse JSON response to extract videoId
	var response struct {
		Code   int    `json:"code"`
		Result struct {
			VideoID string `json:"videoId"`
		} `json:"result"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		return "", err
	}
	
	return response.Result.VideoID, nil
}
