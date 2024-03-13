CREATE database movie_recommendation;
CREATE database test_movie_recommendation;

CREATE table userss(
  id serial PRIMARY key not null,
  username VARCHAR(255) not null,
  password VARCHAR(255) not null,
  gender varchar(255) not null,
  birthday DATE not NULL
);

DROP table users;
