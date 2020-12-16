CREATE TABLE course_languages (
  course_id INTEGER REFERENCES bootcamp_courses(id),
  language_id INTEGER REFERENCES languages(id),
  PRIMARY KEY (course_id, language_id)
);