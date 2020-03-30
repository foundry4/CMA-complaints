module.exports.example_constant = [
  { name: 'air_compressors', text: 'Air Compressors / Pumps'}
];
module.exports.reports = [
  { name: 'consumer_pricing', text: 'The business raising prices unfairly when selling to the public' , url:'/' },
  { name: 'business_pricing', text: 'The business raising prices unfairly when selling to other businesses' , url:'/' },
  //  { name: 'market_advantage', text: 'A business taking advantage of its power in the market unfairly' , url:'/' },
  { name: 'misleading_claims', text: 'The business making misleading claims about its products or identity' , url:'/' },
  { name: 'cancellation', text: 'The business preventing cancellation of products or services' , url:'/' },
  { name: 'other', text: 'Other unfair behaviour' }
];

module.exports.questions = {
  'business-name':{ name: 'business-name', text: 'Business Name' , url:'/where_is_business' },
 
  'street-name': { name: 'street-name', text: 'Street' , url:'/where_is_business' },
  'town-name':{ name: 'town-name', text: 'Town' , url:'/where_is_business' },
  'county': { name: 'county', text: 'County' , url:'/where_is_business' },
  'postcode':{ name: 'postcode', text: 'Postcode' , url:'/where_is_business' },

  'contact-name':{ name: 'contact-name', text: 'Name' , url:'/contact_details' },
  'contact-email': { name: 'contact-email', text: 'Email' , url:'/contact_details' },
  'contact-number':{ name: 'contact-number', text: 'Telephone' , url:'/contact_details' },
  
  'expiry-day':{ name: 'expiry-day', text: 'Day' , url:'/when_behaviour' },
  'expiry-month':{ name: 'expiry-month', text: 'Month' , url:'/when_behaviour' },
  'expiry-year':{ name: 'expiry-year', text: 'Year' , url:'/when_behaviour' },

  'report_reason':{ name: 'report_reason', text: 'Reason' , url:'/what_behaviour' },
  'report_other':{ name: 'report_other', text: 'Other reason' , url:'/what_behaviour' },
  'description':{ name: 'description', text: 'Description' , url:'/what_happened' },
/* 
  { name: 'with-conditional-items', text: 'Pasta' , url:'/' },
  { name: 'pasta_product_type', text: 'Type' , url:'/' },
  { name: 'pasta_product_brand', text: 'Brand' , url:'/' },
  { name: 'pasta_pack_size', text: 'Pack size' , url:'/' },
  { name: 'pasta_current_price', text: 'Current price' , url:'/' },
  { name: 'pasta_expected_price', text: 'Expected price' , url:'/' },
  { name: 'current_price', text: 'Current price' , url:'/' },
  { name: 'expected_price', text: 'Expected price' , url:'/' }
   */
};
module.exports.food_products = [
  { name: 'long_life_milk', text: 'Long life milk' },
  { name: 'pasta', text: 'Pasta' },
  { name: 'meat', text: 'Meat' },
];

module.exports.hygiene_products = [
  { name: 'hand_sanitizer', text: 'Hand sanitizer' },
  { name: 'toilet_roll', text: 'Toilet roll' },
];

module.exports.medical_products = [
  { name: 'paracetamol', text: 'Paracetamol' },
  { name: 'ibuprofen', text: 'Ibuprofen' },
  { name: 'antiseptic', text: 'Antiseptic' }
]
