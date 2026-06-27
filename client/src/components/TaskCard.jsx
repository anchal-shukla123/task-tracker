import { CalendarDays, Check, Edit3, Trash2 } from 'lucide-react';
import { formatDate } from '../utils/taskUtils.js';

const statusLabels = {
  pending: 'Pending',
  'in-progress': 'In progress',
  completed: 'Completed'
};

export default function TaskCard({ task, onDelete, onEdit, onStatusChange }) {
  return (
    <article className={`task-card priority-${task.priority}`}>
      <div className="task-card-header">
        <div>
          <span className={`pill status-${task.status}`}>{statusLabels[task.status]}</span>
          <span className={`pill priority-pill priority-${task.priority}`}>{task.priority}</span>
        </div>
        <div className="card-actions">
          <button type="button" className="icon-button" onClick={() => onEdit(task)} aria-label={`Edit ${task.title}`}>
            <Edit3 size={16} />
          </button>
          <button type="button" className="icon-button danger" onClick={() => onDelete(task._id)} aria-label={`Delete ${task.title}`}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <h3>{task.title}</h3>
      {task.description && <p>{task.description}</p>}

      <div className="task-card-footer">
        <span>
          <CalendarDays size={16} />
          {formatDate(task.dueDate)}
        </span>

        {task.status !== 'completed' && (
          <button type="button" className="complete-button" onClick={() => onStatusChange(task, 'completed')}>
            <Check size={16} />
            Complete
          </button>
        )}
      </div>
    </article>
  );
}
