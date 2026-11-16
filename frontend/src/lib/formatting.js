const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
})

export const formatCurrency = (amount) => {
  const value = Number(amount)
  return Number.isFinite(value) ? inrFormatter.format(value) : inrFormatter.format(0)
}
