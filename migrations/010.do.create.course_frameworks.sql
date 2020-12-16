CREATE TABLE course_frameworks (
  course_id INTEGER INTEGER REFERENCES bootcamp_courses(id),
  framework_id INTEGER INTEGER REFERENCES frameworks(id),
  PRIMARY KEY (course_id, framework_id)
);