ALTER TABLE lists
ALTER COLUMN description DROP NOT NULL;

ALTER TABLE task
ALTER COLUMN description DROP NOT NULL;