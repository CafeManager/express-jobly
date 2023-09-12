const { BadRequestError } = require("../expressError");

// THIS NEEDS SOME GREAT DOCUMENTATION.

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

function sqlForPartialFilter(dataToCovertToFilter) {
    const keys = Object.keys(dataToCovertToFilter);
    if (keys.length === 0) throw new BadRequestError("No data");
    let filterStrings = []
    if(Number(dataToCovertToFilter["minEmployees"]) > Number(dataToCovertToFilter["maxEmployees"])){
      throw new BadRequestError("Minimun cannot be greater than maximum");
    }
    if(dataToCovertToFilter["name"]){
      filterStrings.push(`name ILIKE '%${dataToCovertToFilter["name"]}%'`)
    }
    if(dataToCovertToFilter["minEmployees"]){
      filterStrings.push(`num_employees >= ${dataToCovertToFilter["minEmployees"]}`)
    }
    if(dataToCovertToFilter["maxEmployees"]){
      filterStrings.push(`num_employees <= ${dataToCovertToFilter["maxEmployees"]}`)
    }
    if(dataToCovertToFilter["title"]){
      filterStrings.push(`title ILIKE '%${dataToCovertToFilter["title"]}%'`)
    }
    if(dataToCovertToFilter["minSalary"]){
      filterStrings.push(`salary >= ${dataToCovertToFilter["minSalary"]}`)
    }
    if(dataToCovertToFilter["hasEquity"]){
      filterStrings.push(`equity > 0`)
    }



    let filterString = " WHERE " + filterStrings.join(" AND ") + " "
  
    return filterString
}

module.exports = { sqlForPartialUpdate, sqlForPartialFilter };
