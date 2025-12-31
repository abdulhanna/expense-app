import React, { useEffect, useState } from 'react'

const createDefaultExpense = () => ({
  amount: '',
  category: '',
  description: '',
  date: new Date().toISOString().slice(0, 10),
  type: 'expense',
})

const ExpenseForm = ({ onSave, onClose, editing }) => {
  const [form, setForm] = useState(createDefaultExpense)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (editing) {
      setForm({
        ...editing,
        amount: editing.amount.toString(),
      })
    } else {
      setForm(createDefaultExpense())
    }
  }, [editing])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!form.amount || Number(form.amount) <= 0) {
      setError('Amount must be greater than 0')
      return
    }
    if (!form.category) {
      setError('Category is required')
      return
    }
    try {
      await onSave({
        ...form,
        amount: Number(form.amount),
      })
      if (!editing) setForm(createDefaultExpense())
    } catch (err) {
      setError(err.message || 'Unable to save right now')
    }
  }

  return (
    <div className="sheet">
      <div className="sheet-header">
        <h3>{editing ? 'Edit Entry' : 'Add Entry'}</h3>
        <button className="ghost" onClick={onClose} aria-label="Close form">
          ✕
        </button>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            name="amount"
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="category">Category</label>
          <input
            id="category"
            name="category"
            type="text"
            value={form.category}
            onChange={handleChange}
            placeholder="e.g. Food, Salary"
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="description">Description</label>
          <input
            id="description"
            name="description"
            type="text"
            value={form.description}
            onChange={handleChange}
            placeholder="Optional note"
          />
        </div>
        <div className="form-row inline">
          <div>
            <label htmlFor="date">Date</label>
            <input id="date" name="date" type="date" value={form.date} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="type">Type</label>
            <select id="type" name="type" value={form.type} onChange={handleChange}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="primary full">
          {editing ? 'Save Changes' : 'Add Entry'}
        </button>
      </form>
    </div>
  )
}

export default ExpenseForm
