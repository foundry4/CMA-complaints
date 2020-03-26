module.exports = (data) => {
  try {
    // pullout specific BASIC vars
    var contact_name = data['contact_name'] || "";
    var contact_phone = data['contact_phone'] || "";
    var contact_email = data['contact_email'] || "";
    var json = JSON.stringify(data);

    var sql_values = {
      "info": json,
      "contact_name": contact_name,
      "contact_phone": contact_phone,
      "contact_email": contact_email
    }

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
  catch (err) { }
  throw new error('failed to convert json to columns');
}