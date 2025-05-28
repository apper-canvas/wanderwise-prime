import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from './ApperIcon'
import SearchTab from './SearchTab'
import BudgetTab from './BudgetTab'
import ItineraryTab from './ItineraryTab'
import DocumentsTab from './DocumentsTab'

import ReviewsTab from './ReviewsTab'

const MainFeature = () => {
  const [activeTab, setActiveTab] = useState('search')

  const tabs = [
    { id: 'search', label: 'Search & Book', icon: 'Search' },
    { id: 'budget', label: 'Budget Tracker', icon: 'PiggyBank' },
    { id: 'itinerary', label: 'Itinerary', icon: 'Calendar' },
    { id: 'documents', label: 'Documents', icon: 'FileText' },
    { id: 'reviews', label: 'Reviews', icon: 'MessageSquare' }
  ]


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
            Search, book, budget, plan, and review all in one place. Your perfect trip starts here.
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
            {activeTab === 'search' && <SearchTab />}
            {activeTab === 'budget' && <BudgetTab />}
            {activeTab === 'itinerary' && <ItineraryTab />}
            {activeTab === 'documents' && <DocumentsTab />}

            {activeTab === 'reviews' && <ReviewsTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

export default MainFeature