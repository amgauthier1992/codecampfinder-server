CREATE TABLE bootcamps (
  bootcamp_id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  name TEXT NOT NULL,
  course TEXT NOT NULL,
  type TEXT NOT NULL,
  cost INTEGER NOT NULL,
  
)
