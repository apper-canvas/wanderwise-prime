import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'

const SearchTab = () => {
  const [searchType, setSearchType] = useState('flights')
  const [tripData, setTripData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    passengers: 1
  })

  const searchTypes = [
    { id: 'flights', label: 'Flights', icon: 'Plane' },
    { id: 'hotels', label: 'Hotels', icon: 'Building2' },
    { id: 'transport', label: 'Transport', icon: 'Car' }
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

  return (
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
  )
}

export default SearchTab