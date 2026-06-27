import { useEffect, useMemo, useState } from 'react';
import { ClipboardCheck } from 'lucide-react';
import { createTask, deleteTask, fetchTasks, updateTask } from './api/tasks.js';
import TaskFilters from './components/TaskFilters.jsx';
import TaskForm from './components/TaskForm.jsx';
import TaskList from './components/TaskList.jsx';
import Toast from './components/Toast.jsx';
import { getStats, toFormTask } from './utils/taskUtils.js';

const initialFilters = {
  search: '',
  status: 'all',
  priority: 'all',
  sort: 'newest'
};

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  const stats = useMemo(() => getStats(tasks), [tasks]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadTasks() {
      try {
        setLoading(true);
        setError('');
        const response = await fetchTasks(filters, { signal: controller.signal });
        setTasks(response.data);
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setError(loadError.message);
        }
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
    return () => controller.abort();
  }, [filters]);

  function showToast(message) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2800);
  }

  async function handleSubmit(task) {
    setSaving(true);
    setError('');

    try {
      if (editingTask) {
        const response = await updateTask(editingTask.id, task);
        setTasks((current) => current.map((item) => (item._id === response.data._id ? response.data : item)));
        setEditingTask(null);
        showToast('Task updated');
      } else {
        const response = await createTask(task);
        setTasks((current) => [response.data, ...current]);
        showToast('Task created');
      }
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const shouldDelete = window.confirm('Delete this task?');
    if (!shouldDelete) return;

    try {
      await deleteTask(id);
      setTasks((current) => current.filter((task) => task._id !== id));
      showToast('Task deleted');
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  async function handleStatusChange(task, status) {
    try {
      const response = await updateTask(task._id, { ...toFormTask(task), status });
      setTasks((current) => current.map((item) => (item._id === response.data._id ? response.data : item)));
      showToast('Task completed');
    } catch (statusError) {
      setError(statusError.message);
    }
  }

  function startEdit(task) {
    setEditingTask({ id: task._id, ...toFormTask(task) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <main className="app-shell">
      <Toast message={toast} onClose={() => setToast('')} />

      <header className="app-header">
        <div>
          <p className="eyebrow">MERN Task Tracker</p>
          <h1>Plan, track, and finish work.</h1>
          <p className="header-copy">A full-stack task manager with live CRUD updates, MongoDB persistence, and a responsive React UI.</p>
        </div>
        <div className="brand-mark" aria-hidden="true">
          <ClipboardCheck size={38} />
        </div>
      </header>

      <section className="stats-grid" aria-label="Task summary">
        <div>
          <span>{stats.total}</span>
          <p>Total</p>
        </div>
        <div>
          <span>{stats.pending}</span>
          <p>Pending</p>
        </div>
        <div>
          <span>{stats.inProgress}</span>
          <p>In progress</p>
        </div>
        <div>
          <span>{stats.completed}</span>
          <p>Completed</p>
        </div>
      </section>

      {error && <div className="error-banner">{error}</div>}

      <div className="workspace">
        <TaskForm
          editingTask={editingTask}
          onCancel={() => setEditingTask(null)}
          onSubmit={handleSubmit}
          saving={saving}
        />

        <div className="tasks-panel">
          <TaskFilters filters={filters} onChange={setFilters} />
          <TaskList
            loading={loading}
            tasks={tasks}
            onDelete={handleDelete}
            onEdit={startEdit}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>
    </main>
  );
}
