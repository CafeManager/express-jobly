const jwt = require("jsonwebtoken");
const { sqlForPartialUpdate } = require("./sql");
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