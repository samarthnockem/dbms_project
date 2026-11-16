import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Brand from '../components/Brand.jsx'
import StatusMessage from '../components/StatusMessage.jsx'
import api, { getApiErrorMessage } from '../lib/api.js'
import { formatCurrency } from '../lib/formatting.js'

function LoansPage() {
  const [loansState, setLoansState] = useState({ status: 'loading', loans: [], error: '' })
  const [principal, setPrincipal] = useState('')
  const [termMonths, setTermMonths] = useState('')
  const [submitState, setSubmitState] = useState({ status: 'idle', message: '' })

  const loadLoans = async (signal) => {
    const { data } = await api.get('/loans', { signal })
    if (!signal?.aborted) setLoansState({ status: 'success', loans: Array.isArray(data?.loans) ? data.loans : [], error: '' })
  }

  useEffect(() => {
    const controller = new AbortController()
    api.get('/loans', { signal: controller.signal }).then(({ data }) => {
      if (!controller.signal.aborted) setLoansState({ status: 'success', loans: Array.isArray(data?.loans) ? data.loans : [], error: '' })
    }).catch((error) => {
      if (!controller.signal.aborted) setLoansState({ status: 'error', loans: [], error: getApiErrorMessage(error, 'Could not load your loan applications.') })
    })
    return () => controller.abort()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const amount = Number(principal)
    const months = Number(termMonths)
    if (!Number.isFinite(amount) || amount <= 0 || Math.round(amount * 100) !== amount * 100 || !Number.isInteger(months) || months <= 0) {
      setSubmitState({ status: 'error', message: 'Enter a positive loan amount with up to two decimals and a whole number of months.' })
      return
    }
    setSubmitState({ status: 'submitting', message: '' })
    try {
      await api.post('/loans', { principal: amount, termMonths: months })
      setSubmitState({ status: 'success', message: 'Your loan application was submitted.' })
      setPrincipal('')
      setTermMonths('')
      await loadLoans()
    } catch (error) {
      setSubmitState({ status: 'error', message: getApiErrorMessage(error, 'Could not submit your loan application.') })
    }
  }

  return <div className="min-h-screen bg-[#f4f6f2]">
    <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12"><Brand /><Link className="text-sm font-medium text-emerald-800" to="/dashboard">Back to dashboard</Link></header>
    <main className="mx-auto max-w-5xl px-5 pb-16 pt-6 sm:px-8 lg:px-12">
      <Link className="text-sm text-emerald-800" to="/dashboard">Dashboard</Link>
      <p className="mt-9 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">Borrowing</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-emerald-950 sm:text-4xl">Loans</h1>
      <p className="mt-2 text-sm text-slate-600">Apply for a loan and review applications for your current branch.</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <form className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" onSubmit={handleSubmit}>
          <h2 className="text-lg font-semibold text-emerald-950">New application</h2>
          <label className="mt-6 block text-sm font-semibold text-emerald-950" htmlFor="principal">Loan amount</label>
          <input className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-emerald-800" id="principal" inputMode="decimal" min="0.01" onChange={(event) => setPrincipal(event.target.value)} placeholder="INR amount" required step="0.01" type="number" value={principal} />
          <label className="mt-5 block text-sm font-semibold text-emerald-950" htmlFor="term">Term</label>
          <div className="mt-2 flex items-center gap-3"><input className="h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-emerald-800" id="term" min="1" onChange={(event) => setTermMonths(event.target.value)} placeholder="Number of months" required step="1" type="number" value={termMonths} /><span className="text-sm text-slate-500">months</span></div>
          <div className="mt-5"><StatusMessage message={submitState.message} status={submitState.status} /></div>
          <button className="mt-4 h-12 w-full rounded-xl bg-emerald-950 text-sm font-semibold text-white hover:bg-emerald-900 disabled:opacity-60" disabled={submitState.status === 'submitting'} type="submit">{submitState.status === 'submitting' ? 'Submitting...' : 'Submit application'}</button>
        </form>
        <section aria-label="Loan application history" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold text-emerald-950">Application history</h2>
          {loansState.status === 'loading' && <div className="mt-5"><StatusMessage message="Loading applications..." status="loading" /></div>}
          {loansState.status === 'error' && <div className="mt-5"><StatusMessage message={loansState.error} status="error" /></div>}
          {loansState.status === 'success' && loansState.loans.length === 0 && <p className="mt-5 text-sm text-slate-500">No loan applications for this branch yet.</p>}
          {loansState.status === 'success' && loansState.loans.length > 0 && <ul className="mt-4 divide-y divide-slate-100">
            {loansState.loans.map((loan) => <li className="flex items-start justify-between gap-4 py-4" key={loan.loan_id}>
              <span><span className="block text-sm font-semibold text-emerald-950">{formatCurrency(loan.principal)}</span><span className="mt-1 block text-xs text-slate-500">{loan.term_months} months at {loan.interest_rate}%</span></span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">{loan.status}</span>
            </li>)}
          </ul>}
        </section>
      </div>
    </main>
  </div>
}
export default LoansPage
