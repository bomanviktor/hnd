package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"hnd/database"
	"log"
	"net/http"
	"regexp"
	"runtime/debug"
	"strings"
)

type Handlers struct {
	DB *database.DB
}

func New(db *sql.DB) *Handlers {
	return &Handlers{DB: database.NewDB(db)}
}

func (h *Handlers) Handler() http.Handler {

	var routes = []Route{
		// Main menu routes
		route("GET", "/api/main-menu", h.mainMenu),
		route("POST", "/api/main-menu/new-game", h.newGame),
		route("POST", "/api/main-menu/load-game", h.loadGame),
		route("POST", "/api/main-menu/game-settings", h.gameSettings),
	}

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if err := recover(); err != nil {
				log.Printf("ERROR %d. %v\n%s", http.StatusInternalServerError, err, debug.Stack())
				errorResponse(w, http.StatusInternalServerError) // 500 ERROR
			}
		}()

		// remove trailing slash
		r.URL.Path = strings.TrimSuffix(r.URL.Path, "/")

		for _, route := range routes {
			if route.Pattern.MatchString(r.URL.Path) {
				route.Handler(w, r)
			}
		}

		errorResponse(w, http.StatusNotFound)
	})

}

// ErrorResponse responses with specified error code in format "404 Not Found"
func errorResponse(w http.ResponseWriter, code int) {
	http.Error(w, fmt.Sprintf("%v %v", code, http.StatusText(code)), code)
}

// SendObject sends object to http.ResponseWriter
//
// panics if error occurs
func SendObject(w http.ResponseWriter, object any) {
	w.Header().Set("Content-Type", "application/json")
	objJson, err := json.Marshal(object)
	if err != nil {
		log.Panic(err)
		return
	}
	_, err = w.Write(objJson)
	if err != nil {
		log.Panic(err)
		return
	}
}

type Route struct {
	Method  string
	Pattern *regexp.Regexp
	Handler http.HandlerFunc
}

func route(method, pattern string, handler http.HandlerFunc) Route {
	return Route{method, regexp.MustCompile("^" + pattern + "$"), handler}
}
