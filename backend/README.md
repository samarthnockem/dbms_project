# Banking backend

The backend implements signup, branch-aware login, account creation/selection, and four selected-account features: deposits, withdrawals, transfers/history, and loans.

## Selected-account features

- `POST /api/accounts/deposit` — `{ amount }`
- `POST /api/accounts/withdraw` — `{ amount }`
- `POST /api/transactions/transfer` — `{ toAccountNo, amount }`
- `GET /api/transactions` — selected-account transaction history
- `POST /api/loans` — `{ principal, termMonths }`
- `GET /api/loans` — selected-branch loan history

All money-changing operations use PostgreSQL transactions and row locks. Withdrawals and transfers require an active account, sufficient funds, and compliance with `Account_Type.Min_Balance`.

## Authentication and account routes

- `GET /api/branches`
- `GET /api/account-types`
- `POST /api/auth/register` — `{ name, phone, email, address, dateOfBirth, password }`
- `POST /api/auth/login` — `{ branchId, email, password }`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/accounts`
- `GET /api/accounts/all` — all available accounts owned by the authenticated customer, including branch details
- `POST /api/accounts` — `{ branchId, typeCode }`
- `POST /api/accounts/select` — `{ accountNo }`
- `GET /health`

The JWT httpOnly cookie contains only `userID`. The selected branch and account are stored in a separate httpOnly context cookie and revalidated against PostgreSQL for protected operations.

## Required database configuration

The following values must match rows seeded in `Transaction_Type`:

```env
DEPOSIT_TXN_TYPE_CODE=DEP
WITHDRAWAL_TXN_TYPE_CODE=WDR
TRANSFER_TXN_TYPE_CODE=TRF
DEFAULT_LOAN_INTEREST_RATE=10.5
```

Authentication follows `schema.psql` and stores bcrypt hashes in `Customer.Password`.
