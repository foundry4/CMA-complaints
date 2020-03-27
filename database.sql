CREATE TABLE cma_responses (
    id serial PRIMARY KEY,
    reference_number VARCHAR (200),
    info JSON,
    contact_name VARCHAR (200),
    contact_phone VARCHAR (200),
    contact_email VARCHAR (200),
);

--To restart the sequence from a specified number (useful when changing between databases) use the following command
SELECT setval('cma_responses_id_seq', 21, true);