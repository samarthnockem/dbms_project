import { Link } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'

function HomePage() {
  return (
    <AuthLayout
      description="A thoughtful, straightforward way to manage your everyday banking. Choose your branch, open an account, and get started with DBMS Bank."
      eyebrow="Welcome to DBMS Bank"
      title="A simpler way to bank."
    >
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_24px_70px_-38px_rgba(15,45,30,0.28)] sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">Get started</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-emerald-950">How can we help today?</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">Create a profile or sign in to continue.</p>

        <div className="mt-8 grid gap-3">
          <Link
            className="flex min-h-14 items-center justify-between rounded-xl bg-emerald-950 px-5 text-sm font-semibold text-white transition hover:bg-emerald-900 focus:outline-none focus:ring-4 focus:ring-emerald-700/20"
            to="/signup"
          >
            <span>I’m new to DBMS Bank</span>
            <span aria-hidden="true" className="text-lg">→</span>
          </Link>
          <Link
            className="flex min-h-14 items-center justify-between rounded-xl border border-slate-200 px-5 text-sm font-semibold text-emerald-950 transition hover:border-emerald-800/30 hover:bg-emerald-50 focus:outline-none focus:ring-4 focus:ring-emerald-700/10"
            to="/login"
          >
            <span>I already have a profile</span>
            <span aria-hidden="true" className="text-lg">→</span>
          </Link>
        </div>

        <p className="mt-7 border-t border-slate-100 pt-5 text-xs leading-5 text-slate-500">
          Your branch and account type are selected during setup.
        </p>
      </div>
    </AuthLayout>
  )
}

export default HomePage
