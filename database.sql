--Table structure for the new table
CREATE TABLE cma_responses_234 (
    id serial PRIMARY KEY,
    reference_number VARCHAR (200),
    info JSON,
    report_consumer_pricing BOOLEAN DEFAULT FALSE,
    report_business_pricing BOOLEAN DEFAULT FALSE,
    report_market_advantage BOOLEAN DEFAULT FALSE,
    report_misleading_claims BOOLEAN DEFAULT FALSE,
    report_cancellation BOOLEAN DEFAULT FALSE,
    contact_name VARCHAR (200),
    contact_phone VARCHAR (200),
    contact_email VARCHAR (200),
    company_location VARCHAR (200),
    company_name VARCHAR (200),
    company_sector VARCHAR (200),
    company_sector_detail VARCHAR (200),
    product VARCHAR (200),
    description TEXT,
    company_postcode VARCHAR (200),
    created_at TIMESTAMP DEFAULT now()
);

--To restart the sequence from a specified number (useful when changing between databases) use the following command
SELECT setval('cma_responses_id_seq', 21, true);