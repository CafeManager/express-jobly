const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate, sqlForPartialFilter } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for jobs. */

class Job {
     /** Create a job (from data), update db, return new company data.
   *
   * data should be {title, salary, equity, company_handle}
   *
   * Returns { title, salary, equity, company_handle }
   *
   * Throws BadRequestError if company already in database.
   * */

  static async create({ title, salary, equity, company_handle}) {

    const result = await db.query(
          `INSERT INTO jobs
           (title, salary, equity, company_handle)
           VALUES ($1, $2, $3, $4)
           RETURNING id, title, salary, equity, company_handle AS "companyHandle"`,
        [
            title, 
            salary, 
            equity, 
            company_handle
        ],
    );
    const job = result.rows[0];

    return job;
  }

  /** Find all jobs.
   *
   * Returns [{ id, title, salary, equity, company_handle }, ...]
   * */

  static async findAll() {
    const jobsRes = await db.query(
          `SELECT id,
                    title, 
                    salary, 
                    equity, 
                    company_handle
           FROM jobs
           ORDER BY title`);
    return jobsRes.rows;
  }

  /** Given a job id, return data about job.
   *
   * Returns { id, title, salary, equity, company_handle }
   *   
   *
   * Throws NotFoundError if not found.
   **/

  static async get(id) {
    const jobsRes = await db.query(
          `SELECT title, 
                    salary, 
                    equity, 
                    company_handle
           FROM jobs
           WHERE id = $1`,
        [id]);

    const job = jobsRes.rows[0];

    if (!job) throw new NotFoundError(`${id} is not a valid job.`);

    return job;
  }

  static async findAllFilter(filters) {
    const whereClause = sqlForPartialFilter(filters)
    const jobsRes = await db.query(
      `SELECT title, 
                salary, 
                equity, 
                company_handle
       FROM jobs
       ${whereClause}
       ORDER BY title`);
    
    return jobsRes.rows;
  }

  /** Update job data with `data`.
   *
   * Data can include: {title, salary, equity}
   *
   * Returns {id, title, salary, equity, company_handle}
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(
        data,
        {
          companyHandle: "company_handle"
        });
    const handleVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE jobs 
                      SET ${setCols} 
                      WHERE id = ${handleVarIdx} 
                      RETURNING title, 
                                salary, 
                                equity 
                                `;
    const result = await db.query(querySql, [...values, id]);
    const company = result.rows[0];

    if (!company) throw new NotFoundError(`No job: ${handle}`);

    return company;
  }

  /** Delete given job from database; returns undefined.
   *
   * Throws NotFoundError if company not found.
   **/

  static async remove(id) {
    const result = await db.query(
          `DELETE
           FROM companies
           WHERE id = $1
           RETURNING handle`,
        [id]);
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job: ${id}`);
  }

  /** Get a list of jobs from a certain company.
   *
   * handle should be a string
   * 
   * Throws NotFoundError if company not found.
   **/

  static async getJobsFromCompany(handle) {
    const sqlString = `%${handle}%`
    const result = await db.query(
          `SELECT id, 
                title, 
                salary, 
                equity
                FROM jobs WHERE company_handle ILIKE $1 ORDER BY company_handle`,
        [sqlString]);
    const jobs = result.rows;
    
    
    if (!jobs) throw new NotFoundError(`No job: ${id}`);
    return jobs
  }
}

module.exports = Job