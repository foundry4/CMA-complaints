--Table structure for the new table
CREATE TABLE {{TABLE_NAME}} (
    id serial PRIMARY KEY,
    reference_number VARCHAR (200),
    info JSON,
    contact_name VARCHAR (200),
    contact_phone VARCHAR (200),
    contact_email VARCHAR (200),
);
--Update to add created_at
ALTER TABLE {{TABLE_NAME}}
<<<<<<< HEAD
ADD company_location VARCHAR (200);
ALTER TABLE {{TABLE_NAME}}
ADD compay_name VARCHAR (200);
ALTER TABLE {{TABLE_NAME}}
ADD created_at TIMESTAMP DEFAULT now();
=======
ADD created_at TIMESTAMP DEFAULT now()
ADD company_sector VARCHAR (200)
ADD company_sector_detail VARCHAR (200)
>>>>>>> 5dfeff3c15302e1ba93569e8fcdb3b2cbd1882c6



ALTER TABLE {{TABLE_NAME}}
ADD company_name  VARCHAR (200);
--To restart the sequence from a specified number (useful when changing between databases) use the following command
SELECT setval('cma_responses_id_seq', 21, true);