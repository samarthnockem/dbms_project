import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Brand from '../components/Brand.jsx'
import StatusMessage from '../components/StatusMessage.jsx'
import api, { getApiErrorMessage } from '../lib/api.js'
import { formatCurrency } from '../lib/formatting.js'

function MoneyActionPage({ action }) {
  const deposit = action === 'deposit'
  const title = deposit ? 'Deposit money' : 'Withdraw money'
  const [state, setState] = useState({ status: 'loading', account: null, error: '' })
  const [amount, setAmount] = useState('')
  const [submit, setSubmit] = useState({ status: 'idle', message: '' })

  useEffect(() => {
    const controller = new AbortController()
    Promise.all([
      api.get('/accounts', { signal: controller.signal }),
      api.get('/auth/me', { signal: controller.signal }),
    ]).then(([accounts, user]) => {
      const selected = user.data?.context?.accountNo
      const account = accounts.data?.accounts?.find((item) => Number(item.accountNo) === Number(selected))
      if (!account) throw new Error('Your selected account could not be found.')
      if (!controller.signal.aborted) setState({ status: 'success', account, error: '' })
    }).catch((error) => {
      if (!controller.signal.aborted) setState({ status: 'error', account: null, error: getApiErrorMessage(error, 'Could not load your account. Please sign in again.') })
    })
    return () => controller.abort()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const value = Number(amount)
    if (!Number.isFinite(value) || value <= 0 || Math.round(value * 100) !== value * 100) {
      setSubmit({ status: 'error', message: 'Enter a positive amount with at most two decimal places.' })
      return
    }
    setSubmit({ status: 'submitting', message: '' })
    try {
      await api.post(deposit ? '/accounts/deposit' : '/accounts/withdraw', { amount: value })
      setSubmit({ status: 'success', message: `${deposit ? 'Deposit' : 'Withdrawal'} completed successfully.` })
      setAmount('')
      const { data } = await api.get('/accounts')
      const account = data?.accounts?.find((item) => Number(item.accountNo) === Number(state.account.accountNo))
      if (account) setState({ status: 'success', account, error: '' })
    } catch (error) {
      setSubmit({ status: 'error', message: getApiErrorMessage(error, `Could not complete the ${action}. Please try again.`) })
    }
  }

  if (!['deposit', 'withdraw'].includes(action)) return null
  return <div className="min-h-screen bg-[#f4f6f2]">
    <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12"><Brand /><Link className="text-sm font-medium text-emerald-800" to="/dashboard">Back to dashboard</Link></header>
    <main className="mx-auto max-w-3xl px-5 pb-16 pt-6 sm:px-8 lg:px-12">
      <Link className="text-sm text-emerald-800" to="/dashboard">? Dashboard</Link>
      <p className="mt-9 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">Account services</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-emerald-950 sm:text-4xl">{title}</h1>
      <p className="mt-2 text-sm text-slate-600">{deposit ? 'Add money to your selected account.' : 'Withdraw money while maintaining your account minimum balance.'}</p>
      {state.status === 'loading' && <div className="mt-8"><StatusMessage message="Loading your selected account�" status="loading" /></div>}
      {state.status === 'error' && <div className="mt-8 rounded-3xl bg-white p-7"><StatusMessage message={state.error} status="error" /><Link className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-xl bg-emerald-950 text-sm font-semibold text-white" to="/select-account">Select an account</Link></div>}
      {state.status === 'success' && <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <section aria-label="Selected account balance" className="rounded-3xl bg-emerald-950 p-6 text-white">
          <p className="text-xs uppercase tracking-widest text-emerald-200">Available balance</p><p className="mt-4 text-3xl font-semibold">{formatCurrency(state.account.balance)}</p>
          <p className="mt-7 border-t border-white/15 pt-4 font-mono text-xs text-emerald-100">Account ���� {String(state.account.accountNo).slice(-4)}</p>
        </section>
        <form className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold text-emerald-950" htmlFor="amount">Amount</label>
          <div className="mt-2 flex items-center rounded-xl border border-slate-200 px-4 focus-within:border-emerald-800"><span aria-hidden="true">INR</span><input className="h-12 min-w-0 flex-1 bg-transparent px-3 text-lg outline-none" id="amount" inputMode="decimal" min="0.01" onChange={(event) => setAmount(event.target.value)} placeholder="0.00" required step="0.01" type="number" value={amount} /><span className="text-xs text-slate-400">INR</span></div>
          <p className="mt-2 text-xs text-slate-500">Positive amount, up to two decimal places.</p><div className="mt-5"><StatusMessage message={submit.message} status={submit.status} /></div>
          <button className="mt-4 h-12 w-full rounded-xl bg-emerald-950 text-sm font-semibold text-white hover:bg-emerald-900 disabled:opacity-60" disabled={submit.status === 'submitting' || state.account.status !== 'ACTIVE'} type="submit">{submit.status === 'submitting' ? 'Processing�' : title}</button>
          {state.account.status !== 'ACTIVE' && <p className="mt-3 text-xs text-amber-800">Transactions are available for active accounts only.</p>}
          {submit.status === 'success' && <Link className="mt-4 block text-center text-sm text-emerald-800" to="/dashboard">Return to dashboard</Link>}
        </form>
      </div>}
    </main>
  </div>
}
export default MoneyActionPage

