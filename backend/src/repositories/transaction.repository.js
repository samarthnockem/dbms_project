import { pool } from '../db/pool.js';

const transactionType = (name, fallback) => process.env[name] || fallback;

const lockAccount = async (client, accountNo) => {
  const result = await client.query(
    `SELECT a.account_no, a.customer_id, a.status, a.balance,
            at.min_balance
     FROM account a
     JOIN account_type at ON at.type_code = a.type_code
     WHERE a.account_no = $1
     FOR UPDATE`,
    [accountNo],
  );
  return result.rows[0] || null;
};

const deposit = async (customerId, accountNo, amount) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const account = await lockAccount(client, accountNo);
    if (!account || account.customer_id !== customerId) throw Object.assign(new Error('Account is not available'), { statusCode: 403 });
    if (account.status !== 'ACTIVE') throw Object.assign(new Error('Account is not active'), { statusCode: 409 });

    await client.query('UPDATE account SET balance = balance + $1 WHERE account_no = $2', [amount, accountNo]);
    const transaction = await client.query(
      `INSERT INTO transactions (txn_type_code, to_account, amount, txn_date)
       VALUES ($1, $2, $3, CURRENT_DATE)
       RETURNING txn_id, txn_type_code, from_account, to_account, amount, txn_date`,
      [transactionType('DEPOSIT_TXN_TYPE_CODE', 'DEP'), accountNo, amount],
    );
    await client.query('COMMIT');
    return transaction.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const withdraw = async (customerId, accountNo, amount) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const account = await lockAccount(client, accountNo);
    if (!account || account.customer_id !== customerId) throw Object.assign(new Error('Account is not available'), { statusCode: 403 });
    if (account.status !== 'ACTIVE') throw Object.assign(new Error('Account is not active'), { statusCode: 409 });
    const remaining = Number(account.balance) - Number(amount);
    if (remaining < Number(account.min_balance)) throw Object.assign(new Error('Insufficient funds or minimum balance requirement would be violated'), { statusCode: 409 });

    await client.query('UPDATE account SET balance = balance - $1 WHERE account_no = $2', [amount, accountNo]);
    const transaction = await client.query(
      `INSERT INTO transactions (txn_type_code, from_account, amount, txn_date)
       VALUES ($1, $2, $3, CURRENT_DATE)
       RETURNING txn_id, txn_type_code, from_account, to_account, amount, txn_date`,
      [transactionType('WITHDRAWAL_TXN_TYPE_CODE', 'WDR'), accountNo, amount],
    );
    await client.query('COMMIT');
    return transaction.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const transfer = async (customerId, fromAccountNo, toAccountNo, amount) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query(
      `SELECT a.account_no, a.customer_id, a.status, a.balance, at.min_balance
       FROM account a
       JOIN account_type at ON at.type_code = a.type_code
       WHERE a.account_no IN ($1, $2)
       ORDER BY a.account_no
       FOR UPDATE`,
      [fromAccountNo, toAccountNo],
    );
    const source = result.rows.find((row) => row.account_no === fromAccountNo);
    const destination = result.rows.find((row) => row.account_no === toAccountNo);
    if (!source || !destination || source.customer_id !== customerId) throw Object.assign(new Error('Account is not available'), { statusCode: 403 });
    if (source.status !== 'ACTIVE' || destination.status !== 'ACTIVE') throw Object.assign(new Error('Both accounts must be active'), { statusCode: 409 });
    if (Number(source.balance) - Number(amount) < Number(source.min_balance)) throw Object.assign(new Error('Insufficient funds or minimum balance requirement would be violated'), { statusCode: 409 });

    await client.query('UPDATE account SET balance = balance - $1 WHERE account_no = $2', [amount, fromAccountNo]);
    await client.query('UPDATE account SET balance = balance + $1 WHERE account_no = $2', [amount, toAccountNo]);
    const transaction = await client.query(
      `INSERT INTO transactions (txn_type_code, from_account, to_account, amount, txn_date)
       VALUES ($1, $2, $3, $4, CURRENT_DATE)
       RETURNING txn_id, txn_type_code, from_account, to_account, amount, txn_date`,
      [transactionType('TRANSFER_TXN_TYPE_CODE', 'TRF'), fromAccountNo, toAccountNo, amount],
    );
    await client.query('COMMIT');
    return transaction.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const history = async (accountNo) => {
  const result = await pool.query(
    `SELECT t.txn_id, t.txn_type_code, tt.description AS transaction_type_description,
            t.from_account, t.to_account, t.amount, t.txn_date
     FROM transactions t
     JOIN transaction_type tt ON tt.txn_type_code = t.txn_type_code
     WHERE t.from_account = $1 OR t.to_account = $1
     ORDER BY t.txn_date DESC, t.txn_id DESC`,
    [accountNo],
  );
  return result.rows;
};

export { deposit, withdraw, transfer, history };
