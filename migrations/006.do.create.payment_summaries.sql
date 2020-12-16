CREATE TABLE payment_summaries (
  id PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  course_id INTEGER REFERENCES bootcamp_courses(id),
  monthly SMALLMONEY,
  up_front SMALLMONEY,
  interest_only_loan TEXT,
  immediate_repayment_loan TEXT,
  isa TEXT, --income sharing agreement "do they offer an ISA, yes/no (T/F)"
);

--a course can have many payment options - One-to-many. 