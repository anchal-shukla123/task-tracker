export const emptyTask = {
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  dueDate: ''
};

export function validateTask(task) {
  const errors = {};
  const title = task.title.trim();
  const description = task.description.trim();

  if (!title) {
    errors.title = 'Title is required';
  } else if (title.length < 3) {
    errors.title = 'Title must be at least 3 characters';
  } else if (title.length > 100) {
    errors.title = 'Title cannot exceed 100 characters';
  }

  if (description.length > 500) {
    errors.description = 'Description cannot exceed 500 characters';
  }

  if (task.dueDate) {
    const parsed = new Date(task.dueDate);
    if (Number.isNaN(parsed.getTime())) {
      errors.dueDate = 'Choose a valid due date';
    }
  }

  return errors;
}

export function toFormTask(task) {
  return {
    title: task.title,
    description: task.description || '',
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate ? task.dueDate.slice(0, 10) : ''
  };
}

export function formatDate(value) {
  if (!value) return 'No due date';
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(value));
}

export function getStats(tasks) {
  return {
    total: tasks.length,
    pending: tasks.filter((task) => task.status === 'pending').length,
    inProgress: tasks.filter((task) => task.status === 'in-progress').length,
    completed: tasks.filter((task) => task.status === 'completed').length
  };
}
