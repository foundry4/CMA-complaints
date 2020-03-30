CREATE TABLE cma_responses_new (
--default info
    id serial PRIMARY KEY,
    reference_number VARCHAR (200),
    info JSON,
--    Q1
    report_consumer_pricing BOOLEAN DEFAULT FALSE,
    report_business_pricing BOOLEAN DEFAULT FALSE,
    report_market_advantage BOOLEAN DEFAULT FALSE,
    report_misleading_claims BOOLEAN DEFAULT FALSE,
    report_cancellation BOOLEAN DEFAULT FALSE,
    report_other VARCHAR (200),
--    Q2
    locaation_online BOOLEAN DEFAULT FALSE,
    location_england BOOLEAN DEFAULT FALSE,
    location_northern_ireland BOOLEAN DEFAULT FALSE,
    location_scotland BOOLEAN DEFAULT FALSE,
    location_wales BOOLEAN DEFAULT FALSE,
--    Q3
    company_name VARCHAR (200),
--    Q4
    company_postcode VARCHAR (20),
--    Q5
    company_address VARCHAR (200),
--    Q6
    company_url VARCHAR (200),
--    Q7
    company_email VARCHAR (200),
--    Q8 (example with pasta)
    pasta_product_type VARCHAR (50),
    pasta_product_brand VARCHAR (50),
    pasta_pack_size INT,
    pasta_current_price INT,
    pasta_expected_price INT,
--    Q8 (example for other food item)
    other_food_name VARCHAR (50),
    other_food_product_type VARCHAR (50),
    other_food_product_brand VARCHAR (50),
    other_food_pack_size INT,
    other_food_current_price INT,
    other_food_expected_price INT,
--    Q9
    description TEXT,
--    Q10
    evidence BOOLEAN DEFAULT FALSE,
    contact_email  VARCHAR (200),
    contact_number  VARCHAR (200),
    contact_name  VARCHAR (200),
    created_at TIMESTAMP DEFAULT now()
);
