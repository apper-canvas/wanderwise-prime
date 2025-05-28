import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import axios from 'axios'
import ApperIcon from './ApperIcon'

const WeatherTab = () => {
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchLocation, setSearchLocation] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('New York')
  const [unit, setUnit] = useState('celsius')
  const [activeView, setActiveView] = useState('current')

  // Mock weather data for demonstration
  const mockWeatherData = {
    current: {
      location: selectedLocation,
      temperature: unit === 'celsius' ? 22 : 72,
      condition: 'Partly Cloudy',
      humidity: 65,
      windSpeed: 12,
      windDirection: 'NW',
      pressure: 1013,
      uvIndex: 6,
      visibility: 10,
      feelsLike: unit === 'celsius' ? 25 : 77,
      icon: 'PartlyCloudyDay'
    },
    hourly: [
      { time: '12:00', temp: unit === 'celsius' ? 22 : 72, condition: 'Sunny', icon: 'Sun', precipitation: 0 },
      { time: '15:00', temp: unit === 'celsius' ? 25 : 77, condition: 'Partly Cloudy', icon: 'PartlyCloudyDay', precipitation: 10 },
      { time: '18:00', temp: unit === 'celsius' ? 23 : 73, condition: 'Cloudy', icon: 'Cloud', precipitation: 20 },
      { time: '21:00', temp: unit === 'celsius' ? 19 : 66, condition: 'Clear', icon: 'Moon', precipitation: 0 }
    ],
    daily: [
      { day: 'Today', high: unit === 'celsius' ? 25 : 77, low: unit === 'celsius' ? 18 : 64, condition: 'Partly Cloudy', icon: 'PartlyCloudyDay', precipitation: 20 },
      { day: 'Tomorrow', high: unit === 'celsius' ? 27 : 81, low: unit === 'celsius' ? 20 : 68, condition: 'Sunny', icon: 'Sun', precipitation: 0 },
      { day: 'Wednesday', high: unit === 'celsius' ? 24 : 75, low: unit === 'celsius' ? 17 : 63, condition: 'Rainy', icon: 'CloudRain', precipitation: 80 },
      { day: 'Thursday', high: unit === 'celsius' ? 22 : 72, low: unit === 'celsius' ? 15 : 59, condition: 'Cloudy', icon: 'Cloud', precipitation: 30 },
      { day: 'Friday', high: unit === 'celsius' ? 26 : 79, low: unit === 'celsius' ? 19 : 66, condition: 'Sunny', icon: 'Sun', precipitation: 5 }
    ],
    alerts: [
      { type: 'warning', title: 'High UV Index', description: 'UV index will reach 8 today. Use sun protection.' },
      { type: 'info', title: 'Rain Expected', description: 'Light rain expected Wednesday afternoon.' }
    ]
  }

  const fetchWeather = async (location) => {
    setLoading(true)
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Use mock data for demonstration
      setWeather(mockWeatherData.current)
      setForecast(mockWeatherData)
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
      'PartlyCloudyNight': 'CloudMoon'
    }
    return iconMap[iconName] || 'Sun'
  }

  const getUVIndexColor = (index) => {
    if (index <= 2) return 'text-green-600'
    if (index <= 5) return 'text-yellow-600'
    if (index <= 7) return 'text-orange-600'
    if (index <= 10) return 'text-red-600'
    return 'text-purple-600'
  }

  useEffect(() => {
    fetchWeather(selectedLocation)
  }, [unit])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Weather Forecast</h3>
          <p className="text-surface-600">Plan your trip with accurate weather information</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleUnit}
            className="px-4 py-2 bg-surface-100 hover:bg-surface-200 rounded-lg font-medium transition-colors duration-200"
          >
            °{unit === 'celsius' ? 'C' : 'F'}
          </button>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="flex-1 relative">
          <ApperIcon name="MapPin" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-5 h-5" />
          <input
            type="text"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            placeholder="Search for a destination..."
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

      {/* Weather Alerts */}
      {forecast.alerts && forecast.alerts.length > 0 && (
        <div className="space-y-2">
          {forecast.alerts.map((alert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`weather-alert p-4 rounded-xl border-l-4 ${
                alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400 text-yellow-800' :
                alert.type === 'error' ? 'bg-red-50 border-red-400 text-red-800' :
                'bg-blue-50 border-blue-400 text-blue-800'
              }`}
            >
              <div className="flex items-start space-x-3">
                <ApperIcon 
                  name={alert.type === 'warning' ? 'AlertTriangle' : alert.type === 'error' ? 'AlertCircle' : 'Info'} 
                  className="w-5 h-5 mt-0.5 flex-shrink-0" 
                />
                <div>
                  <h4 className="font-semibold">{alert.title}</h4>
                  <p className="text-sm opacity-90">{alert.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* View Tabs */}
      <div className="flex space-x-1 bg-surface-100 rounded-xl p-1">
        {[
          { id: 'current', label: 'Current', icon: 'Sun' },
          { id: 'hourly', label: 'Hourly', icon: 'Clock' },
          { id: 'daily', label: '5-Day', icon: 'Calendar' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeView === tab.id
                ? 'bg-white text-primary shadow-sm'
                : 'text-surface-600 hover:text-surface-800'
            }`}
          >
            <ApperIcon name={tab.icon} className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="weather-card p-8 text-center">
          <ApperIcon name="Loader2" className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-surface-600">Loading weather data...</p>
        </div>
      ) : (
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Current Weather */}
          {activeView === 'current' && weather && (
            <div className="weather-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">{weather.location}</h4>
                  <p className="text-surface-600">Current Weather</p>
                </div>
                <div className="text-right">
                  <div className="weather-temp text-4xl font-bold text-gray-800">
                    {weather.temperature}°
                  </div>
                  <p className="text-surface-600">{weather.condition}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="weather-detail p-4 bg-surface-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <ApperIcon name="Thermometer" className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-surface-600">Feels Like</span>
                  </div>
                  <p className="text-lg font-semibold">{weather.feelsLike}°</p>
                </div>

                <div className="weather-detail p-4 bg-surface-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <ApperIcon name="Droplets" className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-surface-600">Humidity</span>
                  </div>
                  <p className="text-lg font-semibold">{weather.humidity}%</p>
                </div>

                <div className="weather-detail p-4 bg-surface-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <ApperIcon name="Wind" className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-surface-600">Wind</span>
                  </div>
                  <p className="text-lg font-semibold">{weather.windSpeed} km/h</p>
                  <p className="text-xs text-surface-500">{weather.windDirection}</p>
                </div>

                <div className="weather-detail p-4 bg-surface-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <ApperIcon name="Sun" className="w-5 h-5 text-orange-500" />
                    <span className="text-sm text-surface-600">UV Index</span>
                  </div>
                  <p className={`text-lg font-semibold ${getUVIndexColor(weather.uvIndex)}`}>
                    {weather.uvIndex}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Hourly Forecast */}
          {activeView === 'hourly' && forecast.hourly && (
            <div className="weather-card p-6">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Hourly Forecast</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {forecast.hourly.map((hour, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="weather-hour-card p-4 bg-surface-50 rounded-lg text-center"
                  >
                    <p className="text-sm text-surface-600 mb-2">{hour.time}</p>
                    <ApperIcon name={getWeatherIcon(hour.icon)} className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                    <p className="text-lg font-semibold mb-1">{hour.temp}°</p>
                    <p className="text-xs text-surface-600">{hour.condition}</p>
                    {hour.precipitation > 0 && (
                      <div className="flex items-center justify-center space-x-1 mt-2">
                        <ApperIcon name="CloudRain" className="w-3 h-3 text-blue-500" />
                        <span className="text-xs text-blue-600">{hour.precipitation}%</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* 5-Day Forecast */}
          {activeView === 'daily' && forecast.daily && (
            <div className="weather-card p-6">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">5-Day Forecast</h4>
              <div className="space-y-3">
                {forecast.daily.map((day, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="weather-day-card flex items-center justify-between p-4 bg-surface-50 rounded-lg hover:bg-surface-100 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <ApperIcon name={getWeatherIcon(day.icon)} className="w-8 h-8 text-yellow-500" />
                      <div>
                        <p className="font-semibold">{day.day}</p>
                        <p className="text-sm text-surface-600">{day.condition}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {day.precipitation > 0 && (
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="CloudRain" className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-blue-600">{day.precipitation}%</span>
                        </div>
                      )}
                      <div className="text-right">
                        <p className="font-semibold">{day.high}°</p>
                        <p className="text-sm text-surface-600">{day.low}°</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button 
          onClick={() => fetchWeather(selectedLocation)}
          className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 border border-surface-200 rounded-xl hover:bg-surface-50 transition-colors duration-200"
        >
          <ApperIcon name="RefreshCw" className="w-5 h-5" />
          <span>Refresh Weather</span>
        </button>
        <button 
          onClick={() => toast.info('Weather alerts configured successfully')}
          className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 border border-surface-200 rounded-xl hover:bg-surface-50 transition-colors duration-200"
        >
          <ApperIcon name="Bell" className="w-5 h-5" />
          <span>Set Alerts</span>
        </button>
      </div>
    </div>
  )
}

export default WeatherTab