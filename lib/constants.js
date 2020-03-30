module.exports.example_constant = [
  { name: 'air_compressors', text: "Air Compressors / Pumps"}
];
module.exports.reports = [
  { name: 'consumer_pricing', text: 'The business raising prices unfairly when selling to the public' },
  { name: 'business_pricing', text: 'The business raising prices unfairly when selling to other businesses' },
  //  { name: 'market_advantage', text: 'A business taking advantage of its power in the market unfairly' },
  { name: 'misleading_claims', text: 'The business making misleading claims about its products or identity' },
  { name: 'cancellation', text: 'The business preventing cancellation of products or services' },
  { name: 'other', text: 'Other unfair behaviour' }
];

module.exports.questions = [
  { name: 'business-name', value: 'Business Name' },
  { name: 'contact-number', value: '01743 875656' },
  { name: 'street-name', value: '' },
  { name: 'town-name', value: 'emmerdale' },
  { name: 'county', value: '' },
  { name: 'postcode', value: 'm13 9pl' },

  { name: 'expiry-day', value: '28' },
  { name: 'expiry-month', value: '3' },
  { name: 'expiry-year', value: '2020' },

  { name: 'report_reason', value: 'misleading_claims' },
  { name: 'description', value: 'he behaviour you are reporting' },
  { name: 'report_other', value: '' },

  { name: 'with-conditional-items', value: 'pasta' },
  { name: 'pasta_product_type', value: '' },
  { name: 'pasta_product_brand', value: '' },
  { name: 'pasta_pack_size', value: '' },
  { name: 'pasta_current_price', value: '' },
  { name: 'pasta_expected_price', value: '' },
  { name: 'current_price', value: [ '', '' ] },
  { name: 'expected_price', value: [ '', '' ] },
  
  { name: 'contact-name', value: 'Name' },
  { name: 'contact-email', value: 'Email' },
  { name: 'contact-number', value: 'Telephone' }
];
