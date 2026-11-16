import { Link } from 'react-router-dom'

function Brand() {
  return (
    <Link aria-label="DBMS Bank home" className="inline-flex items-center gap-3" to="/">
      <span className="grid size-10 place-items-center rounded-xl bg-emerald-950 text-sm font-semibold tracking-tight text-white">
        DB
      </span>
      <span className="text-sm font-semibold tracking-[0.16em] text-emerald-950">
        DBMS <span className="font-medium tracking-normal text-slate-500">BANK</span>
      </span>
    </Link>
  )
}

export default Brand
