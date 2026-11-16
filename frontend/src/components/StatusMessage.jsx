function StatusMessage({ status, message }) {
  if (!message) return null

  const isError = status === 'error'
  const isSuccess = status === 'success'

  return (
    <p
      aria-live={isError ? 'assertive' : 'polite'}
      className={`rounded-xl px-4 py-3 text-sm leading-6 ${isError ? 'bg-red-50 text-red-800' : isSuccess ? 'bg-emerald-50 text-emerald-900' : 'bg-slate-100 text-slate-700'}`}
      role={isError ? 'alert' : 'status'}
    >
      {message}
    </p>
  )
}

export default StatusMessage
