import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center px-4">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
            <ApperIcon name="MapPin" className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Destination Not Found</h2>
          <p className="text-surface-600 mb-8 max-w-md mx-auto">
            Looks like you've wandered off the beaten path. Let's get you back to exploring amazing destinations.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link 
            to="/" 
            className="booking-btn inline-flex items-center space-x-2"
          >
            <ApperIcon name="Home" className="w-5 h-5" />
            <span>Return Home</span>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound