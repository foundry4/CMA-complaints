module.exports.example_constant = [
  { name: 'air_compressors', text: 'Air Compressors / Pumps'}
];

module.exports.reports = [
  { name: 'cancellation', text: 'Problems with the cancellation, refund or exchange of products or services' , url:'/' },
  { name: 'consumer_pricing', text: 'Unfair prices for products or services I’m buying for me and/or other people' , url:'/' },
  { name: 'business_pricing', text: 'Unfair prices for business-to-business sales' , url:'/' },
  { name: 'misleading_claims', text: 'A business making misleading claims about products or services' , url:'/' },
  { name: 'furlough_misuse', text: 'A business or person misusing the Coronavirus job retention (furlough) scheme' , url:'/' },
  { name: 'not_following_advice', text: 'A business or person not following government guidance or laws on coronavirus, putting people at risk' , url:'/' },
  { name: 'other', text: 'Other unfair behaviour' }
];

module.exports.business_section = {
  'medium': { name: 'medium', text: 'Business location' , url:'/where_was_behaviour' },
  'business-name':{ name: 'business-name', text: 'Business Name' , url:'/where_is_business' },
  'location': { name: 'location', text: 'Location' , url:'/where_is_business' },
  'date':{ name: 'date', text: 'Date' , url:'/when_behaviour' },
  'evidence':{ name: 'evidence', text: 'Do you have evidence?' , url:'/evidence' },
};

module.exports.business_reason = {
  'report_reason':{ name: 'report_reason', text: 'Reason' , url:'/what_behaviour' },
  'description':{ name: 'description', text: 'Description' , url:'/what_happened' },
};

module.exports.contact_section = {
  'more-info':{ name: 'more-info', text: 'May we contact you?' , url:'/more_information' },
  'contact-name':{ name: 'contact-name', text: 'Name' , url:'/contact_details' },
  'contact-email': { name: 'contact-email', text: 'Email' , url:'/contact_details' },
  'contact-number':{ name: 'contact-number', text: 'Telephone' , url:'/contact_details' },
};

module.exports.product_section = {
  product_name: { name: 'product_name', text: 'Product name' , url:'/' },
  product_description: { name: 'product_description', text: 'Product description' , url:'/' },
  current_price: { name: 'current_price', text: 'Current price' , url:'/' },
  expected_price:{ name: 'expected_price', text: 'Expected price' , url:'/' }
};

module.exports.food_products = [
  { name: 'halal_meat', text: 'Halal meat' },
  { name: 'eggs', text: 'Eggs' },
  { name: 'flour', text: 'Flour' },
  { name: 'rice', text: 'Rice' },
  { name: 'fruit_veg', text: 'Fruit or vegetables' },
];

module.exports.hygiene_products = [
  { name: 'hand_sanitizer', text: 'Hand sanitizer' },
  { name: 'toilet_roll', text: 'Toilet roll' },
  { name: 'mask', text: 'Face masks' },
  { name: 'ppe', text: 'Other personal protective equipment (PPE)' },
];

module.exports.medical_products = [
  { name: 'paracetamol', text: 'Paracetamol' },
]

module.exports.other_products = [
  { name: 'other_food', text: 'Other food product' },
  { name: 'other_medical', text: 'Other medical product' },
  { name: 'other_hygiene', text: 'Other hygiene product' }
]