CREATE TABLE bootcamps (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  -- bootcamp_location INTEGER,
  --   FOREIGN KEY (bootcamp_location) REFERENCES 
);


