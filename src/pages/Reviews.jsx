import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import { format } from 'date-fns'

const Reviews = () => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      serviceType: 'flights',
      serviceName: 'Air France Flight to Paris',
      rating: 4,
      reviewText: 'Great flight experience with excellent service and comfortable seats. The crew was friendly and professional throughout the journey.',
      photos: ['https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=300&h=200&fit=crop'],
      date: '2024-01-20',
      author: 'John Doe'
    },
    {
      id: 2,
      serviceType: 'hotels',
      serviceName: 'Hotel Luxe Central Paris',
      rating: 5,
      reviewText: 'Amazing hotel with beautiful rooms and perfect location in the city center. The breakfast was exceptional and the staff went above and beyond.',
      photos: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300&h=200&fit=crop'
      ],
      date: '2024-01-18',
      author: 'Jane Smith'
    },
    {
      id: 3,
      serviceType: 'transport',
      serviceName: 'Uber Premium Paris Airport Transfer',
      rating: 4,
      reviewText: 'Reliable and comfortable transfer service. Driver was punctual and professional.',
      photos: [],
      date: '2024-01-15',
      author: 'Mike Johnson'
    },
    {
      id: 4,
      serviceType: 'activities',
      serviceName: 'Louvre Museum Guided Tour',
      rating: 5,
      reviewText: 'Incredible experience! The guide was knowledgeable and made the art come alive. Highly recommend booking in advance.',
      photos: ['https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop'],
      date: '2024-01-12',
      author: 'Sarah Wilson'
    }
  ])

  const [showReviewForm, setShowReviewForm] = useState(false)
  const [editingReview, setEditingReview] = useState(null)
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [searchTerm, setSearchTerm] = useState('')
  const [newReview, setNewReview] = useState({
    serviceType: 'flights',
    serviceName: '',
    rating: 5,
    reviewText: '',
    photos: []
  })

  const serviceTypes = [
    { id: 'all', label: 'All Services', icon: 'Globe' },
    { id: 'flights', label: 'Flights', icon: 'Plane' },
    { id: 'hotels', label: 'Hotels', icon: 'Building2' },
    { id: 'transport', label: 'Transport', icon: 'Car' },
    { id: 'activities', label: 'Activities', icon: 'MapPin' }
  ]

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + newReview.photos.length > 5) {
      toast.error('You can upload maximum 5 photos')
      return
    }
    const photoUrls = files.map(file => URL.createObjectURL(file))
    setNewReview({ ...newReview, photos: [...newReview.photos, ...photoUrls] })
    toast.success(`${files.length} photo(s) uploaded successfully!`)
  }

  const removePhoto = (index) => {
    const updatedPhotos = newReview.photos.filter((_, i) => i !== index)
    setNewReview({ ...newReview, photos: updatedPhotos })
    toast.info('Photo removed')
  }

  const submitReview = () => {
    if (!newReview.serviceName.trim() || !newReview.reviewText.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    if (newReview.reviewText.length < 10) {
      toast.error('Review text must be at least 10 characters long')
      return
    }

    if (editingReview) {
      setReviews(reviews.map(review => 
        review.id === editingReview.id 
          ? { ...newReview, id: editingReview.id, date: editingReview.date, author: editingReview.author }
          : review
      ))
      toast.success('Review updated successfully!')
      setEditingReview(null)
    } else {
      const review = {
        id: Date.now(),
        ...newReview,
        date: format(new Date(), 'yyyy-MM-dd'),
        author: 'Current User'
      }
      setReviews([review, ...reviews])
      toast.success('Review submitted successfully! Thank you for sharing your experience.')
    }

    setNewReview({
      serviceType: 'flights',
      serviceName: '',
      rating: 5,
      reviewText: '',
      photos: []
    })
    setShowReviewForm(false)
  }

  const editReview = (review) => {
    setNewReview({
      serviceType: review.serviceType,
      serviceName: review.serviceName,
      rating: review.rating,
      reviewText: review.reviewText,
      photos: review.photos
    })
    setEditingReview(review)
    setShowReviewForm(true)
    toast.info('Review loaded for editing')
  }

  const deleteReview = (id) => {
    if (window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      setReviews(reviews.filter(review => review.id !== id))
      toast.success('Review deleted successfully!')
    }
  }

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return Array.from({ length: 5 }, (_, index) => (
      <button
        key={index}
        onClick={() => interactive && onRatingChange && onRatingChange(index + 1)}
        className={`${
          interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
        } transition-transform`}
        disabled={!interactive}
      >
        <ApperIcon
          name="Star"
          className={`w-5 h-5 ${
            index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      </button>
    ))
  }

  // Filter and sort reviews
  let filteredReviews = filterType === 'all' 
    ? reviews 
    : reviews.filter(review => review.serviceType === filterType)

  if (searchTerm) {
    filteredReviews = filteredReviews.filter(review => 
      review.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.reviewText.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  filteredReviews.sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date) - new Date(a.date)
      case 'oldest':
        return new Date(a.date) - new Date(b.date)
      case 'highest':
        return b.rating - a.rating
      case 'lowest':
        return a.rating - b.rating
      default:
        return 0
    }
  })

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 : 0
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
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
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="/" className="nav-link">Home</a>
              <a href="/#destinations" className="nav-link">Destinations</a>
              <a href="/#trips" className="nav-link">My Trips</a>
              <a href="/reviews" className="nav-link text-primary font-semibold">Reviews</a>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Travel Reviews & Ratings
            </h1>
            <p className="text-lg md:text-xl text-surface-600 max-w-3xl mx-auto mb-8">
              Share your experiences and discover what fellow travelers have to say about flights, hotels, and more
            </p>
          </motion.div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="travel-card p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">{reviews.length}</div>
              <div className="text-surface-600">Total Reviews</div>
            </div>
            <div className="travel-card p-6 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="flex">{renderStars(Math.round(averageRating))}</div>
                <span className="text-3xl font-bold text-primary">{averageRating}</span>
              </div>
              <div className="text-surface-600">Average Rating</div>
            </div>
            <div className="travel-card p-6">
              <div className="text-lg font-semibold text-gray-800 mb-3">Rating Distribution</div>
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center space-x-2 mb-1">
                  <span className="text-sm w-2">{rating}</span>
                  <ApperIcon name="Star" className="w-4 h-4 text-yellow-400 fill-current" />
                  <div className="flex-1 bg-surface-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-surface-600 w-8">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="travel-card p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search reviews..."
                    className="search-input pl-10"
                  />
                  <ApperIcon name="Search" className="absolute left-3 top-3 w-5 h-5 text-surface-400" />
                </div>
                
                {/* Filter */}
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="search-input min-w-[140px]"
                >
                  {serviceTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.label}</option>
                  ))}
                </select>
                
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="search-input min-w-[120px]"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="highest">Highest Rated</option>
                  <option value="lowest">Lowest Rated</option>
                </select>
              </div>
              
              <button 
                onClick={() => setShowReviewForm(true)} 
                className="booking-btn whitespace-nowrap"
              >
                <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                Write Review
              </button>
            </div>
          </div>

          {/* Review Form Modal */}
          {showReviewForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-2xl font-semibold text-gray-800">
                    {editingReview ? 'Edit Review' : 'Write a Review'}
                  </h4>
                  <button
                    onClick={() => {
                      setShowReviewForm(false)
                      setEditingReview(null)
                      setNewReview({
                        serviceType: 'flights',
                        serviceName: '',
                        rating: 5,
                        reviewText: '',
                        photos: []
                      })
                    }}
                    className="text-surface-400 hover:text-surface-600 transition-colors"
                  >
                    <ApperIcon name="X" className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Service Type
                      </label>
                      <select
                        value={newReview.serviceType}
                        onChange={(e) => setNewReview({ ...newReview, serviceType: e.target.value })}
                        className="search-input"
                      >
                        {serviceTypes.slice(1).map(type => (
                          <option key={type.id} value={type.id}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Service Name *
                      </label>
                      <input
                        type="text"
                        value={newReview.serviceName}
                        onChange={(e) => setNewReview({ ...newReview, serviceName: e.target.value })}
                        placeholder="e.g., Air France Flight AF123, Hotel Marriott Paris"
                        className="search-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-3">
                      Rating *
                    </label>
                    <div className="flex space-x-1">
                      {renderStars(newReview.rating, true, (rating) => 
                        setNewReview({ ...newReview, rating })
                      )}
                      <span className="ml-3 text-sm text-surface-600">({newReview.rating}/5)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Your Review * (minimum 10 characters)
                    </label>
                    <textarea
                      value={newReview.reviewText}
                      onChange={(e) => setNewReview({ ...newReview, reviewText: e.target.value })}
                      placeholder="Share your experience in detail. What did you like? What could be improved? This helps other travelers make informed decisions."
                      rows={5}
                      className="search-input resize-none"
                    />
                    <div className="text-right text-sm text-surface-500 mt-1">
                      {newReview.reviewText.length} characters
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-3">
                      Photos (Optional - Max 5)
                    </label>
                    <div className="border-2 border-dashed border-surface-300 rounded-xl p-8 text-center hover:border-primary transition-colors">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label htmlFor="photo-upload" className="cursor-pointer">
                        <ApperIcon name="Camera" className="w-12 h-12 text-surface-400 mx-auto mb-3" />
                        <p className="text-lg text-surface-600 mb-2">Upload Photos</p>
                        <p className="text-sm text-surface-500">Drag & drop or click to browse</p>
                        <p className="text-xs text-surface-400 mt-1">JPG, PNG up to 10MB each</p>
                      </label>
                    </div>
                    
                    {newReview.photos.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
                        {newReview.photos.map((photo, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={photo}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => removePhoto(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <ApperIcon name="X" className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-surface-200">
                    <button
                      onClick={submitReview}
                      className="booking-btn flex-1"
                    >
                      {editingReview ? 'Update Review' : 'Submit Review'}
                    </button>
                    <button
                      onClick={() => {
                        setShowReviewForm(false)
                        setEditingReview(null)
                      }}
                      className="px-6 py-3 border border-surface-300 text-surface-600 rounded-xl hover:bg-surface-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {filteredReviews.map((review, index) => (
              <motion.div
                key={review.id}
                className="travel-card p-6 hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="inline-flex items-center space-x-1 text-sm font-medium text-surface-500 bg-surface-100 px-3 py-1 rounded-full">
                        <ApperIcon name={serviceTypes.find(t => t.id === review.serviceType)?.icon || 'Globe'} className="w-3 h-3" />
                        <span>{serviceTypes.find(t => t.id === review.serviceType)?.label}</span>
                      </span>
                      <span className="text-sm text-surface-500">{format(new Date(review.date), 'MMM dd, yyyy')}</span>
                      <span className="text-sm text-surface-500">by {review.author}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">{review.serviceName}</h3>
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="text-sm font-medium text-surface-600">({review.rating}/5)</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => editReview(review)}
                      className="p-2 text-primary hover:text-primary-dark hover:bg-primary/10 rounded-lg transition-colors"
                      title="Edit review"
                    >
                      <ApperIcon name="Edit" className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteReview(review.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red/10 rounded-lg transition-colors"
                      title="Delete review"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-surface-700 leading-relaxed mb-4">{review.reviewText}</p>
                
                {review.photos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {review.photos.map((photo, photoIndex) => (
                      <img
                        key={photoIndex}
                        src={photo}
                        alt={`Review photo ${photoIndex + 1}`}
                        className="w-full h-32 object-cover rounded-lg hover:scale-105 transition-transform cursor-pointer"
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {filteredReviews.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <ApperIcon name="MessageSquare" className="w-20 h-20 text-surface-300 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {searchTerm ? 'No reviews found' : filterType === 'all' 
                  ? 'No reviews yet' 
                  : `No ${serviceTypes.find(t => t.id === filterType)?.label.toLowerCase()} reviews yet`
                }
              </h3>
              <p className="text-surface-500 mb-6">
                {searchTerm 
                  ? 'Try adjusting your search terms or filters'
                  : 'Be the first to share your travel experience!'
                }
              </p>
              {!searchTerm && (
                <button 
                  onClick={() => setShowReviewForm(true)} 
                  className="booking-btn"
                >
                  <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                  Write First Review
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Reviews