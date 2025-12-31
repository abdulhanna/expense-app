import React from 'react'

const ExpenseItem = ({ expense, onEdit, onDelete }) => {
  const isIncome = expense.type === 'income'
  return (
    <li className="expense-item">
      <div className="expense-icon">{isIncome ? '⬆️' : '⬇️'}</div>
      <div className="expense-body">
        <div className="expense-top">
          <span className="expense-category">{expense.category}</span>
          <span className={`amount ${isIncome ? 'income' : 'expense'}`}>
            {isIncome ? '+' : '-'}₹{Number(expense.amount).toFixed(2)}
          </span>
        </div>
        <div className="expense-meta">
          <span>{expense.description || 'No description'}</span>
          <span>{expense.date}</span>
        </div>
      </div>
      <div className="expense-actions">
        <button className="ghost" onClick={() => onEdit(expense)} aria-label="Edit entry">
          ✎
        </button>
        <button className="ghost" onClick={() => onDelete(expense.id)} aria-label="Delete entry">
          🗑️
        </button>
      </div>
    </li>
  )
}

export default ExpenseItem
