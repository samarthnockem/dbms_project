import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api, { getApiErrorMessage } from '../lib/api.js'
import { formatCurrency } from '../lib/formatting.js'
import { accountTypes, branches } from '../data/bankingData.js'
import AuthLayout from '../components/AuthLayout.jsx'
import BranchSelect from '../components/BranchSelect.jsx'
import StatusMessage from '../components/StatusMessage.jsx'

function CreateAccountPage() {
  const [searchParams] = useSearchParams()
  const requestedBranchId = searchParams.get('branchId') ?? ''
  const hasRequestedBranch = branches.some((branch) => String(branch.branchId) === requestedBranchId)
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const [account, setAccount] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const branchId = Number(formData.get('branchId'))
    const selectedBranch = branches.find((branch) => branch.branchId === branchId)

    if (!selectedBranch) {
      setStatus('error')
      setMessage('Choose a valid branch to continue.')
      return
    }

    setStatus('submitting')
    setMessage('')

    try {
      const { data } = await api.post('/accounts', {
        branchId,
        typeCode: formData.get('typeCode'),
      })
      setAccount(data.account)
      setStatus('success')
    } catch (error) {
      setStatus('error')
      setMessage(getApiErrorMessage(error, 'We could not open your account. Please try again.'))
    }
  }

  return (
    <AuthLayout
      description="Choose the branch and account type that fit your needs. You can review the account details as soon as it’s opened."
      eyebrow="One last step"
      title="Choose your account."
    >
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_24px_70px_-38px_rgba(15,45,30,0.28)] sm:p-9">
        {account ? (
          <div className="py-3">
            <span aria-hidden="true" className="grid size-12 place-items-center rounded-full bg-emerald-100 text-xl text-emerald-900">✓</span>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-emerald-950">Your account is ready.</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Welcome to DBMS Bank. Here are your new account details.</p>

            <dl className="mt-7 divide-y divide-slate-100 rounded-2xl border border-slate-100 px-4">
              <div className="flex items-center justify-between gap-4 py-4">
                <dt className="text-sm text-slate-500">Account number</dt>
                <dd className="font-mono text-sm font-semibold text-emerald-950">{account.accountNo}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-4">
                <dt className="text-sm text-slate-500">Account type</dt>
                <dd className="text-right text-sm font-semibold text-emerald-950">{account.accountTypeDescription}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-4">
                <dt className="text-sm text-slate-500">Branch</dt>
                <dd className="text-right text-sm font-semibold text-emerald-950">{account.branchName}{account.city ? ` · ${account.city}` : ''}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-4">
                <dt className="text-sm text-slate-500">Opening balance</dt>
                <dd className="text-sm font-semibold text-emerald-950">{formatCurrency(account.balance)}</dd>
              </div>
            </dl>

            <Link className="mt-7 inline-flex h-12 w-full items-center justify-center rounded-xl bg-emerald-950 text-sm font-semibold text-white transition hover:bg-emerald-900" to="/dashboard">
              Go to dashboard
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-7">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">Personal banking</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-emerald-950">Open your account</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">Your profile is set. Now choose the account you’d like to open.</p>
            </div>

            <form className="grid gap-5" onSubmit={handleSubmit}>
              <BranchSelect
                branches={branches}
                defaultValue={hasRequestedBranch ? requestedBranchId : ''}
              />
              <label className="grid gap-2 text-sm font-medium text-slate-700" htmlFor="typeCode">
                <span>
                  Account type<span aria-hidden="true" className="ml-1 text-rose-700">*</span>
                </span>
                <select
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10"
                  defaultValue=""
                  id="typeCode"
                  name="typeCode"
                  required
                >
                  <option disabled value="">Choose an account type</option>
                  {accountTypes.map((type) => (
                    <option key={type.typeCode} value={type.typeCode}>
                      {type.description} · Min. balance {formatCurrency(type.minBalance)}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid gap-2 rounded-xl bg-emerald-50/80 px-4 py-3 text-xs leading-5 text-emerald-950">
                {accountTypes.map((type) => (
                  <p key={type.typeCode}>
                    <span className="font-semibold">{type.description}:</span>{' '}
                    {type.interestRate}% interest · minimum balance {formatCurrency(type.minBalance)}
                  </p>
                ))}
              </div>

              <StatusMessage message={message} status={status} />

              <button
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-950 px-5 text-sm font-semibold text-white transition hover:bg-emerald-900 focus:outline-none focus:ring-4 focus:ring-emerald-700/20 disabled:cursor-wait disabled:opacity-60"
                disabled={status === 'submitting'}
                type="submit"
              >
                {status === 'submitting' ? 'Opening your account…' : 'Open account'}
                {status !== 'submitting' && <span aria-hidden="true">→</span>}
              </button>
            </form>
          </>
        )}
      </div>
    </AuthLayout>
  )
}

export default CreateAccountPage
