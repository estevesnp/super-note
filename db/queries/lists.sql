-- name: GetListById :one
SELECT * FROM lists
WHERE id = $1
LIMIT 1;

-- name: GetListsByUser :many
SELECT * FROM lists
WHERE user_id = $1;

-- name: CreateList :one
INSERT INTO lists
(user_id, name, description)
VALUES
($1, $2, $3)
RETURNING id, user_id, name, description;
