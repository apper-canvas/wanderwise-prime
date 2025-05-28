import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, differenceInDays, parseISO } from 'date-fns'
import ApperIcon from './ApperIcon'

const DocumentsTab = () => {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'US Passport',
      type: 'passport',
      number: 'A12345678',
      expiryDate: '2025-12-15',
      issueDate: '2015-12-15',
      issuingCountry: 'United States',
      file: null,
      notes: 'Primary travel document'
    },
    {
      id: 2,
      name: 'Schengen Visa',
      type: 'visa',
      number: 'SCH987654321',
      expiryDate: '2024-06-30',
      issueDate: '2024-01-15',
      issuingCountry: 'Germany',
      file: null,
      notes: 'Valid for 90 days within 180-day period'
    }
  ])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingDocument, setEditingDocument] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'passport',
    number: '',
    expiryDate: '',
    issueDate: '',
    issuingCountry: '',
    notes: '',
    file: null
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  const documentTypes = [
    { value: 'passport', label: 'Passport', icon: 'BookOpen' },
    { value: 'visa', label: 'Visa', icon: 'Stamp' },
    { value: 'license', label: 'Driver\'s License', icon: 'Car' },
    { value: 'insurance', label: 'Travel Insurance', icon: 'Shield' },
    { value: 'vaccination', label: 'Vaccination Record', icon: 'Syringe' },
    { value: 'other', label: 'Other', icon: 'FileText' }
  ]

  const getDocumentStatus = (expiryDate) => {
    const today = new Date()
    const expiry = parseISO(expiryDate)
    const daysUntilExpiry = differenceInDays(expiry, today)

    if (daysUntilExpiry < 0) {
      return { status: 'expired', label: 'Expired', class: 'status-critical' }
    } else if (daysUntilExpiry <= 7) {
      return { status: 'critical', label: 'Expires Soon', class: 'status-critical' }
    } else if (daysUntilExpiry <= 30) {
      return { status: 'warning', label: 'Expiring Soon', class: 'status-warning' }
    } else {
      return { status: 'valid', label: 'Valid', class: 'status-valid' }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.type || !formData.number || !formData.expiryDate) {
      toast.error('Please fill in all required fields')
      return
    }

    if (editingDocument) {
      setDocuments(prev => prev.map(doc => 
        doc.id === editingDocument.id 
          ? { ...formData, id: editingDocument.id }
          : doc
      ))
      toast.success('Document updated successfully')
      setEditingDocument(null)
    } else {
      const newDocument = {
        ...formData,
        id: Date.now()
      }
      setDocuments(prev => [...prev, newDocument])
      toast.success('Document added successfully')
    }
    
    resetForm()
  }

  const handleEdit = (document) => {
    setFormData({
      name: document.name,
      type: document.type,
      number: document.number,
      expiryDate: document.expiryDate,
      issueDate: document.issueDate,
      issuingCountry: document.issuingCountry,
      notes: document.notes || '',
      file: document.file
    })
    setEditingDocument(document)
    setShowAddForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      setDocuments(prev => prev.filter(doc => doc.id !== id))
      toast.success('Document deleted successfully')
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB')
        return
      }
      setFormData(prev => ({ ...prev, file }))
      toast.success('File uploaded successfully')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'passport',
      number: '',
      expiryDate: '',
      issueDate: '',
      issuingCountry: '',
      notes: '',
      file: null
    })
    setShowAddForm(false)
    setEditingDocument(null)
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.number.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || doc.type === filterType
    return matchesSearch && matchesFilter
  })

  const getExpiringDocuments = () => {
    return documents.filter(doc => {
      const status = getDocumentStatus(doc.expiryDate)
      return status.status === 'warning' || status.status === 'critical'
    })
  }

  const expiringDocuments = getExpiringDocuments()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Travel Documents</h3>
          <p className="text-surface-600">Manage your important travel documents and track expiration dates</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="booking-btn flex items-center space-x-2"
        >
          <ApperIcon name="Plus" className="w-5 h-5" />
          <span>Add Document</span>
        </button>
      </div>

      {/* Expiring Documents Alert */}
      {expiringDocuments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border border-yellow-200 rounded-xl p-4"
        >
          <div className="flex items-start space-x-3">
            <ApperIcon name="AlertTriangle" className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800">Documents Requiring Attention</h4>
              <div className="mt-2 space-y-1">
                {expiringDocuments.map(doc => {
                  const status = getDocumentStatus(doc.expiryDate)
                  const daysLeft = differenceInDays(parseISO(doc.expiryDate), new Date())
                  return (
                    <p key={doc.id} className="text-sm text-yellow-700">
                      <strong>{doc.name}</strong> {daysLeft < 0 ? 'expired' : `expires in ${daysLeft} days`}
                    </p>
                  )
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input pl-10"
            />
          </div>
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-3 rounded-xl border-2 border-surface-200 focus:border-primary focus:outline-none"
        >
          <option value="all">All Types</option>
          {documentTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredDocuments.map((document) => {
            const status = getDocumentStatus(document.expiryDate)
            const documentType = documentTypes.find(type => type.value === document.type)
            
            return (
              <motion.div
                key={document.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="document-card p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <ApperIcon name={documentType?.icon || 'FileText'} className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{document.name}</h4>
                      <p className="text-sm text-surface-600">{documentType?.label}</p>
                    </div>
                  </div>
                  <span className={`document-status ${status.class}`}>
                    {status.label}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-surface-600">Number:</span>
                    <span className="text-sm font-medium">{document.number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-surface-600">Expires:</span>
                    <span className="text-sm font-medium">
                      {format(parseISO(document.expiryDate), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  {document.issuingCountry && (
                    <div className="flex justify-between">
                      <span className="text-sm text-surface-600">Issued by:</span>
                      <span className="text-sm font-medium">{document.issuingCountry}</span>
                    </div>
                  )}
                </div>

                {document.notes && (
                  <p className="text-sm text-surface-600 mb-4 p-3 bg-surface-50 rounded-lg">
                    {document.notes}
                  </p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-surface-100">
                  <button
                    onClick={() => handleEdit(document)}
                    className="flex items-center space-x-1 text-primary hover:text-primary-dark transition-colors"
                  >
                    <ApperIcon name="Edit" className="w-4 h-4" />
                    <span className="text-sm">Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(document.id)}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors"
                  >
                    <ApperIcon name="Trash" className="w-4 h-4" />
                    <span className="text-sm">Delete</span>
                  </button>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <ApperIcon name="FileX" className="w-16 h-16 text-surface-300 mx-auto mb-4" />
          <p className="text-surface-600">No documents found matching your criteria</p>
        </div>
      )}

      {/* Add/Edit Document Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => resetForm()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  {editingDocument ? 'Edit Document' : 'Add New Document'}
                </h3>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Document Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="search-input"
                      placeholder="e.g., US Passport"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Document Type *</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                      className="search-input"
                      required
                    >
                      {documentTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Document Number *</label>
                    <input
                      type="text"
                      value={formData.number}
                      onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                      className="search-input"
                      placeholder="Document number"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Issuing Country</label>
                    <input
                      type="text"
                      value={formData.issuingCountry}
                      onChange={(e) => setFormData(prev => ({ ...prev, issuingCountry: e.target.value }))}
                      className="search-input"
                      placeholder="Country"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
                    <input
                      type="date"
                      value={formData.issueDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, issueDate: e.target.value }))}
                      className="search-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date *</label>
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                      className="search-input"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="search-input resize-none"
                    rows={3}
                    placeholder="Additional notes or details"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Document File</label>
                  <div className="document-upload">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <ApperIcon name="Upload" className="w-8 h-8 text-surface-400 mx-auto mb-2" />
                      <p className="text-surface-600">Click to upload or drag and drop</p>
                      <p className="text-sm text-surface-400 mt-1">PDF, JPG, PNG up to 5MB</p>
                    </label>
                  </div>
                  {formData.file && (
                    <div className="document-preview mt-3">
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="FileText" className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium">{formData.file.name}</span>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, file: null }))}
                          className="text-red-600 hover:text-red-700"
                        >
                          <ApperIcon name="X" className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end space-x-3 pt-6 border-t border-surface-200">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 text-surface-600 hover:text-surface-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="booking-btn"
                  >
                    {editingDocument ? 'Update Document' : 'Add Document'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default DocumentsTab