import { pool } from '../db/pool.js';

const create = async (customerId, branchId, principal, termMonths, interestRate) => {
  const result = await pool.query(
    `INSERT INTO loan
     (customer_id, branch_id, principal, interest_rate, term_months, status)
     VALUES ($1, $2, $3, $4, $5, 'APPLIED')
     RETURNING loan_id, customer_id, branch_id, principal, interest_rate,
               term_months, status, start_date`,
    [customerId, branchId, principal, interestRate, termMonths],
  );
  return result.rows[0];
};

const listByCustomerAndBranch = async (customerId, branchId) => {
  const result = await pool.query(
    `SELECT loan_id, customer_id, branch_id, principal, interest_rate,
            term_months, status, start_date
     FROM loan
     WHERE customer_id = $1 AND branch_id = $2
     ORDER BY loan_id DESC`,
    [customerId, branchId],
  );
  return result.rows;
};

export { create, listByCustomerAndBranch };
