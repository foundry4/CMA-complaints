module.exports = (data)=>{
  try {
    // pullout specific BASIC vars
    var contact = data['primary-contact'] || "";
    var phone = data['phone'] || "";
    var email = data['email'] || "";

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
      "contact_name": contact,
      "contact_phone": phone,
      "contact_email": email,
      "report_other": report_other,
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