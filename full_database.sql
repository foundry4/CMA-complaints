--Table structure for the new table
CREATE TABLE cma_responses (
    id serial PRIMARY KEY,
    reference_number VARCHAR (200),
    info JSON
);
--Update to add created_at
ALTER TABLE cma_responses
ADD COLUMN company_location VARCHAR (200),
ADD COLUMN company_name VARCHAR (200),
ADD COLUMN company_sector VARCHAR (200),
ADD COLUMN company_sector_detail VARCHAR (200),
ADD COLUMN report_consumer_pricing BOOLEAN DEFAULT FALSE,
ADD COLUMN report_business_pricing BOOLEAN DEFAULT FALSE,
ADD COLUMN report_market_advantage BOOLEAN DEFAULT FALSE,
ADD COLUMN report_misleading_claims BOOLEAN DEFAULT FALSE,
ADD COLUMN report_cancellation BOOLEAN DEFAULT FALSE,
ADD COLUMN report_other VARCHAR (200),
ADD COLUMN description TEXT,
ADD COLUMN product VARCHAR (200),
ADD COLUMN company_address VARCHAR (200),
ADD COLUMN company_postcode VARCHAR (200),
ADD COLUMN evidence VARCHAR (200),
ADD COLUMN contact_name VARCHAR (200),
ADD COLUMN contact_number VARCHAR (200),
ADD COLUMN contact_email VARCHAR (200),
ADD created_at TIMESTAMP DEFAULT now();

--To restart the sequence from a specified number (useful when changing between databases) use the following command
SELECT setval('cma_responses_id_seq', 21, true);