import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Brand from '../components/Brand.jsx'
import StatusMessage from '../components/StatusMessage.jsx'
import api, { getApiErrorMessage } from '../lib/api.js'
import { formatCurrency } from '../lib/formatting.js'

function TransferPage() {
  const [accountState, setAccountState] = useState({ status: 'loading', account: null, error: '' })
  const [toAccountNo, setToAccountNo] = useState('')
  const [amount, setAmount] = useState('')
  const [formState, setFormState] = useState({ status: 'idle', message: '' })

  useEffect(() => {
    const controller = new AbortController()
    const loadAccount = async () => {
      try {
        const [accountsResponse, userResponse] = await Promise.all([
          api.get('/accounts', { signal: controller.signal }),
          api.get('/auth/me', { signal: controller.signal }),
        ])
        const selectedNo = userResponse.data?.context?.accountNo
        const accounts = Array.isArray(accountsResponse.data?.accounts) ? accountsResponse.data.accounts : []
        const account = accounts.find((item) => Number(item.accountNo) === Number(selectedNo))
        if (!account) throw new Error('Your selected account could not be found.')
        if (!controller.signal.aborted) setAccountState({ status: 'success', account, error: '' })
      } catch (error) {
        if (!controller.signal.aborted) setAccountState({ status: 'error', account: null, error: getApiErrorMessage(error, 'Could not load your account. Please sign in again.') })
      }
    }
    loadAccount()
    return () => controller.abort()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const destination = Number(toAccountNo)
    const value = Number(amount)
    if (!Number.isInteger(destination) || destination <= 0) {
      setFormState({ status: 'error', message: 'Enter a valid destination account number.' })
      return
    }
    if (destination === Number(accountState.account.accountNo)) {
      setFormState({ status: 'error', message: 'Choose an account other than your selected account.' })
      return
    }
    if (!Number.isFinite(value) || value <= 0 || Math.round(value * 100) !== value * 100) {
      setFormState({ status: 'error', message: 'Enter a positive amount with at most two decimal places.' })
      return
    }
    setFormState({ status: 'submitting', message: '' })
    try {
      await api.post('/transactions/transfer', { toAccountNo: destination, amount: value })
      setFormState({ status: 'success', message: 'Transfer completed successfully.' })
      setAmount('')
      setToAccountNo('')
      try {
        const { data } = await api.get('/accounts')
        const account = data?.accounts?.find((item) => Number(item.accountNo) === Number(accountState.account.accountNo))
        if (account) setAccountState({ status: 'success', account, error: '' })
      } catch {
        // Keep the confirmed transfer status if the balance refresh fails.
      }
    } catch (error) {
      setFormState({ status: 'error', message: getApiErrorMessage(error, 'Could not complete the transfer. Please try again.') })
    }
  }

  return <div className="min-h-screen bg-[#f4f6f2]">
    <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12"><Brand /><Link className="text-sm font-medium text-emerald-800" to="/dashboard">Back to dashboard</Link></header>
    <main className="mx-auto max-w-4xl px-5 pb-16 pt-6 sm:px-8 lg:px-12">
      <Link className="text-sm text-emerald-800" to="/dashboard">Dashboard</Link>
      <p className="mt-9 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">Account services</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-emerald-950 sm:text-4xl">Transfer money</h1>
      <p className="mt-2 text-sm text-slate-600">Send money from your selected account to another active account.</p>
      {accountState.status === 'loading' && <div className="mt-8"><StatusMessage message="Loading your selected account..." status="loading" /></div>}
      {accountState.status === 'error' && <div className="mt-8 rounded-3xl bg-white p-7"><StatusMessage message={accountState.error} status="error" /><Link className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-xl bg-emerald-950 text-sm font-semibold text-white" to="/select-account">Select an account</Link></div>}
      {accountState.status === 'success' && <div className="mt-8 grid gap-5 sm:grid-cols-[0.85fr_1.15fr]">
        <section aria-label="Selected account balance" className="rounded-3xl bg-emerald-950 p-6 text-white">
          <p className="text-xs uppercase tracking-widest text-emerald-200">Available balance</p><p className="mt-4 text-3xl font-semibold">{formatCurrency(accountState.account.balance)}</p>
          <p className="mt-7 border-t border-white/15 pt-4 font-mono text-xs text-emerald-100">Account ending {String(accountState.account.accountNo).slice(-4)}</p>
          <p className="mt-3 text-xs text-emerald-200">Minimum balance requirements apply.</p>
        </section>
        <form className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold text-emerald-950" htmlFor="destination-account">Destination account number</label>
          <input autoComplete="off" className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 font-mono outline-none focus:border-emerald-800" id="destination-account" inputMode="numeric" min="1" onChange={(event) => setToAccountNo(event.target.value)} placeholder="Enter account number" required type="number" value={toAccountNo} />
          <label className="mt-5 block text-sm font-semibold text-emerald-950" htmlFor="transfer-amount">Amount</label>
          <input className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-emerald-800" id="transfer-amount" inputMode="decimal" min="0.01" onChange={(event) => setAmount(event.target.value)} placeholder="INR amount" required step="0.01" type="number" value={amount} />
          <div className="mt-5"><StatusMessage message={formState.message} status={formState.status} /></div>
          <button className="mt-4 h-12 w-full rounded-xl bg-emerald-950 text-sm font-semibold text-white hover:bg-emerald-900 disabled:opacity-60" disabled={formState.status === 'submitting' || accountState.account.status !== 'ACTIVE'} type="submit">{formState.status === 'submitting' ? 'Processing...' : 'Transfer money'}</button>
          {accountState.account.status !== 'ACTIVE' && <p className="mt-3 text-xs text-amber-800">Transfers are available for active accounts only.</p>}
          {formState.status === 'success' && <Link className="mt-4 block text-center text-sm text-emerald-800" to="/transactions">View transactions</Link>}
        </form>
      </div>}
    </main>
  </div>
}
export default TransferPage
