import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'

const ItineraryTab = () => {
  const [destination, setDestination] = useState('Paris')
  const [itinerary, setItinerary] = useState([
    { id: 1, time: '09:00', activity: 'Visit Eiffel Tower', location: 'Paris', type: 'sightseeing' },
    { id: 2, time: '14:00', activity: 'Lunch at Café de Flore', location: 'Saint-Germain', type: 'dining' },
    { id: 3, time: '16:30', activity: 'Louvre Museum Tour', location: 'Paris', type: 'culture' }
  ])

  const addItineraryItem = () => {
    const newItem = {
      id: Date.now(),
      time: '10:00',
      activity: 'New Activity',
      location: destination || 'Location',
      type: 'sightseeing'
    }
    setItinerary([...itinerary, newItem])
    toast.success('Activity added to itinerary!')
  }

  return (
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
  )
}

export default ItineraryTab