import { Search } from 'lucide-react';

export default function TaskFilters({ filters, onChange }) {
  function setFilter(name, value) {
    onChange({ ...filters, [name]: value });
  }

  return (
    <section className="toolbar" aria-label="Task filters">
      <label className="search-field">
        <Search size={18} />
        <input
          value={filters.search}
          onChange={(event) => setFilter('search', event.target.value)}
          placeholder="Search tasks"
        />
      </label>

      <select value={filters.status} onChange={(event) => setFilter('status', event.target.value)} aria-label="Filter by status">
        <option value="all">All status</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In progress</option>
        <option value="completed">Completed</option>
      </select>

      <select value={filters.priority} onChange={(event) => setFilter('priority', event.target.value)} aria-label="Filter by priority">
        <option value="all">All priority</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <select value={filters.sort} onChange={(event) => setFilter('sort', event.target.value)} aria-label="Sort tasks">
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="dueDate">Due date</option>
        <option value="priority">Priority</option>
      </select>
    </section>
  );
}
