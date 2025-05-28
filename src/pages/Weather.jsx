import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import ApperIcon from '../components/ApperIcon'

const Weather = () => {
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchLocation, setSearchLocation] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('New York')
  const [unit, setUnit] = useState('celsius')
  const [favorites, setFavorites] = useState(['New York', 'London', 'Tokyo', 'Paris'])
  const [showMap, setShowMap] = useState(false)

  // Mock weather data with extended information
  const mockWeatherData = {
    current: {
      location: selectedLocation,
      country: 'United States',
      temperature: unit === 'celsius' ? 22 : 72,
      condition: 'Partly Cloudy',
      humidity: 65,
      windSpeed: 12,
      windDirection: 'NW',
      pressure: 1013,
      uvIndex: 6,
      visibility: 10,
      feelsLike: unit === 'celsius' ? 25 : 77,
      dewPoint: unit === 'celsius' ? 15 : 59,
      cloudCover: 45,
      icon: 'PartlyCloudyDay',
      sunrise: '06:45',
      sunset: '19:30',
      moonPhase: 'Waxing Crescent'
    },
    hourly: Array.from({ length: 24 }, (_, i) => ({
      time: `${String(i).padStart(2, '0')}:00`,
      temp: unit === 'celsius' ? 18 + Math.random() * 10 : 64 + Math.random() * 18,
      condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)],
      icon: ['Sun', 'PartlyCloudyDay', 'Cloud', 'CloudRain'][Math.floor(Math.random() * 4)],
      precipitation: Math.random() * 50,
      windSpeed: 5 + Math.random() * 15,
      humidity: 50 + Math.random() * 30
    })),
    daily: Array.from({ length: 10 }, (_, i) => ({
      day: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'long' }),
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString(),
      high: unit === 'celsius' ? 20 + Math.random() * 10 : 68 + Math.random() * 18,
      low: unit === 'celsius' ? 10 + Math.random() * 8 : 50 + Math.random() * 14,
      condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Thunderstorms'][Math.floor(Math.random() * 5)],
      icon: ['Sun', 'PartlyCloudyDay', 'Cloud', 'CloudRain', 'Zap'][Math.floor(Math.random() * 5)],
      precipitation: Math.random() * 80,
      windSpeed: 5 + Math.random() * 20
    })),
    alerts: [
      { type: 'warning', title: 'High UV Index', description: 'UV index will reach 8 today. Use sun protection.', expires: '18:00' },
      { type: 'info', title: 'Rain Expected', description: 'Light rain expected Wednesday afternoon.', expires: 'Wed 15:00' }
    ]
  }

  const fetchWeather = async (location) => {
    setLoading(true)
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Use mock data for demonstration
      const updatedData = {
        ...mockWeatherData,
        current: { ...mockWeatherData.current, location }
      }
      setWeather(updatedData.current)
      setForecast(updatedData)
      setSelectedLocation(location)
      toast.success(`Weather updated for ${location}`)
    } catch (error) {
      toast.error('Failed to fetch weather data')
      console.error('Weather API error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchLocation.trim()) {
      fetchWeather(searchLocation.trim())
      setSearchLocation('')
    }
  }

  const addToFavorites = () => {
    if (!favorites.includes(selectedLocation)) {
      setFavorites([...favorites, selectedLocation])
      toast.success(`${selectedLocation} added to favorites`)
    } else {
      toast.info(`${selectedLocation} is already in favorites`)
    }
  }

  const removeFavorite = (location) => {
    setFavorites(favorites.filter(fav => fav !== location))
    toast.success(`${location} removed from favorites`)
  }

  const toggleUnit = () => {
    setUnit(prev => prev === 'celsius' ? 'fahrenheit' : 'celsius')
    toast.info(`Temperature unit changed to ${unit === 'celsius' ? 'Fahrenheit' : 'Celsius'}`)
  }

  const getWeatherIcon = (iconName) => {
    const iconMap = {
      'Sun': 'Sun',
      'Moon': 'Moon',
      'Cloud': 'Cloud',
      'CloudRain': 'CloudRain',
      'PartlyCloudyDay': 'CloudSun',
      'PartlyCloudyNight': 'CloudMoon',
      'Zap': 'Zap'
    }
    return iconMap[iconName] || 'Sun'
  }

  const getUVIndexLevel = (index) => {
    if (index <= 2) return { level: 'Low', color: 'text-green-600' }
    if (index <= 5) return { level: 'Moderate', color: 'text-yellow-600' }
    if (index <= 7) return { level: 'High', color: 'text-orange-600' }
    if (index <= 10) return { level: 'Very High', color: 'text-red-600' }
    return { level: 'Extreme', color: 'text-purple-600' }
  }

  useEffect(() => {
    fetchWeather(selectedLocation)
  }, [unit])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-soft border-b border-surface-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors duration-200">
                <ApperIcon name="ArrowLeft" className="w-5 h-5" />
                <span className="font-medium">Back to Home</span>
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleUnit}
                className="px-4 py-2 bg-surface-100 hover:bg-surface-200 rounded-lg font-medium transition-colors duration-200"
              >
                °{unit === 'celsius' ? 'C' : 'F'}
              </button>
              <button
                onClick={() => setShowMap(!showMap)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  showMap ? 'bg-primary text-white' : 'bg-surface-100 hover:bg-surface-200'
                }`}
              >
                <ApperIcon name="Map" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Weather Forecast</h1>
          <p className="text-surface-600 text-lg max-w-2xl mx-auto">
            Get detailed weather information for your travel destinations
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <ApperIcon name="MapPin" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-5 h-5" />
              <input
                type="text"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="Search for any city worldwide..."
                className="search-input pl-11"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !searchLocation.trim()}
              className="booking-btn disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <ApperIcon name="Loader2" className="w-5 h-5 animate-spin" />
              ) : (
                <ApperIcon name="Search" className="w-5 h-5" />
              )}
              <span>Search</span>
            </button>
          </form>
        </motion.div>

        {/* Favorites */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Favorite Locations</h3>
            <button
              onClick={addToFavorites}
              className="flex items-center space-x-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors duration-200"
            >
              <ApperIcon name="Heart" className="w-4 h-4" />
              <span>Add Current</span>
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {favorites.map((location, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 px-3 py-2 bg-white rounded-lg shadow-soft border border-surface-100"
              >
                <button
                  onClick={() => fetchWeather(location)}
                  className="text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200"
                >
                  {location}
                </button>
                <button
                  onClick={() => removeFavorite(location)}
                  className="text-surface-400 hover:text-red-500 transition-colors duration-200"
                >
                  <ApperIcon name="X" className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {loading ? (
          <div className="weather-card p-8 text-center">
            <ApperIcon name="Loader2" className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            <h3 className="text-lg font-semibold mb-2">Loading Weather Data</h3>
            <p className="text-surface-600">Fetching latest weather information...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Current Weather - Main Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 weather-card p-6"
            >
              {weather && (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{weather.location}</h2>
                      <p className="text-surface-600">{weather.country}</p>
                      <p className="text-sm text-surface-500">{new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</p>
                    </div>
                    <div className="text-right">
                      <div className="weather-temp text-5xl font-bold text-gray-800 mb-2">
                        {Math.round(weather.temperature)}°
                      </div>
                      <p className="text-lg text-surface-600">{weather.condition}</p>
                      <p className="text-sm text-surface-500">Feels like {Math.round(weather.feelsLike)}°</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="weather-detail p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <ApperIcon name="Droplets" className="w-5 h-5 text-blue-500" />
                        <span className="text-sm text-surface-600">Humidity</span>
                      </div>
                      <p className="text-xl font-bold text-blue-700">{weather.humidity}%</p>
                    </div>

                    <div className="weather-detail p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <ApperIcon name="Wind" className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-surface-600">Wind</span>
                      </div>
                      <p className="text-xl font-bold text-green-700">{weather.windSpeed} km/h</p>
                      <p className="text-xs text-green-600">{weather.windDirection}</p>
                    </div>

                    <div className="weather-detail p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <ApperIcon name="Sun" className="w-5 h-5 text-orange-500" />
                        <span className="text-sm text-surface-600">UV Index</span>
                      </div>
                      <p className={`text-xl font-bold ${getUVIndexLevel(weather.uvIndex).color}`}>
                        {weather.uvIndex}
                      </p>
                      <p className={`text-xs ${getUVIndexLevel(weather.uvIndex).color}`}>
                        {getUVIndexLevel(weather.uvIndex).level}
                      </p>
                    </div>

                    <div className="weather-detail p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <ApperIcon name="Gauge" className="w-5 h-5 text-purple-500" />
                        <span className="text-sm text-surface-600">Pressure</span>
                      </div>
                      <p className="text-xl font-bold text-purple-700">{weather.pressure}</p>
                      <p className="text-xs text-purple-600">hPa</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-3 p-3 bg-surface-50 rounded-lg">
                      <ApperIcon name="Eye" className="w-5 h-5 text-surface-500" />
                      <div>
                        <p className="text-sm text-surface-600">Visibility</p>
                        <p className="font-semibold">{weather.visibility} km</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-surface-50 rounded-lg">
                      <ApperIcon name="CloudDrizzle" className="w-5 h-5 text-surface-500" />
                      <div>
                        <p className="text-sm text-surface-600">Dew Point</p>
                        <p className="font-semibold">{Math.round(weather.dewPoint)}°</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-surface-50 rounded-lg">
                      <ApperIcon name="Cloud" className="w-5 h-5 text-surface-500" />
                      <div>
                        <p className="text-sm text-surface-600">Cloud Cover</p>
                        <p className="font-semibold">{weather.cloudCover}%</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>

            {/* Side Panel */}
            <div className="space-y-6">
              {/* Sun & Moon */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="weather-card p-6"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Sun & Moon</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Sunrise" className="w-5 h-5 text-orange-500" />
                      <span className="text-sm text-surface-600">Sunrise</span>
                    </div>
                    <span className="font-semibold">{weather?.sunrise}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Sunset" className="w-5 h-5 text-orange-600" />
                      <span className="text-sm text-surface-600">Sunset</span>
                    </div>
                    <span className="font-semibold">{weather?.sunset}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Moon" className="w-5 h-5 text-blue-400" />
                      <span className="text-sm text-surface-600">Moon Phase</span>
                    </div>
                    <span className="font-semibold text-sm">{weather?.moonPhase}</span>
                  </div>
                </div>
              </motion.div>

              {/* Weather Alerts */}
              {forecast.alerts && forecast.alerts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="weather-card p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Weather Alerts</h3>
                  <div className="space-y-3">
                    {forecast.alerts.map((alert, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border-l-4 ${
                          alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400 text-yellow-800' :
                          alert.type === 'error' ? 'bg-red-50 border-red-400 text-red-800' :
                          'bg-blue-50 border-blue-400 text-blue-800'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          <ApperIcon 
                            name={alert.type === 'warning' ? 'AlertTriangle' : alert.type === 'error' ? 'AlertCircle' : 'Info'} 
                            className="w-4 h-4 mt-0.5 flex-shrink-0" 
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">{alert.title}</h4>
                            <p className="text-xs opacity-90 mt-1">{alert.description}</p>
                            <p className="text-xs opacity-75 mt-1">Expires: {alert.expires}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* Extended Forecast */}
        {forecast.daily && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 weather-card p-6"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-6">10-Day Forecast</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {forecast.daily.slice(0, 10).map((day, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="weather-day-card p-4 bg-gradient-to-br from-surface-50 to-surface-100 rounded-lg text-center hover:shadow-md transition-all duration-200"
                >
                  <p className="font-semibold text-sm mb-1">{day.day}</p>
                  <p className="text-xs text-surface-600 mb-3">{day.date}</p>
                  <ApperIcon name={getWeatherIcon(day.icon)} className="w-8 h-8 mx-auto mb-3 text-yellow-500" />
                  <p className="text-xs text-surface-600 mb-2">{day.condition}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm">{Math.round(day.high)}°</span>
                    <span className="text-sm text-surface-500">{Math.round(day.low)}°</span>
                  </div>
                  {day.precipitation > 10 && (
                    <div className="flex items-center justify-center space-x-1 mt-2">
                      <ApperIcon name="CloudRain" className="w-3 h-3 text-blue-500" />
                      <span className="text-xs text-blue-600">{Math.round(day.precipitation)}%</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Weather