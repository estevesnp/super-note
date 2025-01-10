package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"super-note/internal/api"

	"github.com/jackc/pgx/v5"
	_ "github.com/joho/godotenv/autoload"
)

func main() {
	ctx := context.Background()

	connStr := fmt.Sprintf(
		"postgres://%s:%s@%s:%s/%s",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_NAME"),
	)

	conn, err := pgx.Connect(ctx, connStr)
	if err != nil {
		log.Fatalf("error connecting to db: %v", err)
	}
	defer conn.Close(ctx)

	serverAddr := fmt.Sprintf("%s:%s", os.Getenv("SERVER_HOST"), os.Getenv("SERVER_PORT"))
	server := api.New(ctx, conn, api.Config{
		Addr:      serverAddr,
		SecretKey: os.Getenv("SERVER_SECRET"),
	})

	if err := server.Listen(); err != nil {
		log.Fatalf("error starting server: %v", err)
	}
}
