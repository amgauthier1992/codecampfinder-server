CREATE TABLE course_languages (
  course_id INTEGER INTEGER REFERENCES bootcamp_courses(id),
  language_id INTEGER INTEGER REFERENCES languages(id),
  PRIMARY KEY (course_id, language_id)
);