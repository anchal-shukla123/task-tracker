import { Calendar, Plus, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { emptyTask, validateTask } from '../utils/taskUtils.js';

export default function TaskForm({ editingTask, onCancel, onSubmit, saving }) {
  const [task, setTask] = useState(emptyTask);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setTask(editingTask || emptyTask);
    setErrors({});
  }, [editingTask]);

  function updateField(name, value) {
    setTask((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateTask(task);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    await onSubmit(task);
    if (!editingTask) {
      setTask(emptyTask);
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <div>
          <p className="eyebrow">{editingTask ? 'Edit task' : 'New task'}</p>
          <h2>{editingTask ? 'Update details' : 'Create a task'}</h2>
        </div>
        {editingTask && (
          <button type="button" className="text-button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>

      <label>
        Title
        <input
          value={task.title}
          onChange={(event) => updateField('title', event.target.value)}
          placeholder="Prepare project report"
          maxLength={100}
        />
        {errors.title && <span className="field-error">{errors.title}</span>}
      </label>

      <label>
        Description
        <textarea
          value={task.description}
          onChange={(event) => updateField('description', event.target.value)}
          placeholder="Add notes, links, or acceptance criteria"
          maxLength={500}
          rows={4}
        />
        {errors.description && <span className="field-error">{errors.description}</span>}
      </label>

      <div className="form-grid">
        <label>
          Status
          <select value={task.status} onChange={(event) => updateField('status', event.target.value)}>
            <option value="pending">Pending</option>
            <option value="in-progress">In progress</option>
            <option value="completed">Completed</option>
          </select>
        </label>

        <label>
          Priority
          <select value={task.priority} onChange={(event) => updateField('priority', event.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
      </div>

      <label>
        Due date
        <span className="date-input">
          <Calendar size={18} />
          <input type="date" value={task.dueDate} onChange={(event) => updateField('dueDate', event.target.value)} />
        </span>
        {errors.dueDate && <span className="field-error">{errors.dueDate}</span>}
      </label>

      <button type="submit" className="primary-button" disabled={saving}>
        {editingTask ? <Save size={18} /> : <Plus size={18} />}
        {saving ? 'Saving...' : editingTask ? 'Save changes' : 'Add task'}
      </button>
    </form>
  );
}
