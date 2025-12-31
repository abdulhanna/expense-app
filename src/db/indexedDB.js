import { openDB } from 'idb'

const DB_NAME = 'expenses-db'
const STORE_NAME = 'expenses'
const DB_VERSION = 1

const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true })
      }
    },
  })
}

export const getAllExpenses = async () => {
  const db = await initDB()
  return db.getAll(STORE_NAME)
}

export const addExpense = async (expense) => {
  const db = await initDB()
  const id = await db.add(STORE_NAME, expense)
  return { ...expense, id }
}

export const updateExpense = async (id, updates) => {
  const db = await initDB()
  const existing = await db.get(STORE_NAME, id)
  if (!existing) throw new Error('Expense not found')
  const updated = { ...existing, ...updates }
  await db.put(STORE_NAME, updated)
  return updated
}

export const deleteExpense = async (id) => {
  const db = await initDB()
  await db.delete(STORE_NAME, id)
}

export const clearExpenses = async () => {
  const db = await initDB()
  await db.clear(STORE_NAME)
}

export const dbConstants = { DB_NAME, STORE_NAME }
