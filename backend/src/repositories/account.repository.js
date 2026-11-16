import { pool } from '../db/pool.js';

const listByCustomerAndBranch = async (customerId, branchId) => {
  const result = await pool.query(
    `SELECT a.account_no, a.customer_id, a.type_code, a.branch_id,
            a.balance, a.status, a.date_opened,
            b.branch_name, b.city,
            at.description AS account_type_description
     FROM account a
     JOIN branch b ON b.branch_id = a.branch_id
     JOIN account_type at ON at.type_code = a.type_code
     WHERE a.customer_id = $1
       AND a.branch_id = $2
       AND a.status <> 'CLOSED'
     ORDER BY a.account_no`,
    [customerId, branchId],
  );
  return result.rows;
};

const listByCustomer = async (customerId) => {
  const result = await pool.query(
    `SELECT a.account_no, a.customer_id, a.type_code, a.branch_id,
            a.balance, a.status, a.date_opened,
            b.branch_name, b.city,
            at.description AS account_type_description
     FROM account a
     JOIN branch b ON b.branch_id = a.branch_id
     JOIN account_type at ON at.type_code = a.type_code
     WHERE a.customer_id = $1
       AND a.status <> 'CLOSED'
     ORDER BY b.branch_name, b.city, a.account_no`,
    [customerId],
  );
  return result.rows;
};

const findOwnedSelectable = async (customerId, branchId, accountNo) => {
  const result = await pool.query(
    `SELECT a.account_no, a.customer_id, a.type_code, a.branch_id,
            a.balance, a.status, a.date_opened,
            b.branch_name, b.city,
            at.description AS account_type_description
     FROM account a
     JOIN branch b ON b.branch_id = a.branch_id
     JOIN account_type at ON at.type_code = a.type_code
     WHERE a.customer_id = $1
       AND a.branch_id = $2
       AND a.account_no = $3
       AND a.status <> 'CLOSED'
     LIMIT 1`,
    [customerId, branchId, accountNo],
  );
  return result.rows[0] || null;
};

const create = async (customerId, branchId, typeCode) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const branchResult = await client.query(
      'SELECT branch_id FROM branch WHERE branch_id = $1 FOR SHARE',
      [branchId],
    );
    if (!branchResult.rowCount) {
      const error = new Error('Selected branch does not exist');
      error.statusCode = 404;
      throw error;
    }

    const typeResult = await client.query(
      'SELECT type_code FROM account_type WHERE type_code = $1 FOR SHARE',
      [typeCode],
    );
    if (!typeResult.rowCount) {
      const error = new Error('Selected account type does not exist');
      error.statusCode = 404;
      throw error;
    }

    const result = await client.query(
      `INSERT INTO account (customer_id, type_code, branch_id, date_opened)
       VALUES ($1, $2, $3, CURRENT_DATE)
       RETURNING account_no`,
      [customerId, typeCode, branchId],
    );
    await client.query('COMMIT');
    return result.rows[0].account_no;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export { listByCustomerAndBranch, listByCustomer, findOwnedSelectable, create };
