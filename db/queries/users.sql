-- name: GetAllUsers :many
SELECT id, username, created_at FROM users;

-- name: GetUserById :one
SELECT id, username, created_at FROM users
WHERE id = $1
LIMIT 1;

-- name: GetUserByUsername :one
SELECT id, username, password, created_at FROM users
WHERE username = $1
LIMIT 1;

-- name: GetUserByCreds :one
SELECT id, username, created_at FROM users
WHERE username = $1
AND password = $2
LIMIT 1;

-- name: CreateUser :one
INSERT INTO users
(username, password)
VALUES
($1, $2)
RETURNING id, username, created_at;
