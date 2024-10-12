-- init.sql
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS type (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL CHECK (name IN ('Cardio', 'Strength', 'Calisthenics'))
);

CREATE TABLE IF NOT EXISTS workout (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    date DATE DEFAULT CURRENT_DATE,
    category_id INTEGER,
    type_id INTEGER,
    user_id INTEGER,
    sets TEXT,
    reps TEXT,
    weight TEXT,
    rpe TEXT,
    distance REAL,
    calories REAL,
    speed REAL,
    time REAL,
    hold_time REAL,
    FOREIGN KEY (category_id) REFERENCES category(id),
    FOREIGN KEY (type_id) REFERENCES type(id),
    FOREIGN KEY (user_id) REFERENCES "user"(id)
);

INSERT INTO user (username, password) VALUES ('test', 'test') ON CONFLICT (username) DO NOTHING;
INSERT INTO category (name) VALUES ('Pull'), ('Push'), ('Legs') ON CONFLICT (name) DO NOTHING;
INSERT INTO type (name) VALUES ('Cardio'), ('Strength'), ('Calisthenics') ON CONFLICT (name) DO NOTHING;
