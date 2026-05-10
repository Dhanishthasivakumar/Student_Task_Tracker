import React, { useState, useEffect } from 'react';
import * as taskApi from '../api/taskApi';
import './OverviewDashboard.css';

const OverviewDashboard = ({ onNavigate }) => {
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const tasks = await taskApi.getTasks();
                const total = tasks.length;
                const pending = tasks.filter(t => t.status === 'PENDING').length;
                const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length;
                const completed = tasks.filter(t => t.status === 'FINISHED' || t.status === 'COMPLETED').length;
                setStats({ total, pending, inProgress, completed });
            } catch (err) {
                console.error('Failed to fetch stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="loading">Loading Dashboard...</div>;

    return (
        <div className="dashboard-overview">
            <div className="welcome-banner">
                <h2>System Overview</h2>
                <p>Welcome to the Administrative Dashboard. Here is the current status of all student tasks.</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card total aesthetic-card">
                    <span className="card-sticker">📊</span>
                    <h3>Total Tasks</h3>
                    <div className="stat-value">{stats.total}</div>
                </div>
                <div className="stat-card pending aesthetic-card">
                    <span className="card-sticker">⏳</span>
                    <h3>Pending</h3>
                    <div className="stat-value">{stats.pending}</div>
                </div>
                <div className="stat-card progress aesthetic-card">
                    <span className="card-sticker">🚀</span>
                    <h3>In Progress</h3>
                    <div className="stat-value">{stats.inProgress}</div>
                </div>
                <div className="stat-card completed aesthetic-card">
                    <span className="card-sticker">✅</span>
                    <h3>Completed</h3>
                    <div className="stat-value">{stats.completed}</div>
                </div>
            </div>

            <div className="quick-actions aesthetic-card">
                <h3>Quick Navigation</h3>
                <div className="action-buttons">
                    <button className="nav-action-btn" onClick={onNavigate}>
                        <span className="icon">📋</span>
                        <div className="text">
                            <strong>Manage Tasks</strong>
                            <p>View all assignments and create new tasks</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OverviewDashboard;
