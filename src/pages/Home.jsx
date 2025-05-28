import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'


const Home = () => {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const features = [
    {
      icon: 'Plane',
      title: 'Smart Booking',
      description: 'Book flights, hotels, and transport with AI-powered recommendations'
    },
    {
      icon: 'Calendar',
      title: 'Trip Planning',
      description: 'Create detailed itineraries with drag-and-drop scheduling'
    },
    {
      icon: 'PiggyBank',
      title: 'Budget Tracking',
      description: 'Monitor expenses and stay within your travel budget'
    },
    {
      icon: 'MapPin',
      title: 'Local Discovery',
      description: 'Discover attractions, restaurants, and hidden gems'
    }
  ]

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
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

              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Compass" className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">WanderWise</span>
            </motion.div>
            
              <Link to="/weather" className="nav-link flex items-center space-x-1">
                <ApperIcon name="CloudSun" className="w-5 h-5" />
                <span>Weather</span>
              </Link>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="nav-link">Destinations</a>
              <a href="#" className="nav-link">My Trips</a>
              <a href="/documents" className="nav-link">Documents</a>

              <a href="/reviews" className="nav-link">Reviews</a>

              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
              >
                <ApperIcon name={darkMode ? 'Sun' : 'Moon'} className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-gray-800 mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Plan Your Perfect
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent block mt-2">
                Travel Adventure
              </span>
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-surface-600 max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Book flights, hotels, and experiences while keeping track of your budget and creating unforgettable itineraries
            </motion.p>
          </div>

          {/* Features Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="travel-card p-6 text-center group hover:border-primary/20"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <ApperIcon name={feature.icon} className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-surface-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Main Feature Component */}
      <MainFeature />

      {/* Footer */}
      <footer className="bg-surface-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <ApperIcon name="Compass" className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">WanderWise</span>
              </div>
              <p className="text-surface-400 mb-4">
                Your intelligent travel companion for planning, booking, and experiencing amazing adventures worldwide.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-surface-400">
                <li><a href="#" className="hover:text-white transition-colors">Destinations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">My Trips</a></li>
                <li><a href="/documents" className="hover:text-white transition-colors">Documents</a></li>

                <li><a href="/reviews" className="hover:text-white transition-colors">Reviews</a></li>

              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-surface-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-surface-800 mt-8 pt-8 text-center text-surface-400">
            <p>&copy; 2024 WanderWise. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home