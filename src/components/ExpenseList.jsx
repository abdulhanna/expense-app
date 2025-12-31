import React from 'react'
import ExpenseItem from './ExpenseItem'

const ExpenseList = ({ expenses, onEdit, onDelete }) => {
  if (!expenses.length) {
    return <p className="muted">No entries yet. Add one to get started.</p>
  }

  return (
    <ul className="expense-list">
      {expenses.map((item) => (
        <ExpenseItem key={item.id} expense={item} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </ul>
  )
}

export default ExpenseList
