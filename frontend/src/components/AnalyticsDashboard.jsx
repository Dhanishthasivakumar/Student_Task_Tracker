import React, { useState, useEffect } from 'react';
import { getProductivity, getTrends, getAdminReport, getAttendance } from '../api/analyticsApi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import './AnalyticsDashboard.css';

const AnalyticsDashboard = ({ studentId: propStudentId }) => {
    const [studentId, setStudentId] = useState(propStudentId || 1);
    const [stats, setStats] = useState(null);
    const [directAttendance, setDirectAttendance] = useState(null);
    const [trends, setTrends] = useState([]);
    const [adminReport, setAdminReport] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (propStudentId) setStudentId(propStudentId);
    }, [propStudentId]);

    useEffect(() => {
        loadData();
    }, [studentId]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [productivityData, trendData, reportData, attendanceData] = await Promise.all([
                getProductivity(studentId),
                getTrends(studentId),
                getAdminReport(),
                getAttendance(studentId)
            ]);

            setStats(productivityData);
            setDirectAttendance(attendanceData);
            console.log(">>> Dashboard: Fetched Direct Attendance:", attendanceData);
            
            // Format trend data for Recharts
            const formattedTrends = Object.entries(trendData.weekly_trends).map(([week, count]) => ({
                name: week,
                completed: count
            }));
            setTrends(formattedTrends);
            
            setAdminReport(reportData);
            setError('');
        } catch (err) {
            setError('Failed to fetch analytics. Ensure Python service is running on port 5000.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading Analytics...</div>;

    return (
        <div className="analytics-container">
            <header className="analytics-header">
                <h2>🧠 Advanced ML Analytics</h2>
                <div className="student-selector">
                    <label>View Student: </label>
                    <select value={studentId} onChange={(e) => setStudentId(e.target.value)}>
                        {adminReport.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>
            </header>

            {error && <div className="error-msg aesthetic-card">⚠️ {error}</div>}

            <div className="stats-grid">
                <div className="stat-card aesthetic-card">
                    <h3>Productivity Score</h3>
                    <div className="score-display">
                        <span className="score-value">{(stats?.productivity_score || 0).toFixed(1)}%</span>
                        <span className={`category-badge ${(stats?.category || 'No Data').toLowerCase().replace(' ', '-')}`}>
                            {stats?.category || 'No Data'}
                        </span>
                    </div>
                </div>

                <div className="stat-card aesthetic-card">
                    <h3>ML Risk Prediction</h3>
                    <div className={`risk-indicator ${stats?.is_at_risk ? 'at-risk' : 'safe'}`}>
                        {stats?.is_at_risk ? '⚠️ High Risk' : '✅ On Track'}
                    </div>
                    <p className="hint">Based on Logistic Regression model</p>
                </div>
            </div>

            <div className="charts-container">
                <div className="chart-box aesthetic-card">
                    <h3>Weekly Completion Trend</h3>
                    {trends.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={trends}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                                <Line type="monotone" dataKey="completed" stroke="var(--text-main)" strokeWidth={4} dot={{ r: 6, fill: 'var(--soft-pink)', stroke: 'var(--text-main)', strokeWidth: 2 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="no-data-msg">No trend data available for this student.</div>
                    )}
                </div>

                <div className="chart-box aesthetic-card">
                    <h3>Class Overview (Admin)</h3>
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Attendance</th>
                                    <th>Tasks</th>
                                    <th>Productivity</th>
                                    <th>Status</th>
                                    <th>Risk</th>
                                </tr>
                            </thead>
                            <tbody>
                                {adminReport && adminReport.length > 0 ? (
                                    adminReport.map(s => (
                                        <tr key={s.id} className={s.id === parseInt(studentId) ? 'active-row' : ''}>
                                            <td>{s.name}</td>
                                            <td>{s.id === parseInt(studentId) ? (directAttendance?.attendance || 0) : (s.attendance || 0)}%</td>
                                            <td>{(s.task_rate || 0).toFixed(0)}%</td>
                                            <td className="bold-cell">{(s.score || 0).toFixed(1)}%</td>
                                            <td>
                                                <span className={`category-tag ${(s.category || 'No Data').toLowerCase().replace(' ', '-')}`}>
                                                    {s.category || 'No Data'}
                                                </span>
                                            </td>
                                            <td>{s.is_at_risk ? '🚩 Risk' : '🟢 Safe'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="6">No student data available.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
