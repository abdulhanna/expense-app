import React from 'react'

const SummaryCard = ({ label, value, accent }) => (
  <div className="card">
    <p className="muted">{label}</p>
    <p className="stat" style={{ color: accent }}>
      {value}
    </p>
  </div>
)

const Summary = ({ summary }) => {
  const { balance, totalIncome, totalExpense, monthIncome, monthExpense, todayIncome, todayExpense, categoryTotals } =
    summary

  return (
    <section className="summary-grid">
      <SummaryCard label="Balance" value={`₹${balance.toFixed(2)}`} accent="var(--accent)" />
      <SummaryCard label="Total Income" value={`₹${totalIncome.toFixed(2)}`} accent="var(--success)" />
      <SummaryCard label="Total Expense" value={`₹${totalExpense.toFixed(2)}`} accent="var(--danger)" />
      <SummaryCard label="This Month" value={`+₹${monthIncome.toFixed(2)} / -₹${monthExpense.toFixed(2)}`} accent="var(--accent)" />
      <SummaryCard label="Today" value={`+₹${todayIncome.toFixed(2)} / -₹${todayExpense.toFixed(2)}`} accent="var(--accent)" />
      <div className="card">
        <p className="muted">By Category</p>
        <div className="category-list">
          {Object.keys(categoryTotals).length === 0 && <p className="muted">No data yet</p>}
          {Object.entries(categoryTotals).map(([cat, amt]) => (
            <div key={cat} className="category-row">
              <span>{cat}</span>
              <span className={amt >= 0 ? 'income' : 'expense'}>
                {amt >= 0 ? '+' : '-'}₹{Math.abs(amt).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Summary
