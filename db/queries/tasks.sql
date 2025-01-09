-- name: GetTaskById :one
SELECT * FROM tasks
WHERE id = $1
LIMIT 1;

-- name: GetTasksByList :many
SELECT * FROM tasks
WHERE list_id = $1;

-- name: GetTasksByUser :many
SELECT t.*
FROM tasks t
INNER JOIN lists l ON t.list_id = l.id
INNER JOIN users u ON l.user_id = u.id;
