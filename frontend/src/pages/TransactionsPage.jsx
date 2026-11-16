import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Brand from '../components/Brand.jsx'
import StatusMessage from '../components/StatusMessage.jsx'
import api, { getApiErrorMessage } from '../lib/api.js'
import { formatCurrency } from '../lib/formatting.js'

const dateLabel = (value) => {
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`)
  return Number.isNaN(date.getTime()) ? String(value) : new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(date)
}

function TransactionsPage() {
  const [state, setState] = useState({ status: 'loading', transactions: [], error: '' })
  useEffect(() => {
    const controller = new AbortController()
    api.get('/transactions', { signal: controller.signal }).then(({ data }) => {
      if (!controller.signal.aborted) setState({ status: 'success', transactions: Array.isArray(data?.transactions) ? data.transactions : [], error: '' })
    }).catch((error) => {
      if (!controller.signal.aborted) setState({ status: 'error', transactions: [], error: getApiErrorMessage(error, 'Could not load transaction history.') })
    })
    return () => controller.abort()
  }, [])

  return <div className="min-h-screen bg-[#f4f6f2]">
    <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12"><Brand /><Link className="text-sm font-medium text-emerald-800" to="/dashboard">Back to dashboard</Link></header>
    <main className="mx-auto max-w-5xl px-5 pb-16 pt-6 sm:px-8 lg:px-12">
      <Link className="text-sm text-emerald-800" to="/dashboard">Dashboard</Link>
      <p className="mt-9 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">Account activity</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-emerald-950 sm:text-4xl">Transactions</h1>
      <p className="mt-2 text-sm text-slate-600">Recent activity for your selected account.</p>
      <section aria-label="Transaction history" className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {state.status === 'loading' && <div className="p-6"><StatusMessage message="Loading transactions..." status="loading" /></div>}
        {state.status === 'error' && <div className="p-6"><StatusMessage message={state.error} status="error" /></div>}
        {state.status === 'success' && state.transactions.length === 0 && <div className="p-10 text-center"><p className="font-semibold text-emerald-950">No transactions yet</p><p className="mt-2 text-sm text-slate-500">Deposits and withdrawals will appear here.</p></div>}
        {state.status === 'success' && state.transactions.length > 0 && <ul className="divide-y divide-slate-100">
          {state.transactions.map((transaction) => {
            const incoming = !transaction.from_account
            const title = transaction.transaction_type_description || transaction.txn_type_code || 'Transaction'
            return <li className="flex items-center gap-4 px-5 py-4 sm:px-7" key={transaction.txn_id}>
              <span aria-hidden="true" className={`grid size-10 shrink-0 place-items-center rounded-full ${incoming ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>{incoming ? '+' : '-'}</span>
              <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-emerald-950">{title}</span><span className="mt-1 block text-xs text-slate-500">{dateLabel(transaction.txn_date)}</span></span>
              <span className={`text-right text-sm font-semibold ${incoming ? 'text-emerald-800' : 'text-slate-800'}`}>{incoming ? '+' : '-'}{formatCurrency(transaction.amount)}</span>
            </li>
          })}
        </ul>}
      </section>
    </main>
  </div>
}
export default TransactionsPage
