import { pool } from '../db/pool.js';

const list = async () => {
  const result = await pool.query(
    `SELECT type_code, description, interest_rate, min_balance
     FROM account_type
     ORDER BY type_code`,
  );
  return result.rows;
};

const findByCode = async (typeCode) => {
  const result = await pool.query(
    `SELECT type_code, description, interest_rate, min_balance
     FROM account_type WHERE type_code = $1 LIMIT 1`,
    [typeCode],
  );
  return result.rows[0] || null;
};

export { list, findByCode };
