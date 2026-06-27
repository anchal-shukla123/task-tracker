import Task from '../models/Task.js';
import { validateTaskPayload } from '../utils/validation.js';

function buildQuery({ status, priority, search }) {
  const query = {};

  if (status && status !== 'all') {
    query.status = status;
  }

  if (priority && priority !== 'all') {
    query.priority = priority;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  return query;
}

function buildSort(sort = 'newest') {
  const options = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    dueDate: { dueDate: 1, createdAt: -1 },
    priority: { priority: 1, createdAt: -1 }
  };

  return options[sort] || options.newest;
}

export async function getTasks(req, res, next) {
  try {
    const tasks = await Task.find(buildQuery(req.query)).sort(buildSort(req.query.sort));
    res.json({ data: tasks });
  } catch (error) {
    next(error);
  }
}

export async function getTask(req, res, next) {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    return res.json({ data: task });
  } catch (error) {
    return next(error);
  }
}

export async function createTask(req, res, next) {
  try {
    const validation = validateTaskPayload(req.body);

    if (!validation.isValid) {
      return res.status(400).json({ message: 'Validation failed', errors: validation.errors });
    }

    const task = await Task.create({
      title: req.body.title.trim(),
      description: req.body.description?.trim() || '',
      status: req.body.status || 'pending',
      priority: req.body.priority || 'medium',
      dueDate: req.body.dueDate || null
    });

    return res.status(201).json({ data: task, message: 'Task created' });
  } catch (error) {
    return next(error);
  }
}

export async function updateTask(req, res, next) {
  try {
    const validation = validateTaskPayload(req.body, { partial: true });

    if (!validation.isValid) {
      return res.status(400).json({ message: 'Validation failed', errors: validation.errors });
    }

    const update = { ...req.body };
    if (typeof update.title === 'string') update.title = update.title.trim();
    if (typeof update.description === 'string') update.description = update.description.trim();
    if (Object.prototype.hasOwnProperty.call(update, 'dueDate') && !update.dueDate) {
      update.dueDate = null;
    }

    const task = await Task.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    return res.json({ data: task, message: 'Task updated' });
  } catch (error) {
    return next(error);
  }
}

export async function deleteTask(req, res, next) {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    return res.json({ data: task, message: 'Task deleted' });
  } catch (error) {
    return next(error);
  }
}
