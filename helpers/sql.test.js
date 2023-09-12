const jwt = require("jsonwebtoken");
const { sqlForPartialUpdate, sqlForPartialFilter } = require("./sql");
const { SECRET_KEY } = require("../config");

describe("sqlForPartialUpdate", function () {
  test("converts", function () {
    const propertiesToBeChanged = {
        integerOne: 3,
        integerTwo: 1,
        string: "hi"
    }

    const keySqlAnalog = {
        "integerOne": "integer_one",
        "integerTwo": "integer_two",
        "string": "string"
    }

    const sqlString = sqlForPartialUpdate(propertiesToBeChanged, keySqlAnalog)

    expect(sqlString).toEqual({setCols: '"integer_one"=$1, "integer_two"=$2, "string"=$3', values: [3,1,"hi"]})

  });
});

describe("sqlForFilterUpdate", function () {
    test("filters", function () {
      const propertiesToBeFiltered = {
        maxEmployees: 50,
        minEmployees: 20,
        name: "arbitraryName"
      }

      const sqlString = sqlForPartialFilter(propertiesToBeFiltered)
  
      expect(sqlString).toEqual(` WHERE name ILIKE '%${propertiesToBeFiltered.name}%' AND num_employees >= ${propertiesToBeFiltered.minEmployees} AND num_employees <= ${propertiesToBeFiltered.maxEmployees} `)
  
    });
  });