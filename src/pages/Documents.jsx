import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import DocumentsTab from '../components/DocumentsTab'
import ApperIcon from '../components/ApperIcon'

const Documents = () => {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 ${darkMode ? 'dark' : ''}`}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <ApperIcon name="Compass" className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-800">WanderWise</span>
              </Link>
            </motion.div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="nav-link">Home</Link>
              <a href="#" className="nav-link">Destinations</a>
              <a href="#" className="nav-link">My Trips</a>
              <Link to="/documents" className="nav-link text-primary font-semibold">Documents</Link>
              <Link to="/reviews" className="nav-link">Reviews</Link>
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
              >
                <ApperIcon name={darkMode ? 'Sun' : 'Moon'} className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="p-2 rounded-lg hover:bg-surface-100 transition-colors">
                <ApperIcon name="Menu" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Travel Documents
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent block mt-2">
                Management Center
              </span>
            </h1>
            <p className="text-lg md:text-xl text-surface-600 max-w-2xl mx-auto">
              Securely store and manage your important travel documents with automatic expiration reminders
            </p>
          </motion.div>

          {/* Documents Management */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="travel-card p-6 md:p-8"
          >
            <DocumentsTab />
          </motion.div>

          {/* Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="travel-card p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Shield" className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Secure Storage</h3>
              <p className="text-surface-600 text-sm">
                Your documents are encrypted and stored securely with bank-level security
              </p>
            </div>
            
            <div className="travel-card p-6 text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Bell" className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Smart Reminders</h3>
              <p className="text-surface-600 text-sm">
                Get notified 30 days before your documents expire so you never miss renewals
              </p>
            </div>
            
            <div className="travel-card p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Smartphone" className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Access Anywhere</h3>
              <p className="text-surface-600 text-sm">
                Access your documents from any device, anywhere in the world
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="Compass" className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">WanderWise</span>
          </div>
          <p className="text-surface-400">
            &copy; 2024 WanderWise. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Documents