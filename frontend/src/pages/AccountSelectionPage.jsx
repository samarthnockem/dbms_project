import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api, { getApiErrorMessage } from '../lib/api.js'
import { formatCurrency } from '../lib/formatting.js'
import { branches } from '../data/bankingData.js'
import Brand from '../components/Brand.jsx'
import StatusMessage from '../components/StatusMessage.jsx'

function AccountSelectionPage() {
  const navigate = useNavigate()
  const [accountsState, setAccountsState] = useState({
    status: 'loading',
    accounts: [],
    branchId: null,
    error: '',
  })
  const [selectionStatus, setSelectionStatus] = useState('idle')
  const [selectingAccountNo, setSelectingAccountNo] = useState(null)
  const [selectionError, setSelectionError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    const loadAccounts = async () => {
      try {
        const [accountsResponse, userResponse] = await Promise.all([
          api.get('/accounts/all', { signal: controller.signal }),
          api.get('/auth/me', { signal: controller.signal }),
        ])

        if (!controller.signal.aborted) {
          setAccountsState({
            status: 'success',
            accounts: Array.isArray(accountsResponse.data?.accounts)
              ? accountsResponse.data.accounts
              : [],
            branchId: userResponse.data?.context?.branchId ?? null,
            error: '',
          })
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setAccountsState({
            status: 'error',
            accounts: [],
            branchId: null,
            error: getApiErrorMessage(error, 'Could not load your accounts. Please try again.'),
          })
        }
      }
    }

    loadAccounts()
    return () => controller.abort()
  }, [])

  const activeBranch = branches.find((branch) => branch.branchId === accountsState.branchId)

  const handleSelect = async (account) => {
    if (Number(account.branchID) !== Number(accountsState.branchId)) return

    setSelectionStatus('submitting')
    setSelectingAccountNo(account.accountNo)
    setSelectionError('')

    try {
      await api.post('/accounts/select', { accountNo: account.accountNo })
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setSelectionStatus('error')
      setSelectionError(getApiErrorMessage(error, 'Could not select this account. Please try again.'))
      setSelectingAccountNo(null)
    }
  }

  const canCreateAccount = Number.isInteger(Number(accountsState.branchId))
    && Number(accountsState.branchId) > 0

  return (
    <div className="min-h-screen bg-[#f4f6f2]">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <Brand />
        <Link className="text-sm font-medium text-slate-600 transition hover:text-emerald-950" to="/login">Back to sign in</Link>
      </header>

      <main className="mx-auto max-w-5xl px-5 pb-16 pt-8 sm:px-8 lg:px-12">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">Your banking</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-emerald-950 sm:text-4xl">Select an account</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Choose an account to continue. Your selected account will be saved to your secure session cookie.
        </p>

        {accountsState.status === 'loading' && (
          <div className="mt-8"><StatusMessage status="loading" message="Loading your accounts…" /></div>
        )}
        {accountsState.status === 'error' && (
          <div className="mt-8 grid gap-4">
            <StatusMessage status="error" message={accountsState.error} />
            <Link className="inline-flex h-12 items-center justify-center rounded-xl bg-emerald-950 px-5 text-sm font-semibold text-white hover:bg-emerald-900" to="/login">
              Sign in again
            </Link>
          </div>
        )}

        {accountsState.status === 'success' && accountsState.accounts.length === 0 && (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <span aria-hidden="true" className="mx-auto grid size-12 place-items-center rounded-full bg-emerald-100 text-xl text-emerald-900">＋</span>
            <h2 className="mt-5 text-xl font-semibold text-emerald-950">No accounts yet</h2>
            <p className="mt-2 text-sm text-slate-500">Open your first account to get started with DBMS Bank.</p>
            {canCreateAccount && (
              <Link
                className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-emerald-950 px-5 text-sm font-semibold text-white transition hover:bg-emerald-900"
                to={`/create-account?branchId=${accountsState.branchId}`}
              >
                Create account
              </Link>
            )}
          </div>
        )}

        {accountsState.status === 'success' && accountsState.accounts.length > 0 && (
          <>
            <div className="mt-8 rounded-2xl border border-emerald-900/10 bg-white px-5 py-4 text-sm text-slate-600 shadow-sm">
              {activeBranch
                ? <>Signed in at <span className="font-semibold text-emerald-950">{activeBranch.branchName} · {activeBranch.city}</span>. Accounts at other branches are shown but can’t be selected in this session.</>
                : 'The branch selected at sign-in could not be identified. Please sign in again.'}
            </div>

            <StatusMessage message={selectionError} status={selectionStatus} />

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {accountsState.accounts.map((account) => {
                const isSelectable = Number(account.branchID) === Number(accountsState.branchId)
                const isSubmitting = selectionStatus === 'submitting'
                  && selectingAccountNo === account.accountNo

                return (
                  <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" key={account.accountNo}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800">{account.accountTypeDescription}</p>
                        <p className="mt-2 font-mono text-sm text-slate-500">•••• {String(account.accountNo).slice(-4)}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wide ${account.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>
                        {account.status}
                      </span>
                    </div>
                    <p className="mt-6 text-2xl font-semibold tracking-tight text-emerald-950">{formatCurrency(account.balance)}</p>
                    <p className="mt-1 text-sm text-slate-500">{account.branchName} · {account.city}</p>
                    <button
                      className="mt-5 flex h-11 w-full items-center justify-center rounded-xl bg-emerald-950 px-4 text-sm font-semibold text-white transition hover:bg-emerald-900 focus:outline-none focus:ring-4 focus:ring-emerald-700/20 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                      disabled={!isSelectable || selectionStatus === 'submitting'}
                      onClick={() => handleSelect(account)}
                      type="button"
                    >
                      {isSubmitting
                        ? 'Selecting…'
                        : isSelectable
                          ? 'Select this account'
                          : `Sign in at ${account.branchName} to select`}
                    </button>
                  </article>
                )
              })}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default AccountSelectionPage
