-- create database pern_oauth_google;
-- \c pern_oauth_google
create table users(
  user_id serial primary key,
  google_id varchar(255),
  user_name varchar(255),
  thumbnail varchar(255)
);