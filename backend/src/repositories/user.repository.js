import { pool } from '../db/pool.js';

const findByEmail = async (email) => {
  const result = await pool.query(
    `SELECT customer_id, name, phone, email, address, date_of_birth, joining_date, password
     FROM customer WHERE lower(email) = lower($1) LIMIT 1`,
    [email],
  );
  return result.rows[0] || null;
};

const findById = async (id) => {
  const result = await pool.query(
    `SELECT customer_id, name, phone, email, address, date_of_birth, joining_date
     FROM customer WHERE customer_id = $1 LIMIT 1`,
    [id],
  );
  return result.rows[0] || null;
};

const create = async ({ name, phone, email, address, dateOfBirth, passwordHash }) => {
  const result = await pool.query(
    `INSERT INTO customer
     (name, phone, email, address, date_of_birth, joining_date, password)
     VALUES ($1, $2, lower($3), $4, $5, CURRENT_DATE, $6)
     RETURNING customer_id, name, phone, email, address, date_of_birth, joining_date`,
    [name, phone || null, email, address || null, dateOfBirth, passwordHash],
  );
  return result.rows[0];
};

export { findByEmail, findById, create };
