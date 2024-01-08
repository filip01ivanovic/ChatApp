CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(30) NOT NULL UNIQUE,
    passhash VARCHAR NOT NULL
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  username VARCHAR(30) NOT NULL,
  text TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);