CREATE TABLE passport_responses (
    id serial PRIMARY KEY,
    Info JSON,
    passport_number VARCHAR (200),
    passport_expiry_date DATE,
    created_at TIMESTAMP DEFAULT now()
);