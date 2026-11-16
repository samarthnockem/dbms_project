import { pool } from '../db/pool.js';

const list = async () => {
  const result = await pool.query(
    `SELECT branch_id, branch_name, city
     FROM branch
     ORDER BY branch_name, city, branch_id`,
  );
  return result.rows;
};

const findById = async (branchId) => {
  const result = await pool.query(
    `SELECT branch_id, branch_name, city
     FROM branch WHERE branch_id = $1 LIMIT 1`,
    [branchId],
  );
  return result.rows[0] || null;
};

export { list, findById };
