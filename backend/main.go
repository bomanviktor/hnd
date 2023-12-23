package main

import (
	"database/sql"
	"log"
	"net"
	"net/http"
	"time"

	"hnd/handlers"
)

func main() {

	port := "8080"
	dbFile := "database.db"

	listen, err := net.Listen("tcp", ":"+port)
	if err != nil {
		log.Fatal(err)
	}
	log.Printf("Server started on http://localhost:%v\n", port)

	// TODO: add database protection
	db, err := sql.Open("sqlite3", dbFile+"?_foreign_keys=true") // enable foreign keys
	if err != nil {
		log.Fatal(err)
	}

	h := handlers.New(db)

	httpServer := http.Server{
		Handler:           h.Handler(),
		ReadHeaderTimeout: 3 * time.Second,
	}

	err = httpServer.Serve(listen)
	if err != nil {
		log.Fatal(err)
	}
}
