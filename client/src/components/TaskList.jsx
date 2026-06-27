import { ClipboardList } from 'lucide-react';
import TaskCard from './TaskCard.jsx';

export default function TaskList({ loading, tasks, onDelete, onEdit, onStatusChange }) {
  if (loading) {
    return <div className="empty-state">Loading tasks...</div>;
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <ClipboardList size={36} />
        <h3>No tasks found</h3>
        <p>Create a new task or adjust the filters.</p>
      </div>
    );
  }

  return (
    <section className="task-list" aria-label="Tasks">
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onDelete={onDelete}
          onEdit={onEdit}
          onStatusChange={onStatusChange}
        />
      ))}
    </section>
  );
}
