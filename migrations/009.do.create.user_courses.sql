CREATE TABLE user_courses (
  course_id INTEGER,
  user_name TEXT NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (user_name) REFERENCES users(user_name),
  PRIMARY KEY (course_id, user_name)
)

--user can have many courses
