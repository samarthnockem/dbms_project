import { Link } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'

function NotFoundPage() {
  return (
    <AuthLayout
      description="The page you’re looking for doesn’t exist. Return home to continue with DBMS Bank."
      eyebrow="Page not found"
      title="Let’s get you back on track."
    >
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_24px_70px_-38px_rgba(15,45,30,0.28)] sm:p-9">
        <p className="text-sm text-slate-600">We couldn’t find that page.</p>
        <Link className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-xl bg-emerald-950 px-5 text-sm font-semibold text-white transition hover:bg-emerald-900" to="/">
          Return home
        </Link>
      </div>
    </AuthLayout>
  )
}

export default NotFoundPage
