import { Link, NavLink } from 'react-router-dom'
import Brand from './Brand.jsx'

function AuthLayout({ eyebrow, title, description, children }) {
  return (
    <div className="min-h-screen bg-[#f4f6f2]">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <Brand />
        <nav aria-label="Account access" className="flex items-center gap-2 sm:gap-4">
          <NavLink
            className={({ isActive }) =>
              `rounded-full px-4 py-2 text-sm transition ${isActive ? 'bg-white text-emerald-950 shadow-sm' : 'text-slate-600 hover:text-emerald-950'}`
            }
            to="/login"
          >
            Sign in
          </NavLink>
          <Link
            className="rounded-full bg-emerald-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-900 sm:px-5"
            to="/signup"
          >
            Open an account
          </Link>
        </nav>
      </header>

      <main className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-12 pt-5 sm:px-8 md:gap-14 lg:min-h-[calc(100vh-142px)] lg:grid-cols-[1.02fr_0.98fr] lg:px-12 lg:py-10">
        <section className="max-w-xl py-5 lg:py-10">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">
            {eyebrow}
          </p>
          <h1 className="max-w-xl text-4xl font-medium leading-[1.1] tracking-[-0.055em] text-emerald-950 sm:text-5xl lg:text-[3.65rem]">
            {title}
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            {description}
          </p>

          <div className="mt-9 grid max-w-lg gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-950/10 bg-white/70 p-4">
              <span aria-hidden="true" className="mb-3 grid size-9 place-items-center rounded-full bg-emerald-100 text-emerald-900">✓</span>
              <p className="text-sm font-semibold text-emerald-950">Bank on your terms</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">Choose the branch and account that suit you.</p>
            </div>
            <div className="rounded-2xl border border-emerald-950/10 bg-white/70 p-4">
              <span aria-hidden="true" className="mb-3 grid size-9 place-items-center rounded-full bg-amber-100 text-amber-900">◇</span>
              <p className="text-sm font-semibold text-emerald-950">A clear start</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">Simple steps to get your banking set up.</p>
            </div>
          </div>

          <div className="mt-8 hidden max-w-lg items-center justify-between rounded-2xl bg-emerald-950 px-6 py-5 text-white sm:flex">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-200">DBMS Bank</p>
              <p className="mt-2 text-lg font-medium">Your next chapter starts here.</p>
            </div>
            <span aria-hidden="true" className="grid size-12 place-items-center rounded-full border border-white/20 text-2xl text-emerald-100">↗</span>
          </div>
        </section>

        <section className="w-full justify-self-center lg:max-w-xl">
          {children}
        </section>
      </main>

      <footer className="mx-auto flex max-w-7xl flex-col gap-2 border-t border-emerald-950/10 px-5 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <span>DBMS Bank</span>
        <span>Banking, made more personal.</span>
      </footer>
    </div>
  )
}

export default AuthLayout
