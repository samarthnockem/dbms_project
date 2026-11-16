import { useState } from 'react'
import { Link } from 'react-router-dom'
import api, { getApiErrorMessage } from '../lib/api.js'
import { branches } from '../data/bankingData.js'
import AccountChoiceDialog from '../components/AccountChoiceDialog.jsx'
import AuthLayout from '../components/AuthLayout.jsx'
import BranchSelect from '../components/BranchSelect.jsx'
import FormField from '../components/FormField.jsx'
import StatusMessage from '../components/StatusMessage.jsx'

function LoginPage() {
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const [loginBranchId, setLoginBranchId] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const branchId = String(formData.get('branchId') ?? '')
    setStatus('submitting')
    setMessage('')

    try {
      await api.post('/auth/login', {
        branchId: Number(branchId),
        email: String(formData.get('email') ?? '').trim(),
        password: formData.get('password'),
      })
      setLoginBranchId(branchId)
      setStatus('success')
      setMessage('')
    } catch (error) {
      setStatus('error')
      setMessage(getApiErrorMessage(error, 'We could not sign you in. Please check your details and try again.'))
    }
  }

  return (
    <AuthLayout
      description="Welcome back. Choose your branch and sign in to your DBMS Bank profile."
      eyebrow="Welcome back"
      title="Good to have you here."
    >
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_24px_70px_-38px_rgba(15,45,30,0.28)] sm:p-9">
        <div className="mb-7">
          <h2 className="text-2xl font-semibold tracking-tight text-emerald-950">Sign in</h2>
          <p className="mt-2 text-sm text-slate-500">Enter the details connected to your profile.</p>
        </div>

        <form className="mt-6 grid gap-5" onSubmit={handleSubmit}>
          <BranchSelect branches={branches} />
          <FormField autoComplete="email" label="Email address" name="email" type="email" required />
          <FormField autoComplete="current-password" label="Password" name="password" type="password" required />
          <StatusMessage message={message} status={status} />
          <button
            className="mt-1 flex h-12 items-center justify-center rounded-xl bg-emerald-950 px-5 text-sm font-semibold text-white transition hover:bg-emerald-900 focus:outline-none focus:ring-4 focus:ring-emerald-700/20 disabled:cursor-wait disabled:opacity-60"
            disabled={status === 'submitting'}
            type="submit"
          >
            {status === 'submitting' ? 'Signing you in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          New to DBMS Bank? <Link className="font-semibold text-emerald-800 underline decoration-emerald-800/30 underline-offset-4 hover:text-emerald-950" to="/signup">Create a profile</Link>
        </p>
      </div>
      <AccountChoiceDialog
        branchId={loginBranchId}
        onClose={() => setStatus('idle')}
        open={status === 'success'}
      />
    </AuthLayout>
  )
}

export default LoginPage
