DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id SERIAL not null,
  name varchar(255),
  email text not null,
  password text not null,
  salt text not null
);