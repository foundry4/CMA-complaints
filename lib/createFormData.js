module.exports = (data)=>{
  try {
    // pullout specific BASIC vars
    var contact = data['primary-contact'] || "";
    var phone = data['phone'] || "";
    var email = data['email'] || "";
    var company_sector = data['company-sector'] || "";
    var company_sector_detail = data['company-sector-detail'] || "";

    var json = JSON.stringify(data);
    var sql_values = {
      "info": json,
      "contact_name": contact,
      "contact_phone": phone,
      "contact_email": email,
      "company_sector": company_sector,
      "company_sector_detail": company_sector_detail
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