# DBMS Bank frontend

The frontend is a React and Vite app for the DBMS Bank sign-up, login, and account-opening flow. React Router handles the pages, and Tailwind CSS provides the styling.

## Run locally

Install the frontend dependencies, then start the backend and frontend in separate terminals:

```sh
npm install
npm run dev
```

The frontend sends API requests directly to `http://localhost:3000/api`. Start the backend on port `3000`; the backend must allow the frontend origin `http://localhost:5173` for credentialed requests.

The branch, account-type, and transaction-type choices are held in `src/data/bankingData.js` and rendered from frontend data.

## Pages

- `/` offers sign-up and login.
- `/signup` uses frontend branch data, registers a customer, then carries the selected branch to account opening.
- `/login` uses frontend branch data and signs in with the selected branch.
- `/create-account` uses frontend branch and account-type data, opens the selected account, and displays its details.
- `/select-account` lists the customer’s accounts, then uses the backend selection endpoint to set the selected-account cookie.
- `/dashboard` shows the selected account and the available banking action buttons.

The login endpoint sets the authentication cookie. Its post-login destination is deferred for a later iteration.
