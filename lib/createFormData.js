module.exports = (data)=>{
  try {
    // pullout specific BASIC vars
    const contact = data['primary-contact'] || "";
    const phone = data['phone'] || "";
    const email = data['email'] || "";
    const company_location = data['company-location'] || "";
    var company_name = data['company-name'] || "";

    var json = JSON.stringify(data);
    var sql_values = {
      "info": json,
      "contact_name": contact,
      "contact_phone": phone,
      "contact_email": email,
      "company_location": company_location,
      "company_name": company_name
    }

    // Quick check
    //console.log("SQL values: " + sql_values)

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