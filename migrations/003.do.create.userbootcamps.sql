CREATE TABLE user_bootcamps (
  bootcamp_id INTEGER,
  username TEXT NOT NULL,
    FOREIGN KEY (bootcamp_id) REFERENCES bootcamps(bootcamp_id),
    FOREIGN KEY (username) REFERENCES users(username),
  PRIMARY KEY (bootcamp_id, username)
)