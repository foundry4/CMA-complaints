create table cma_new(id serial PRIMARY KEY,
reference_number VARCHAR (200),
info JSON,
business_name VARCHAR (200),
street_name VARCHAR (200),
town_name VARCHAR (200),
county VARCHAR (200),
postcode VARCHAR (20),
website VARCHAR (200),
business_email VARCHAR (200),
pasta_product_description VARCHAR (200),
pasta_current_price VARCHAR (200),
pasta_expected_price VARCHAR (200),
pasta_pack_size VARCHAR (200),
pasta_product BOOLEAN DEFAULT FALSE,
long_life_milk_product_description VARCHAR (200),
long_life_milk_current_price VARCHAR (200),
long_life_milk_expected_price VARCHAR (200),
long_life_milk_pack_size VARCHAR (200),
long_life_milk_product BOOLEAN DEFAULT FALSE,
meat_product_description VARCHAR (200),
meat_current_price VARCHAR (200),
meat_expected_price VARCHAR (200),
meat_pack_size VARCHAR (200),
meat_product BOOLEAN DEFAULT FALSE,
halal_meat_product_description VARCHAR (200),
halal_meat_current_price VARCHAR (200),
halal_meat_expected_price VARCHAR (200),
halal_meat_pack_size VARCHAR (200),
halal_meat_product BOOLEAN DEFAULT FALSE,
eggs_product_description VARCHAR (200),
eggs_current_price VARCHAR (200),
eggs_expected_price VARCHAR (200),
eggs_pack_size VARCHAR (200),
eggs_product BOOLEAN DEFAULT FALSE,
flour_product_description VARCHAR (200),
flour_current_price VARCHAR (200),
flour_expected_price VARCHAR (200),
flour_pack_size VARCHAR (200),
flour_product BOOLEAN DEFAULT FALSE,
rice_product_description VARCHAR (200),
rice_current_price VARCHAR (200),
rice_expected_price VARCHAR (200),
rice_pack_size VARCHAR (200),
rice_product BOOLEAN DEFAULT FALSE,
fruit_veg_product_description VARCHAR (200),
fruit_veg_current_price VARCHAR (200),
fruit_veg_expected_price VARCHAR (200),
fruit_veg_pack_size VARCHAR (200),
fruit_veg_product BOOLEAN DEFAULT FALSE,
other_food_name VARCHAR (200),
other_food_product_description VARCHAR (200),
other_food_current_price VARCHAR (200),
other_food_expected_price VARCHAR (200),
other_food_pack_size VARCHAR (200),
other_food_product BOOLEAN DEFAULT FALSE,
baby_formula_product_description VARCHAR (200),
baby_formula_current_price VARCHAR (200),
baby_formula_expected_price VARCHAR (200),
baby_formula_pack_size VARCHAR (200),
baby_formula_product BOOLEAN DEFAULT FALSE,
hand_sanitizer_product_description VARCHAR (200),
hand_sanitizer_current_price VARCHAR (200),
hand_sanitizer_expected_price VARCHAR (200),
hand_sanitizer_pack_size VARCHAR (200),
hand_sanitizer_product BOOLEAN DEFAULT FALSE,
toilet_roll_product_description VARCHAR (200),
toilet_roll_current_price VARCHAR (200),
toilet_roll_expected_price VARCHAR (200),
toilet_roll_pack_size VARCHAR (200),
toilet_roll_product BOOLEAN DEFAULT FALSE,
other_hygiene_name VARCHAR (200),
other_hygiene_product_description VARCHAR (200),
other_hygiene_current_price VARCHAR (200),
other_hygiene_expected_price VARCHAR (200),
other_hygiene_pack_size VARCHAR (200),
other_hygiene_product BOOLEAN DEFAULT FALSE,
paracetamol_product_description VARCHAR (200),
paracetamol_current_price VARCHAR (200),
paracetamol_expected_price VARCHAR (200),
paracetamol_pack_size VARCHAR (200),
paracetamol_product BOOLEAN DEFAULT FALSE,
ibuprofen_product_description VARCHAR (200),
ibuprofen_current_price VARCHAR (200),
ibuprofen_expected_price VARCHAR (200),
ibuprofen_pack_size VARCHAR (200),
ibuprofen_product BOOLEAN DEFAULT FALSE,
antiseptic_product_description VARCHAR (200),
antiseptic_current_price VARCHAR (200),
antiseptic_expected_price VARCHAR (200),
antiseptic_pack_size VARCHAR (200),
antiseptic_product BOOLEAN DEFAULT FALSE,
other_medical_name VARCHAR (200),
other_medical_product_description VARCHAR (200),
other_medical_current_price VARCHAR (200),
other_medical_expected_price VARCHAR (200),
other_medical_pack_size VARCHAR (200),
other_medical_product BOOLEAN DEFAULT FALSE,
more_info BOOLEAN DEFAULT FALSE,
report_consumer_pricing BOOLEAN DEFAULT FALSE,
report_business_pricing BOOLEAN DEFAULT FALSE,
report_misleading_claims BOOLEAN DEFAULT FALSE,
report_cancellation BOOLEAN DEFAULT FALSE,
report_other VARCHAR (200),
evidence BOOLEAN DEFAULT FALSE,
contact_name VARCHAR (200),
contact_email VARCHAR (200),
contact_number VARCHAR (200),
description VARCHAR (1250),
date_day INTEGER,
date_month INTEGER,
date_year INTEGER,
is_online BOOLEAN DEFAULT FALSE,
created_at TIMESTAMP DEFAULT now());