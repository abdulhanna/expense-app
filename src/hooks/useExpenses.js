import { useEffect, useMemo, useState, useCallback } from 'react'
import {
  addExpense as addExpenseToDB,
  deleteExpense as deleteExpenseFromDB,
  getAllExpenses,
  updateExpense as updateExpenseInDB,
} from '../db/indexedDB'

const normalizeExpense = (expense) => ({
  ...expense,
  amount: Number(expense.amount),
  date: expense.date || new Date().toISOString().slice(0, 10),
  type: expense.type || 'expense',
})

export const useExpenses = () => {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadExpenses = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getAllExpenses()
      // Ensure consistent ordering (newest first)
      data.sort((a, b) => new Date(b.date) - new Date(a.date))
      setExpenses(data)
      setError(null)
    } catch (err) {
      setError(err.message || 'Failed to load expenses')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadExpenses()
  }, [loadExpenses])

  const addExpense = async (expense) => {
    try {
      const normalized = normalizeExpense(expense)
      const saved = await addExpenseToDB(normalized)
      setExpenses((prev) =>
        [saved, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date)),
      )
      return saved
    } catch (err) {
      setError(err.message || 'Failed to add expense')
      throw err
    }
  }

  const updateExpense = async (id, updates) => {
    try {
      const updated = await updateExpenseInDB(id, normalizeExpense(updates))
      setExpenses((prev) =>
        prev
          .map((item) => (item.id === id ? updated : item))
          .sort((a, b) => new Date(b.date) - new Date(a.date)),
      )
      return updated
    } catch (err) {
      setError(err.message || 'Failed to update expense')
      throw err
    }
  }

  const deleteExpense = async (id) => {
    try {
      await deleteExpenseFromDB(id)
      setExpenses((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      setError(err.message || 'Failed to delete expense')
      throw err
    }
  }

  const summary = useMemo(() => {
    const now = new Date()
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    const todayKey = now.toISOString().slice(0, 10)

    let totalIncome = 0
    let totalExpense = 0
    let monthIncome = 0
    let monthExpense = 0
    let todayIncome = 0
    let todayExpense = 0
    const categoryTotals = {}

    expenses.forEach((item) => {
      const isIncome = item.type === 'income'
      const isToday = item.date === todayKey
      const isMonth = item.date.slice(0, 7) === monthKey
      const amount = Number(item.amount)

      if (isIncome) totalIncome += amount
      else totalExpense += amount

      if (isMonth) {
        if (isIncome) monthIncome += amount
        else monthExpense += amount
      }

      if (isToday) {
        if (isIncome) todayIncome += amount
        else todayExpense += amount
      }

      if (!categoryTotals[item.category]) categoryTotals[item.category] = 0
      categoryTotals[item.category] += isIncome ? amount : -amount
    })

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      monthIncome,
      monthExpense,
      todayIncome,
      todayExpense,
      categoryTotals,
    }
  }, [expenses])

  return {
    expenses,
    loading,
    error,
    summary,
    addExpense,
    updateExpense,
    deleteExpense,
    reload: loadExpenses,
  }
}

export default useExpenses
