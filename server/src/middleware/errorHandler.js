export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
}

export function errorHandler(error, req, res, next) {
  if (error.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid task id' });
  }

  if (error.name === 'ValidationError') {
    const errors = Object.fromEntries(
      Object.entries(error.errors).map(([field, value]) => [field, value.message])
    );
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  console.error(error);
  return res.status(500).json({ message: 'Server error' });
}
