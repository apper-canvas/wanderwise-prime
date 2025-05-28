import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import { format } from 'date-fns'

const BudgetTab = () => {
  const [budget, setBudget] = useState(2000)
  const [expenses, setExpenses] = useState([
    { id: 1, category: 'flights', amount: 450, description: 'Round trip to Paris', date: '2024-01-15' },
    { id: 2, category: 'hotel', amount: 120, description: 'Hotel Marriott - 2 nights', date: '2024-01-16' },
    { id: 3, category: 'food', amount: 85, description: 'Local restaurant dinner', date: '2024-01-16' }
  ])
  const [newExpense, setNewExpense] = useState({
    category: 'food',
    amount: '',
    description: ''
  })

  const expenseCategories = [
    { id: 'flights', label: 'Flights', color: 'border-blue-500' },
    { id: 'hotel', label: 'Hotels', color: 'border-green-500' },
    { id: 'food', label: 'Food & Dining', color: 'border-orange-500' },
    { id: 'transport', label: 'Transport', color: 'border-purple-500' },
    { id: 'activities', label: 'Activities', color: 'border-pink-500' },
    { id: 'shopping', label: 'Shopping', color: 'border-yellow-500' }
  ]

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const budgetRemaining = budget - totalExpenses

  const addExpense = () => {
    if (!newExpense.amount || !newExpense.description) {
      toast.error('Please fill in all expense details')
      return
    }

    const expense = {
      id: Date.now(),
      category: newExpense.category,
      amount: parseFloat(newExpense.amount),
      description: newExpense.description,
      date: format(new Date(), 'yyyy-MM-dd')
    }

    setExpenses([...expenses, expense])
    setNewExpense({ category: 'food', amount: '', description: '' })
    toast.success('Expense added successfully!')
  }

  const removeExpense = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id))
    toast.success('Expense removed')
  }

  return (
    <div className="space-y-8">
      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Budget</p>
              <p className="text-2xl font-bold">${budget}</p>
            </div>
            <ApperIcon name="Target" className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Total Spent</p>
              <p className="text-2xl font-bold">${totalExpenses}</p>
            </div>
            <ApperIcon name="CreditCard" className="w-8 h-8 text-red-200" />
          </div>
        </div>
        
        <div className={`bg-gradient-to-r ${budgetRemaining >= 0 ? 'from-green-500 to-green-600' : 'from-orange-500 to-orange-600'} text-white p-6 rounded-2xl`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${budgetRemaining >= 0 ? 'text-green-100' : 'text-orange-100'} text-sm`}>
                {budgetRemaining >= 0 ? 'Remaining' : 'Over Budget'}
              </p>
              <p className="text-2xl font-bold">${Math.abs(budgetRemaining)}</p>
            </div>
            <ApperIcon name={budgetRemaining >= 0 ? 'TrendingUp' : 'AlertTriangle'} className={`w-8 h-8 ${budgetRemaining >= 0 ? 'text-green-200' : 'text-orange-200'}`} />
          </div>
        </div>
      </div>

      {/* Add Expense Form */}
      <div className="bg-surface-50 p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Expense</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={newExpense.category}
            onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
            className="search-input"
          >
            {expenseCategories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Amount"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
            className="search-input"
          />
          <input
            type="text"
            placeholder="Description"
            value={newExpense.description}
            onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
            className="search-input"
          />
          <button onClick={addExpense} className="booking-btn">
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add
          </button>
        </div>
      </div>

      {/* Expense List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Recent Expenses</h3>
        {expenses.map((expense) => {
          const category = expenseCategories.find(cat => cat.id === expense.category)
          return (
            <motion.div
              key={expense.id}
              className={`expense-card ${category?.color}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-surface-500 bg-surface-100 px-2 py-1 rounded">
                      {category?.label}
                    </span>
                    <span className="text-sm text-surface-500">{expense.date}</span>
                  </div>
                  <p className="font-medium text-gray-800 mt-1">{expense.description}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xl font-bold text-gray-800">${expense.amount}</span>
                  <button
                    onClick={() => removeExpense(expense.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default BudgetTab