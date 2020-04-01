module.exports.example_constant = [
  { name: 'air_compressors', text: 'Air Compressors / Pumps'}
];
module.exports.reports = [
  { name: 'consumer_pricing', text: 'Unfair prices for products or services I’m buying for me and/or other people' , url:'/' },
  { name: 'business_pricing', text: 'Unfair prices for business-to-business sales' , url:'/' },
  //  { name: 'market_advantage', text: 'A business taking advantage of its power in the market unfairly' , url:'/' },
  { name: 'misleading_claims', text: 'A business making misleading claims about products or services' , url:'/' },
  { name: 'cancellation', text: 'Problems with the cancellation, refund or exchange of products or services' , url:'/' },
  { name: 'other', text: 'Other unfair behaviour' }
];

module.exports.business_section = {
  'business-name':{ name: 'business-name', text: 'Business Name' , url:'/where_is_business' },
 
  'is-online': { name: 'is-online', text: 'Was online?' , url:'/where_was_behaviour' },
  'location': { name: 'location', text: 'Location' , url:'/where_is_business' },
/*   'street-name': { name: 'street-name', text: 'Street' , url:'/where_is_business' },
  'town-name':{ name: 'town-name', text: 'Town' , url:'/where_is_business' },
  'county': { name: 'county', text: 'County' , url:'/where_is_business' },
  'postcode':{ name: 'postcode', text: 'Postcode' , url:'/where_is_business' }, */
};

module.exports.business_reason = {
  'report_reason':{ name: 'report_reason', text: 'Reason' , url:'/what_behaviour' },
  'description':{ name: 'description', text: 'Description' , url:'/what_happened' },
  'date':{ name: 'date', text: 'Date' , url:'/when_behaviour' },
  'evidence':{ name: 'evidence', text: 'Do you have evidence?' , url:'#' },
};

module.exports.contact_section = {
  'contact-name':{ name: 'contact-name', text: 'Name' , url:'/contact_details' },
  'contact-email': { name: 'contact-email', text: 'Email' , url:'/contact_details' },
  'contact-number':{ name: 'contact-number', text: 'Telephone' , url:'/contact_details' },
  'more-info':{ name: 'more-info', text: 'May we contact you?' , url:'/more-information' },
};

module.exports.product_section = {  
  product_description: { name: 'product_description', text: 'Product description' , url:'/' },
  current_price: { name: 'current_price', text: 'Current price' , url:'/' },
  expected_price:{ name: 'expected_price', text: 'Expected price' , url:'/' },
  pack_size:{ name: 'pack_size', text: 'Pack size' , url:'/' }
};

module.exports.food_products = [
  { name: 'long_life_milk', text: 'Long life milk' },
  { name: 'pasta', text: 'Pasta' },
  { name: 'meat', text: 'Meat' },
  { name: 'halal_meat', text: 'Halal meat' },
  { name: 'eggs', text: 'Eggs' },
  { name: 'flour', text: 'Flour' },
  { name: 'rice', text: 'Rice' },
  { name: 'fruit_veg', text: 'Fruit or vegetables' },
  { name: 'baby_formula', text: 'Baby formula' }

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
