const allowedStatuses = ['pending', 'in-progress', 'completed'];
const allowedPriorities = ['low', 'medium', 'high'];

export function validateTaskPayload(payload, { partial = false } = {}) {
  const errors = {};

  if (!partial || Object.prototype.hasOwnProperty.call(payload, 'title')) {
    const title = String(payload.title ?? '').trim();
    if (!title) {
      errors.title = 'Title is required';
    } else if (title.length < 3) {
      errors.title = 'Title must be at least 3 characters';
    } else if (title.length > 100) {
      errors.title = 'Title cannot exceed 100 characters';
    }
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'description')) {
    const description = String(payload.description ?? '').trim();
    if (description.length > 500) {
      errors.description = 'Description cannot exceed 500 characters';
    }
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'status') && !allowedStatuses.includes(payload.status)) {
    errors.status = 'Status is invalid';
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'priority') && !allowedPriorities.includes(payload.priority)) {
    errors.priority = 'Priority is invalid';
  }

  if (payload.dueDate) {
    const parsed = new Date(payload.dueDate);
    if (Number.isNaN(parsed.getTime())) {
      errors.dueDate = 'Due date is invalid';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
