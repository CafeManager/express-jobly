"use strict";

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  const newJob = {
    title: "new",
    salary: 1000,
    equity: "0.1",
    company_handle: "c1"
  };

  test("works", async function () {
    let job = await Job.create(newJob);

    delete job.id
    
    expect(job.title).toEqual(newJob.title);
    expect(job.salary).toEqual(newJob.salary);
    expect(job.equity).toEqual(newJob.equity);
    expect(job.companyHandle).toEqual(newJob.company_handle);

    const result = await db.query(
          `SELECT title, salary, 
          equity, 
          company_handle AS "companyHandle"
           FROM jobs
           WHERE title = 'new'`);
  
    expect(result.rows).toEqual([
      {
        title: "new",
        salary: 1000,
        equity: "0.1",
        companyHandle: "c1"
      },
    ]);
  });

  // test("bad request with dupe", async function () {
  //   try {
  //     await Company.create(newCompany);
  //     await Company.create(newCompany);
  //     fail();
  //   } catch (err) {
  //     expect(err instanceof BadRequestError).toBeTruthy();
  //   }
  // });
});

/************************************** findAll */

describe("findAll", function () {
  test("works", async function () {
    let jobs = await Job.findAll();
    
    jobs = jobs.map(ele => {
      delete ele.id
      return ele
    })
    expect(jobs).toEqual([
      {
        company_handle: "c1",
        equity: "0",
        salary: 100,
        title: "j1t"
      },
      {
        company_handle: "c2",
        equity: "1",
        salary: 200,
        title: "j2t"
      },
      {
        company_handle: "c3",
        equity: "0.3",
        salary: 300,
        title: "j3t"
      }
    ]);
  });
});

/************************************** get */

// describe("get", function () {
//   test("works", async function () {
//     let user = await User.get("u1");
//     expect(user).toEqual({
//       username: "u1",
//       firstName: "U1F",
//       lastName: "U1L",
//       email: "u1@email.com",
//       isAdmin: false,
//     });
//   });

//   test("not found if no such user", async function () {
//     try {
//       await User.get("nope");
//       fail();
//     } catch (err) {
//       expect(err instanceof NotFoundError).toBeTruthy();
//     }
//   });
// });


