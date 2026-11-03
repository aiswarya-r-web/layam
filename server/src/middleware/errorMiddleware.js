export const notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` })
}

export const errorHandler = (err, req, res, next) => {
  let status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500
  let message = err.message || 'Server error'

  if (err.name === 'CastError') {
    status = 400
    message = 'Invalid ID format'
  } else if (err.code === 11000) {
    status = 409
    message = `${Object.keys(err.keyValue || {}).join(', ')} already exists`
  } else if (err.name === 'ValidationError') {
    status = 400
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ')
  }

  res.status(status).json({ message })
}
