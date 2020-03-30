const {food_products,hygiene_products,medical_products} = require('../lib/constants');
const products = [...food_products,...hygiene_products,...medical_products];

const  addToEntries= (object, data,category)=>{
  if (data[category] && data[category] != undefined) {
    let len = data[category].length;
    for (var i = 0; i < len; i++) {
      if(category !=='report_reason') {
        var name = data[category][i] + "_" + category;
        object[name] = true;
      }
      else {
        var name = 'report_'+data['report_reason'][i];
        object[name] = true;
      }
    }
  }
  else {
    console.log('no data')
  }
  return object;
}

const processHiddenTables = (sql_values,data,constants,property) =>{
  console.log('processing,', sql_values,data,constants,property);
  for (index in constants){
    console.log('checking in constants',constants);
    console.log('looking for ',constants[index].name+property,data[constants[index].name+property])
    if (data[constants[index].name+property]?data[constants[index].name+property].trim() !=='':false) {
      console.log(constants[index].name, ' is lonely');
      sql_values[constants[index].name + property] = data[constants[index].name + property];
    }
  }
  return sql_values;
}

const processCategory = (sql_values, data, constants) =>{

  sql_values = processHiddenTables(sql_values,data,constants,'_expected_price');
  sql_values = processHiddenTables(sql_values,data,constants,'_current_price');
  sql_values = processHiddenTables(sql_values,data,constants,'_pack_size');
  sql_values = processHiddenTables(sql_values,data,constants,'_product_description');
  return sql_values;
}
module.exports = (data)=>{
  try {
    // pullout specific BASIC vars
    var description = data['description'] || "";
    const evidence = (data['evidence'] == 'true');
    var contact_name = data['contact-name'] || "";
    var contact_number = data['contact-number'] || "";
    var contact_email = data['contact-email'] || "";
    var more_info = data['more-info'] || "";


    // test checkbox results to ensure they are arrays
    // no results : undefined; single result: string; multiple results: array
    // catch single items and turn into array
    var boxList = ["report_reason","product"];

    for (var i = 0; i < boxList.length; i++) {
      console.log('iteration ...',i)
      var typeName = boxList[i];
      if (data[typeName] && !Array.isArray(data[typeName])) {
        data[typeName] = [data[typeName]];
      }
    }
    // Add products from Q8 into the list
    let categories = {};
    categories = addToEntries(categories,data,'product');

    console.log('my categories = ,',categories);

    // Q1
    // var reports = {};

    categories = addToEntries(categories,data,'report_reason');
    console.log('my new categories = ,',categories);

    // console.log("reports", reports)
    // test input
    var report_other = data['report_other'] || "";



    var json = JSON.stringify(data);

    var sql_values = {
      "info": json,
      "report_other": report_other,
      "description": description,
      "evidence":evidence,
      "more_info":more_info,
      "contact_name":contact_name,
      "contact_number":contact_number,
      "contact_email":contact_email
    }



    // Add in fields from reports
    var report_keys = Object.keys(categories)
    console.log("keys", report_keys);

    for (var i = 0; i < report_keys.length; i++) {
      key = report_keys[i]
      console.log(key);
      if(key!='report_other'){
        sql_values[key] = categories[key]
      }
    }
    sql_values = processCategory(sql_values, data, products);

    // Quick check
    console.log("SQL values", sql_values)

    // Build arrays of entries for the SQL query
    var fieldNames = [];
    var valuePositions = [];
    var values = [];
    var sql_keys = Object.keys(sql_values)
    for (var i = 0; i < sql_keys.length; i++) {
      key = sql_keys[i]
      fieldNames.push(key)
      valuePositions.push("$" + (i + 1))
      values.push(sql_values[key])
    }

    var fields = fieldNames.join(", ");
    var positions = valuePositions.join(", ");
    return { fields, positions, values, json, sql_values };
  }
  catch(err){}
  throw new error('failed to convert json to columns');
}