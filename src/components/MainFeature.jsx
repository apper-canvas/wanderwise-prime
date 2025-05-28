import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import { format, addDays } from 'date-fns'

const MainFeature = () => {
  const [activeTab, setActiveTab] = useState('search')
  const [searchType, setSearchType] = useState('flights')
  const [tripData, setTripData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    passengers: 1,
    budget: 2000
  })
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
  const [itinerary, setItinerary] = useState([
    { id: 1, time: '09:00', activity: 'Visit Eiffel Tower', location: 'Paris', type: 'sightseeing' },
    { id: 2, time: '14:00', activity: 'Lunch at Café de Flore', location: 'Saint-Germain', type: 'dining' },
    { id: 3, time: '16:30', activity: 'Louvre Museum Tour', location: 'Paris', type: 'culture' }
  ])

  const tabs = [
    { id: 'search', label: 'Search & Book', icon: 'Search' },
    { id: 'budget', label: 'Budget Tracker', icon: 'PiggyBank' },
    { id: 'itinerary', label: 'Itinerary', icon: 'Calendar' }
  ]

  const searchTypes = [
    { id: 'flights', label: 'Flights', icon: 'Plane' },
    { id: 'hotels', label: 'Hotels', icon: 'Building2' },
    { id: 'transport', label: 'Transport', icon: 'Car' }
  ]

  const expenseCategories = [
    { id: 'flights', label: 'Flights', color: 'border-blue-500' },
    { id: 'hotel', label: 'Hotels', color: 'border-green-500' },
    { id: 'food', label: 'Food & Dining', color: 'border-orange-500' },
    { id: 'transport', label: 'Transport', color: 'border-purple-500' },
    { id: 'activities', label: 'Activities', color: 'border-pink-500' },
    { id: 'shopping', label: 'Shopping', color: 'border-yellow-500' }
  ]

  const destinations = [
    {
      id: 1,
      name: 'Paris, France',
      image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop',
      price: '$580',
      rating: 4.8,
      type: 'flights'
    },
    {
      id: 2,
      name: 'Hotel Luxe Central',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
      price: '$120/night',
      rating: 4.6,
      type: 'hotels'
    },
    {
      id: 3,
      name: 'Private Transfer',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
      price: '$45',
      rating: 4.9,
      type: 'transport'
    }
  ]

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const budgetRemaining = tripData.budget - totalExpenses

  const handleSearch = () => {
    if (!tripData.destination || !tripData.startDate) {
      toast.error('Please fill in destination and travel dates')
      return
    }
    toast.success(`Searching for ${searchType} to ${tripData.destination}`)
  }

  const handleBooking = (item) => {
    toast.success(`${item.name} booked successfully! Confirmation sent to your email.`)
  }

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

  const addItineraryItem = () => {
    const newItem = {
      id: Date.now(),
      time: '10:00',
      activity: 'New Activity',
      location: tripData.destination || 'Location',
      type: 'sightseeing'
    }
    setItinerary([...itinerary, newItem])
    toast.success('Activity added to itinerary!')
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Your Travel Command Center
          </h2>
          <p className="text-surface-600 text-lg max-w-2xl mx-auto">
            Search, book, budget, and plan all in one place. Your perfect trip starts here.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row justify-center mb-8 space-y-2 sm:space-y-0 sm:space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-travel'
                  : 'bg-white text-surface-600 hover:bg-surface-50 shadow-soft'
              }`}
            >
              <ApperIcon name={tab.icon} className="w-5 h-5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="travel-card p-6 md:p-8"
          >
            {/* Search & Book Tab */}
            {activeTab === 'search' && (
              <div className="space-y-8">
                {/* Search Type Selector */}
                <div className="flex flex-wrap gap-4 justify-center">
                  {searchTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSearchType(type.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        searchType === type.id
                          ? 'bg-secondary text-white'
                          : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                      }`}
                    >
                      <ApperIcon name={type.icon} className="w-4 h-4" />
                      <span>{type.label}</span>
                    </button>
                  ))}
                </div>

                {/* Search Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Destination
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={tripData.destination}
                        onChange={(e) => setTripData({...tripData, destination: e.target.value})}
                        placeholder="Where to?"
                        className="search-input pl-10"
                      />
                      <ApperIcon name="MapPin" className="absolute left-3 top-3 w-5 h-5 text-surface-400" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Check-in / Departure
                    </label>
                    <input
                      type="date"
                      value={tripData.startDate}
                      onChange={(e) => setTripData({...tripData, startDate: e.target.value})}
                      className="search-input"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Check-out / Return
                    </label>
                    <input
                      type="date"
                      value={tripData.endDate}
                      onChange={(e) => setTripData({...tripData, endDate: e.target.value})}
                      className="search-input"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Guests / Passengers
                    </label>
                    <select
                      value={tripData.passengers}
                      onChange={(e) => setTripData({...tripData, passengers: parseInt(e.target.value)})}
                      className="search-input"
                    >
                      {[1,2,3,4,5,6].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="text-center">
                  <button onClick={handleSearch} className="booking-btn">
                    <ApperIcon name="Search" className="w-5 h-5 mr-2" />
                    Search {searchTypes.find(t => t.id === searchType)?.label}
                  </button>
                </div>

                {/* Search Results */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {destinations.filter(dest => dest.type === searchType).map((destination) => (
                    <motion.div
                      key={destination.id}
                      className="destination-card group"
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={destination.image}
                          alt={destination.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-destination-overlay" />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-semibold">
                          ⭐ {destination.rating}
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{destination.name}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-primary">{destination.price}</span>
                          <button
                            onClick={() => handleBooking(destination)}
                            className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary-dark transition-colors"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Budget Tracker Tab */}
            {activeTab === 'budget' && (
              <div className="space-y-8">
                {/* Budget Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm">Total Budget</p>
                        <p className="text-2xl font-bold">${tripData.budget}</p>
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
            )}

            {/* Itinerary Tab */}
            {activeTab === 'itinerary' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Trip Itinerary</h3>
                    <p className="text-surface-600">Plan your perfect day-by-day schedule</p>
                  </div>
                  <button onClick={addItineraryItem} className="booking-btn">
                    <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                    Add Activity
                  </button>
                </div>

                <div className="space-y-4">
                  {itinerary.map((item, index) => (
                    <motion.div
                      key={item.id}
                      className="travel-card p-6 hover:border-primary/20"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center">
                            <ApperIcon 
                              name={item.type === 'dining' ? 'Utensils' : item.type === 'culture' ? 'Building' : 'MapPin'} 
                              className="w-5 h-5 text-primary" 
                            />
                          </div>
                          <div className="text-lg font-semibold text-primary bg-primary/10 px-3 py-1 rounded-lg">
                            {item.time}
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-800">{item.activity}</h4>
                          <p className="text-surface-600 flex items-center mt-1">
                            <ApperIcon name="MapPin" className="w-4 h-4 mr-1" />
                            {item.location}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            item.type === 'sightseeing' ? 'bg-blue-100 text-blue-800' :
                            item.type === 'dining' ? 'bg-orange-100 text-orange-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {item.type}
                          </span>
                          <button className="text-surface-400 hover:text-red-500 transition-colors">
                            <ApperIcon name="MoreVertical" className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {itinerary.length === 0 && (
                  <div className="text-center py-12">
                    <ApperIcon name="Calendar" className="w-16 h-16 text-surface-300 mx-auto mb-4" />
                    <p className="text-surface-500">No activities planned yet. Start building your itinerary!</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

export default MainFeature