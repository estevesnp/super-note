-- name: GetListById :one
SELECT id, name, description FROM lists
WHERE id = $1
LIMIT 1;

-- name: GetListsByUser :many
SELECT id, name, description FROM lists
WHERE user_id = $1;

-- name: CreateList :one
INSERT INTO lists
(user_id, name, description)
VALUES
($1, $2, $3)
RETURNING id, name, description;
