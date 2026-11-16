/** @param {{ label: string, name: string, type?: string, required?: boolean, [key: string]: unknown }} props */
function FormField({ label, name, type = 'text', required = false, ...inputProps }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700" htmlFor={name}>
      <span>
        {label}
        {required && <span aria-hidden="true" className="ml-1 text-rose-700">*</span>}
      </span>
      <input
        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10 disabled:cursor-not-allowed disabled:bg-slate-50"
        id={name}
        name={name}
        required={required}
        type={type}
        {...inputProps}
      />
    </label>
  )
}

export default FormField
