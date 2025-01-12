UPDATE lists
SET description = ''
WHERE description IS NULL;

UPDATE tasks
SET description = ''
WHERE description IS NULL;

ALTER TABLE lists
ALTER COLUMN description SET NOT NULL;

ALTER TABLE tasks
ALTER COLUMN description SET NOT NULL;
