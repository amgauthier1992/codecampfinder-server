CREATE TABLE user_courses (
  course_id INTEGER REFERENCES courses(id),
  user_name TEXT NOT NULL REFERENCES users(user_name),
  PRIMARY KEY (course_id, user_name)
);

--user can have many courses
