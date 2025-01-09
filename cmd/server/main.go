package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"super-note/internal/repository"

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
		log.Fatalf("failed to connect to db: %v", err)
	}
	defer conn.Close(ctx)

	repo := repository.New(conn)

	users, err := repo.GetAllUsers(ctx)
	if err != nil {
		log.Fatalf("failed to fetch users: %v", err)
	}

	for _, user := range users {
		fmt.Printf("id: %s; username: %s; created_at: %s\n", user.ID, user.Username, user.CreatedAt)
	}
}
