module.exports = (data)=>{
  try {
    // pullout specific BASIC vars
    const contact = data['primary-contact'] || "";
    const phone = data['phone'] || "";
    const email = data['email'] || "";
    const company_location = data['company-location'] || "";
    var company_name = data['company-name'] || "";
    var company_sector = data['company-sector'] || "";
    var company_sector_detail = data['company-sector-detail'] || "";
    var description = data['description'] || "";
    var product = data['product'] || "";
    var company_postcode = data['company_postcode'] || "";


    // test checkbox results to ensure they are arrays
    // no results : undefined; single result: string; multiple results: array
    // catch single items and turn into array
    var boxList = ["report_reason"];
    for (var i = 0; i < boxList.length; i++) {
      var typeName = boxList[i];
      if (data[typeName] && !Array.isArray(data[typeName])) {
        data[typeName] = [data[typeName]];
      }
    }

    // Q1
    var reports = {};

    if (data['report_reason'] ) {
      let len = data['report_reason'].length;
      for (var i = 0; i < len; i++) {
        var name = 'report_'+data['report_reason'][i];
        reports[name] = true;
      }
    }
    console.log("reports", reports)
    // test input
    var report_other = data['report_other'] || "";



    var json = JSON.stringify(data);
    
    var sql_values = {
      "info": json,
      "report_other": report_other,
      "company_location": company_location,
      "company_name": company_name,
      "company_sector": company_sector,
      "company_sector_detail": company_sector_detail,
      "description": description,
      "product":product,
      "company_postcode":company_postcode
    }



    // Add in fields from reports
    var report_keys = Object.keys(reports)
    console.log("keys", report_keys);
    
    for (var i = 0; i < report_keys.length; i++) {
      key = report_keys[i]
      console.log(key);
      if(key!='report_other'){
        sql_values[key] = reports[key]
      }
    }
    
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