package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/golang-jwt/jwt"
	"io"
	"net/http"
)

type token_to_validate struct {
	Token string `json:"token"` //Maybe add sth later
}

var key []byte = nil

func validate_signature(token *jwt.Token) (interface{}, error) {
	_, ok := token.Method.(*jwt.SigningMethodHMAC)
	if !ok || key == nil {
		fmt.Println(key)
		return "Unauthorized", nil
	}
	return key, nil
}

func validate_token(token string) (string, error) {
	t, err := jwt.Parse(token, validate_signature)
	if !t.Valid {
		return "", err
	}
	for claim, value := range t.Claims.(jwt.MapClaims) {
		if claim == "user" {
			return value.(string), nil
		}
	}
	return "", errors.New("user field not found")
}

func validator_handler(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var token token_to_validate
	err := decoder.Decode(&token)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_, _ = w.Write([]byte("JSON format is invalid" + err.Error()))
		return
	}
	username, err := validate_token(token.Token)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		_, _ = w.Write([]byte("Token invalid" + err.Error()))
		return
	}
	w.WriteHeader(http.StatusOK)
	_, err = w.Write([]byte(username))
	if err != nil {
		return
	}
}

func main() {
	http.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})
	http.HandleFunc("/validate_token", validator_handler)
	resp, err := http.Get("http://localhost:5167/politechnika/external_key")
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	key, err = io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	err = http.ListenAndServe(":8080", nil)
	if err != nil {
		print(err.Error())
		return
	}
}
