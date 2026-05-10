import React, { useState, useEffect } from 'react';
import * as taskApi from '../api/taskApi';
import './TaskManager.css';

const PRIORITIES = ['Low', 'Medium', 'High'];
const STATUSES = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FINISHED'];

const priorityClass = (p) => {
    if (!p) return '';
    return p.toLowerCase();
};

const statusLabel = (s) => {
    if (!s) return 'Pending';
    const status = s.toUpperCase();
    if (status === 'FINISHED' || status === 'COMPLETED') return 'Completed';
    if (status === 'IN_PROGRESS') return 'In Progress';
    if (status === 'PENDING') return 'Pending';
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase().replace('_', ' ');
};

const TaskManager = ({ user }) => {
    const isAdmin = user?.role === 'ADMIN';
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({ 
        title: '', 
        description: '', 
        status: 'PENDING', 
        priority: 'Medium',
        dueDate: '',
        studentId: isAdmin ? '' : user?.id
    });
    const [editingId, setEditingId] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formError, setFormError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [filterStudentId, setFilterStudentId] = useState('');

    useEffect(() => {
        loadTasks();
    }, [user, filterStudentId]);

    const loadTasks = async () => {
        try {
            setLoading(true);
            setError('');
            // Backend enforces: GET /tasks (admin) or GET /tasks/{studentId} (student)
            const fetchId = isAdmin ? (filterStudentId || null) : user.id;
            const data = await taskApi.getTasks(fetchId);
            setTasks(data);
        } catch (err) {
            setError('Failed to load tasks. Please ensure the backend is running.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!formData.title.trim()) {
            setFormError('Task title is required.');
            return;
        }

        if (isAdmin && !formData.studentId) {
            setFormError('Student ID is required for task assignment.');
            return;
        }

        try {
            setSubmitting(true);
            const targetStudentId = isAdmin ? formData.studentId : user.id;
            
            if (editingId) {
                await taskApi.updateTask(editingId, formData);
            } else {
                await taskApi.createTask(formData, targetStudentId);
            }
            resetForm();
            loadTasks();
        } catch (err) {
            const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to save task.';
            setFormError(msg);
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (task) => {
        setFormData({
            title: task.title || '',
            description: task.description || '',
            status: task.status || 'PENDING',
            priority: task.priority || 'Medium',
            dueDate: task.dueDate || '',
            studentId: task.student?.id || ''
        });
        setEditingId(task.id);
        setIsFormOpen(true);
        setFormError('');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            await taskApi.deleteTask(id);
            loadTasks();
        } catch (err) {
            alert('Failed to delete task.');
            console.error(err);
        }
    };

    const handleMarkComplete = async (taskId) => {
        try {
            await taskApi.markComplete(taskId);
            loadTasks();
        } catch (err) {
            alert('Failed to mark task as completed.');
            console.error(err);
        }
    };

    const handleUpdateStatus = async (taskId, newStatus) => {
        try {
            await taskApi.updateStatus(taskId, newStatus);
            loadTasks();
        } catch (err) {
            alert('Failed to update task status.');
            console.error(err);
        }
    };

    const resetForm = () => {
        setFormData({ 
            title: '', 
            description: '', 
            status: 'PENDING', 
            priority: 'Medium',
            dueDate: '',
            studentId: isAdmin ? '' : user?.id
        });
        setEditingId(null);
        setIsFormOpen(false);
        setFormError('');
    };

    return (
        <div className="task-manager-container">
            <div className="task-manager-header">
                <div className="header-title">
                    <h2>📋 {isAdmin ? 'Task Administration' : 'My Tasks'}</h2>
                    <p className="subtitle">
                        {isAdmin 
                            ? 'Create, assign and manage student tasks' 
                            : `Logged in as: ${user?.name}. Viewing your assigned tasks.`}
                    </p>
                </div>
                
                <div className="header-actions">
                    {isAdmin && (
                        <>
                            <div className="filter-box">
                                <input 
                                    type="number" 
                                    placeholder="Filter by Student ID..." 
                                    value={filterStudentId}
                                    onChange={(e) => setFilterStudentId(e.target.value)}
                                    className="filter-input"
                                />
                            </div>
                            <button className="btn-primary" onClick={() => { resetForm(); setIsFormOpen(true); }}>
                                + Add Task
                            </button>
                        </>
                    )}
                </div>
            </div>

            {error && (
                <div className="error-alert">
                    ⚠️ {error}
                    <button onClick={loadTasks} className="retry-btn">Retry</button>
                </div>
            )}

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Fetching tasks...</p>
                </div>
            ) : tasks.length === 0 ? (
                <div className="empty-state aesthetic-card">
                    <div className="empty-icon">📭</div>
                    <h3>No tasks found</h3>
                    <p>{isAdmin ? 'No tasks match your filter.' : 'You have no assigned tasks yet.'}</p>
                    {isAdmin && <button className="btn-primary" onClick={() => setIsFormOpen(true)}>Assign First Task</button>}
                </div>
            ) : (
                <div className="tasks-grid">
                    {tasks.map((task) => (
                        <div key={task.id} className={`task-aesthetic-card aesthetic-card ${priorityClass(task.priority)}`}>
                            <div className="task-card-header">
                                <span className={`status-badge ${task.status?.toLowerCase().replace('_', '-')}`}>
                                    {statusLabel(task.status)}
                                </span>
                                <span className={`priority-tag ${priorityClass(task.priority)}`}>
                                    {task.priority || 'Medium'}
                                </span>
                            </div>
                            
                            <div className="task-card-body">
                                <h3>{task.title}</h3>
                                <p className="task-desc">{task.description}</p>
                                {task.dueDate && <div className="task-date">📅 {task.dueDate}</div>}
                                
                                {isAdmin && (
                                    <div className="student-info-tag">
                                        👤 {task.student?.name || 'Unknown'} (ID: {task.student?.id})
                                    </div>
                                )}
                            </div>

                            <div className="task-card-footer">
                                {isAdmin ? (
                                    <div className="admin-actions">
                                        <button className="btn-icon edit" onClick={() => handleEdit(task)} title="Edit Task">✏️</button>
                                        <button className="btn-icon delete" onClick={() => handleDelete(task.id)} title="Delete Task">🗑️</button>
                                    </div>
                                ) : (
                                    <div className="student-actions">
                                        {task.status === 'PENDING' && (
                                            <button 
                                                className="btn-status in-progress" 
                                                onClick={() => handleUpdateStatus(task.id, 'IN_PROGRESS')}
                                            >
                                                ⏳ Start Task
                                            </button>
                                        )}
                                        {task.status !== 'COMPLETED' && (
                                            <button 
                                                className="btn-status complete" 
                                                onClick={() => handleUpdateStatus(task.id, 'COMPLETED')}
                                            >
                                                ✅ Mark Done
                                            </button>
                                        )}
                                        {task.status === 'COMPLETED' && (
                                            <span className="done-label">Finished! 🎉</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isFormOpen && isAdmin && (
                <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && resetForm()}>
                    <div className="modal-content aesthetic-card">
                        <div className="modal-header">
                            <h3>{editingId ? '✏️ Edit Task' : '➕ Add New Task'}</h3>
                            <button className="modal-close" onClick={resetForm}>✕</button>
                        </div>

                        {formError && <div className="form-error">⚠️ {formError}</div>}

                        <form onSubmit={handleSubmit} className="aesthetic-form">
                            <div className="form-group">
                                <label htmlFor="studentId">Student ID *</label>
                                <input
                                    type="number"
                                    id="studentId"
                                    name="studentId"
                                    value={formData.studentId}
                                    onChange={handleInputChange}
                                    placeholder="Enter Student ID to assign"
                                    required
                                    disabled={!!editingId}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="title">Task Name *</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Enter task name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Enter task description"
                                    rows="3"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="priority">Priority</label>
                                    <select id="priority" name="priority" value={formData.priority} onChange={handleInputChange}>
                                        {PRIORITIES.map((p) => (
                                            <option key={p} value={p}>{p}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="status">Status</label>
                                    <select id="status" name="status" value={formData.status} onChange={handleInputChange}>
                                        {STATUSES.map((s) => (
                                            <option key={s} value={s}>{statusLabel(s)}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="dueDate">Due Date</label>
                                <input
                                    type="date"
                                    id="dueDate"
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={resetForm} disabled={submitting}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary" disabled={submitting}>
                                    {submitting ? 'Saving...' : editingId ? 'Update Task' : 'Add Task'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskManager;
