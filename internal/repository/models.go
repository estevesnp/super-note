// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0

package repository

import (
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
)

type List struct {
	ID          uuid.UUID
	UserID      uuid.UUID
	Name        string
	Description pgtype.Text
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

type Task struct {
	ID          uuid.UUID
	ListID      uuid.UUID
	Name        string
	Description pgtype.Text
	Completed   bool
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

type User struct {
	ID        uuid.UUID
	Username  string
	Password  string
	CreatedAt time.Time
}
