function BranchSelect({ branches, defaultValue = '', disabled = false }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700" htmlFor="branchId">
      <span>
        Bank branch<span aria-hidden="true" className="ml-1 text-rose-700">*</span>
      </span>
      <select
        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10 disabled:cursor-not-allowed disabled:bg-slate-50"
        defaultValue={defaultValue}
        disabled={disabled}
        id="branchId"
        name="branchId"
        required
      >
        <option disabled value="">Choose a branch</option>
        {branches.map((branch) => (
          <option key={branch.branchId} value={branch.branchId}>
            {branch.branchName} · {branch.city}
          </option>
        ))}
      </select>
    </label>
  )
}

export default BranchSelect
