CREATE TABLE responses (
    id serial PRIMARY KEY,
    Info JSON,
    contact_name VARCHAR (200),
    contact_phone VARCHAR (200),
    contact_email VARCHAR (200)
);