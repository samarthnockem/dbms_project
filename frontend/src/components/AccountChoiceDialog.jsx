import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

function AccountChoiceDialog({ open, branchId, onClose }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  const handleCancel = (event) => {
    event.preventDefault()
    onClose()
  }

  return (
    <dialog
      aria-labelledby="account-choice-title"
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-3xl border border-white/70 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-emerald-950/45"
      onCancel={handleCancel}
      ref={dialogRef}
    >
      <div className="relative p-6 sm:p-9">
        <button
          aria-label="Close account choices"
          className="absolute right-5 top-5 grid size-9 place-items-center rounded-full text-xl text-slate-500 transition hover:bg-slate-100 hover:text-emerald-950 focus:outline-none focus:ring-4 focus:ring-emerald-700/15"
          onClick={onClose}
          type="button"
        >
          ×
        </button>

        <span aria-hidden="true" className="grid size-12 place-items-center rounded-full bg-emerald-100 text-xl text-emerald-900">✓</span>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">Signed in</p>
        <h2 className="mt-2 pr-8 text-2xl font-semibold tracking-tight text-emerald-950" id="account-choice-title">
          What would you like to do?
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Choose how you’d like to continue with DBMS Bank.
        </p>

        <div className="mt-7 grid gap-3">
          <Link
            className="flex min-h-14 items-center justify-between rounded-xl bg-emerald-950 px-5 text-sm font-semibold text-white transition hover:bg-emerald-900 focus:outline-none focus:ring-4 focus:ring-emerald-700/20"
            onClick={onClose}
            to={`/create-account?branchId=${encodeURIComponent(branchId)}`}
          >
            <span>Create account</span>
            <span aria-hidden="true" className="text-lg">→</span>
          </Link>

          <Link
            className="flex min-h-14 items-center justify-between rounded-xl border border-slate-200 px-5 text-sm font-semibold text-emerald-950 transition hover:border-emerald-800/30 hover:bg-emerald-50 focus:outline-none focus:ring-4 focus:ring-emerald-700/10"
            onClick={onClose}
            to={`/select-account?branchId=${encodeURIComponent(branchId)}`}
          >
            <span>Select account</span>
            <span aria-hidden="true" className="text-lg">→</span>
          </Link>
        </div>
      </div>
    </dialog>
  )
}

export default AccountChoiceDialog
