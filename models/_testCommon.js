const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM companies");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM jobs");
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM applications");

  await db.query(`
    INSERT INTO companies(handle, name, num_employees, description, logo_url)
    VALUES ('c1', 'C1', 1, 'Desc1', 'http://c1.img'),
           ('c2', 'C2', 2, 'Desc2', 'http://c2.img'),
           ('c3', 'C3', 3, 'Desc3', 'http://c3.img')`);

  const jobRes = await db.query(`
    INSERT INTO jobs(title, salary, equity, company_handle)
    VALUES ('j1t', 100, 0, 'c1'),
           ('j2t', 200, 1, 'c2'),
           ('j3t', 300, 0.3, 'c3')
           RETURNING id`);

  await db.query(`
        INSERT INTO users(username,
                          password,
                          first_name,
                          last_name,
                          email)
        VALUES ('u1', $1, 'U1F', 'U1L', 'u1@email.com'),
               ('u2', $2, 'U2F', 'U2L', 'u2@email.com')
        RETURNING username`,
      [
        await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
        await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
      ]);
  const jobId1 = jobRes.rows[0].id
  const jobId2 = jobRes.rows[1].id
  const jobId3 = jobRes.rows[2].id

  const check = db.query(`SELECT * FROM jobs`)

  await db.query(`INSERT INTO applications(username, job_id)
        VALUES ('u1', $1),
                ('u2', $2),
                ('u1', $3)`,
                [jobId1, jobId2, jobId3])
  
  
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
};