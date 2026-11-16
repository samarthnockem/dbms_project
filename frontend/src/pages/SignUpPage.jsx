import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api, { getApiErrorMessage } from '../lib/api.js'
import { branches } from '../data/bankingData.js'
import AuthLayout from '../components/AuthLayout.jsx'
import BranchSelect from '../components/BranchSelect.jsx'
import FormField from '../components/FormField.jsx'
import StatusMessage from '../components/StatusMessage.jsx'

function SignUpPage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const password = String(formData.get('password') ?? '')
    const confirmPassword = String(formData.get('confirmPassword') ?? '')
    const branchId = String(formData.get('branchId') ?? '')

    if (password !== confirmPassword) {
      setStatus('error')
      setMessage('Your passwords do not match.')
      return
    }

    setStatus('submitting')
    setMessage('')

    try {
      await api.post('/auth/register', {
        name: String(formData.get('name') ?? '').trim(),
        phone: String(formData.get('phone') ?? '').trim(),
        email: String(formData.get('email') ?? '').trim(),
        address: String(formData.get('address') ?? '').trim(),
        dateOfBirth: formData.get('dateOfBirth'),
        password,
      })

      navigate(`/create-account?branchId=${encodeURIComponent(branchId)}`, { replace: true })
    } catch (error) {
      setStatus('error')
      setMessage(getApiErrorMessage(error, 'We could not create your profile. Please try again.'))
    }
  }

  return (
    <AuthLayout
      description="Tell us a little about yourself. After creating your profile, you’ll choose the DBMS Bank account that works for you."
      eyebrow="New customer"
      title="Let’s get you started."
    >
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_24px_70px_-38px_rgba(15,45,30,0.28)] sm:p-9">
        <div className="mb-7">
          <h2 className="text-2xl font-semibold tracking-tight text-emerald-950">Create your profile</h2>
          <p className="mt-2 text-sm text-slate-500"><span className="text-rose-700">*</span> Required fields</p>
        </div>

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <FormField autoComplete="name" label="Full name" maxLength={100} name="name" required />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField autoComplete="tel" label="Phone number" maxLength={15} name="phone" type="tel" />
            <FormField autoComplete="bday" label="Date of birth" name="dateOfBirth" type="date" required />
          </div>
          <FormField autoComplete="email" label="Email address" maxLength={100} name="email" type="email" required />
          <FormField autoComplete="street-address" label="Address" maxLength={200} name="address" />
          <BranchSelect branches={branches} />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField autoComplete="new-password" label="Password" minLength={8} name="password" type="password" required />
            <FormField autoComplete="new-password" label="Confirm password" minLength={8} name="confirmPassword" type="password" required />
          </div>

          <StatusMessage message={message} status={status} />

          <button
            className="mt-2 flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-950 px-5 text-sm font-semibold text-white transition hover:bg-emerald-900 focus:outline-none focus:ring-4 focus:ring-emerald-700/20 disabled:cursor-wait disabled:opacity-60"
            disabled={status === 'submitting'}
            type="submit"
          >
            {status === 'submitting' ? 'Creating your profile…' : 'Continue to account setup'}
            {status !== 'submitting' && <span aria-hidden="true">→</span>}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already registered? <Link className="font-semibold text-emerald-800 underline decoration-emerald-800/30 underline-offset-4 hover:text-emerald-950" to="/login">Sign in</Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default SignUpPage
