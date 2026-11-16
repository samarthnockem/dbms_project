import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api, { getApiErrorMessage } from '../lib/api.js'
import { formatCurrency } from '../lib/formatting.js'
import Brand from '../components/Brand.jsx'
import StatusMessage from '../components/StatusMessage.jsx'

const dashboardActions = [
  { label: 'Deposit', description: 'Add money to your account', symbol: '+', path: '/deposit' },
  { label: 'Withdraw', description: 'Take money out', symbol: '-', path: '/withdraw' },
  { label: 'Transfer', description: 'Send money to another account', symbol: 'T', path: '/transfer' },
  { label: 'Transactions', description: 'Review your account activity', symbol: 'T', path: '/transactions' },
  { label: 'Loans', description: 'Apply for or review a loan', symbol: 'L', path: '/loans' },
]

function DashboardPage() {
  const navigate = useNavigate()
  const [dashboard, setDashboard] = useState({
    status: 'loading',
    user: null,
    account: null,
    error: '',
  })
  const [logoutStatus, setLogoutStatus] = useState('idle')
  const [logoutError, setLogoutError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    const loadDashboard = async () => {
      try {
        const [accountsResponse, userResponse] = await Promise.all([
          api.get('/accounts', { signal: controller.signal }),
          api.get('/auth/me', { signal: controller.signal }),
        ])
        const selectedAccountNo = userResponse.data?.context?.accountNo
        const accounts = Array.isArray(accountsResponse.data?.accounts)
          ? accountsResponse.data.accounts
          : []
        const account = accounts.find(
          (item) => Number(item.accountNo) === Number(selectedAccountNo),
        )

        if (!account) {
          throw new Error('Your selected account could not be found. Select an account to continue.')
        }

        if (!controller.signal.aborted) {
          setDashboard({
            status: 'success',
            user: userResponse.data?.user ?? null,
            account,
            error: '',
          })
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setDashboard({
            status: 'error',
            user: null,
            account: null,
            error: getApiErrorMessage(error, 'Could not load your dashboard. Please sign in again.'),
          })
        }
      }
    }

    loadDashboard()
    return () => controller.abort()
  }, [])

  const handleLogout = async () => {
    setLogoutStatus('submitting')
    setLogoutError('')
    try {
      await api.post('/auth/logout')
      navigate('/', { replace: true })
    } catch (error) {
      setLogoutStatus('error')
      setLogoutError(getApiErrorMessage(error, 'Could not sign out. Please try again.'))
    }
  }

  const branchId = dashboard.account?.branchID

  return (
    <div className="min-h-screen bg-[#f4f6f2]">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <Brand />
        <button
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-emerald-800/30 hover:text-emerald-950 disabled:cursor-wait disabled:opacity-60"
          disabled={logoutStatus === 'submitting'}
          onClick={handleLogout}
          type="button"
        >
          {logoutStatus === 'submitting' ? 'Signing out…' : 'Sign out'}
        </button>
      </header>

      <main className="mx-auto max-w-7xl px-5 pb-16 pt-6 sm:px-8 lg:px-12">
        {dashboard.status === 'loading' && (
          <div className="mx-auto mt-16 max-w-xl"><StatusMessage status="loading" message="Loading your dashboard…" /></div>
        )}

        {dashboard.status === 'error' && (
          <div className="mx-auto mt-16 max-w-xl rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
            <StatusMessage message={dashboard.error} status="error" />
            <Link className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-xl bg-emerald-950 text-sm font-semibold text-white hover:bg-emerald-900" to="/select-account">
              Select an account
            </Link>
          </div>
        )}

        {dashboard.status === 'success' && dashboard.account && (
          <>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">Personal banking</p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-emerald-950 sm:text-4xl">
                  Welcome{dashboard.user?.name ? `, ${dashboard.user.name}` : ''}
                </h1>
                <p className="mt-2 text-sm text-slate-600">Here’s an overview of your selected account.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-50"
                  to={`/select-account?branchId=${branchId}`}
                >
                  Change account
                </Link>
                <Link
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-950 px-4 text-sm font-semibold text-white transition hover:bg-emerald-900"
                  to={`/create-account?branchId=${branchId}`}
                >
                  Create another account
                </Link>
              </div>
            </div>

            <section aria-label="Selected account summary" className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-3xl bg-emerald-950 p-6 text-white shadow-lg shadow-emerald-950/10 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">Available balance</p>
                    <p className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{formatCurrency(dashboard.account.balance)}</p>
                  </div>
                  <span className="rounded-full border border-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-100">
                    {dashboard.account.status}
                  </span>
                </div>
                <div className="mt-10 flex flex-col gap-2 border-t border-white/15 pt-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs text-emerald-200">{dashboard.account.accountTypeDescription}</p>
                    <p className="mt-1 font-mono text-sm tracking-wider">Account ···· {String(dashboard.account.accountNo).slice(-4)}</p>
                  </div>
                  <p className="text-sm text-emerald-100">{dashboard.account.branchName} · {dashboard.account.city}</p>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">Account details</p>
                <dl className="mt-5 divide-y divide-slate-100">
                  <div className="flex justify-between gap-4 py-4 text-sm">
                    <dt className="text-slate-500">Account number</dt>
                    <dd className="font-mono font-semibold text-emerald-950">{dashboard.account.accountNo}</dd>
                  </div>
                  <div className="flex justify-between gap-4 py-4 text-sm">
                    <dt className="text-slate-500">Account type</dt>
                    <dd className="text-right font-semibold text-emerald-950">{dashboard.account.accountTypeDescription}</dd>
                  </div>
                  <div className="flex justify-between gap-4 py-4 text-sm">
                    <dt className="text-slate-500">Branch</dt>
                    <dd className="text-right font-semibold text-emerald-950">{dashboard.account.branchName} · {dashboard.account.city}</dd>
                  </div>
                  <div className="flex justify-between gap-4 py-4 text-sm">
                    <dt className="text-slate-500">Opened</dt>
                    <dd className="text-right font-semibold text-emerald-950">{String(dashboard.account.dateOpened).slice(0, 10)}</dd>
                  </div>
                </dl>
              </div>
            </section>

            <section aria-labelledby="quick-actions-title" className="mt-10">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">Banking services</p>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight text-emerald-950" id="quick-actions-title">What would you like to do?</h2>
                </div>
                <span className="hidden text-xs text-slate-500 sm:inline">Choose a banking service</span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {dashboardActions.map((action) => (
                  <button
                    className="flex min-h-24 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm hover:bg-emerald-50/40 disabled:cursor-not-allowed disabled:opacity-75"
                    disabled={!action.path}
                    onClick={() => action.path && navigate(action.path)}
                    key={action.label}
                    type="button"
                  >
                    <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-xl font-medium text-emerald-900">{action.symbol}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-emerald-950">{action.label}</span>
                      <span className="mt-1 block text-xs leading-5 text-slate-500">{action.description}</span>
                    </span>
                    <span className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">{action.path ? 'Open' : 'Soon'}</span>
                  </button>
                ))}
              </div>
            </section>

            {logoutError && <div className="mt-6"><StatusMessage message={logoutError} status="error" /></div>}
          </>
        )}
      </main>
    </div>
  )
}

export default DashboardPage

