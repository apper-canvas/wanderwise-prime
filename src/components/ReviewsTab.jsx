import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import { format } from 'date-fns'

const ReviewsTab = () => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      serviceType: 'flights',
      serviceName: 'Air France Flight to Paris',
      rating: 4,
      reviewText: 'Great flight experience with excellent service and comfortable seats.',
      photos: ['https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=300&h=200&fit=crop'],
      date: '2024-01-20',
      author: 'John Doe'
    },
    {
      id: 2,
      serviceType: 'hotels',
      serviceName: 'Hotel Luxe Central Paris',
      rating: 5,
      reviewText: 'Amazing hotel with beautiful rooms and perfect location in the city center.',
      photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=200&fit=crop'],
      date: '2024-01-18',
      author: 'Jane Smith'
    }
  ])

  const [showReviewForm, setShowReviewForm] = useState(false)
  const [editingReview, setEditingReview] = useState(null)
  const [filterType, setFilterType] = useState('all')
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
    const photoUrls = files.map(file => URL.createObjectURL(file))
    setNewReview({ ...newReview, photos: [...newReview.photos, ...photoUrls] })
  }

  const removePhoto = (index) => {
    const updatedPhotos = newReview.photos.filter((_, i) => i !== index)
    setNewReview({ ...newReview, photos: updatedPhotos })
  }

  const submitReview = () => {
    if (!newReview.serviceName || !newReview.reviewText) {
      toast.error('Please fill in all required fields')
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
      toast.success('Review submitted successfully!')
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
  }

  const deleteReview = (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
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

  const filteredReviews = filterType === 'all' 
    ? reviews 
    : reviews.filter(review => review.serviceType === filterType)

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Travel Reviews</h3>
          <p className="text-surface-600">Share your experiences and read reviews from other travelers</p>
          <div className="flex items-center space-x-2 mt-2">
            <div className="flex">{renderStars(Math.round(averageRating))}</div>
            <span className="text-lg font-semibold text-gray-800">{averageRating}</span>
            <span className="text-surface-600">({reviews.length} reviews)</span>
          </div>
        </div>
        <button 
          onClick={() => setShowReviewForm(true)} 
          className="booking-btn"
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Write Review
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {serviceTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setFilterType(type.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
              filterType === type.id
                ? 'bg-primary text-white'
                : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
            }`}
          >
            <ApperIcon name={type.icon} className="w-4 h-4" />
            <span>{type.label}</span>
          </button>
        ))}
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
            className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-semibold text-gray-800">
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
                className="text-surface-400 hover:text-surface-600"
              >
                <ApperIcon name="X" className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
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
                    placeholder="e.g., Air France Flight, Hotel Marriott"
                    className="search-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Rating
                </label>
                <div className="flex space-x-1">
                  {renderStars(newReview.rating, true, (rating) => 
                    setNewReview({ ...newReview, rating })
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Your Review *
                </label>
                <textarea
                  value={newReview.reviewText}
                  onChange={(e) => setNewReview({ ...newReview, reviewText: e.target.value })}
                  placeholder="Share your experience..."
                  rows={4}
                  className="search-input resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Photos (Optional)
                </label>
                <div className="border-2 border-dashed border-surface-300 rounded-xl p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <ApperIcon name="Camera" className="w-8 h-8 text-surface-400 mx-auto mb-2" />
                    <p className="text-surface-600">Click to upload photos</p>
                  </label>
                </div>
                
                {newReview.photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {newReview.photos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={photo}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removePhoto(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        >
                          <ApperIcon name="X" className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
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
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <motion.div
            key={review.id}
            className="travel-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-sm font-medium text-surface-500 bg-surface-100 px-2 py-1 rounded">
                    {serviceTypes.find(t => t.id === review.serviceType)?.label}
                  </span>
                  <span className="text-sm text-surface-500">{review.date}</span>
                  <span className="text-sm text-surface-500">by {review.author}</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">{review.serviceName}</h4>
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex">{renderStars(review.rating)}</div>
                  <span className="text-sm text-surface-600">({review.rating}/5)</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => editReview(review)}
                  className="text-primary hover:text-primary-dark transition-colors"
                >
                  <ApperIcon name="Edit" className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteReview(review.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <ApperIcon name="Trash2" className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <p className="text-surface-700 mb-4">{review.reviewText}</p>
            
            {review.photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {review.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Review photo ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <ApperIcon name="MessageSquare" className="w-16 h-16 text-surface-300 mx-auto mb-4" />
          <p className="text-surface-500">
            {filterType === 'all' 
              ? 'No reviews yet. Be the first to share your experience!' 
              : `No ${serviceTypes.find(t => t.id === filterType)?.label.toLowerCase()} reviews yet.`
            }
          </p>
        </div>
      )}
    </div>
  )
}

export default ReviewsTab