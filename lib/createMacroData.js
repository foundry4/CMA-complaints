module.exports = (data) => {
  try {
    console.log('creating data',data)
    // pullout specific BASIC vars
    var passport_number = data['passport-number'] || "";
    var passport_expiry_date = `${data['expiry-year']}-${data['expiry-month']}-${data['expiry-day']}`;
    var json = JSON.stringify(data);
    console.log(passport_expiry_date);
    var sql_values = {
      "info": json,
      "passport_number": passport_number,
      "passport_expiry_date": passport_expiry_date,
    }
    console.log('sql = ',sql_values)
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
    console.log('completed')
    return { fields, positions, values, json, sql_values };
  }
  catch (err) {  throw new err('failed to convert json to columns')};
}