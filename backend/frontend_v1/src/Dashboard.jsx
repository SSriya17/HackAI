import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/email/logs');
            const data = await response.json();
            setLogs(data);
        } catch (error) {
            console.error("Error fetching logs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const updateStatus = async (logId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:8000/api/email/logs/${logId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (response.ok) {
                setLogs(prev => prev.map(log => log.id === logId ? { ...log, status: newStatus } : log));
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'sent': return '#94a3b8';
            case 'in_review': return '#3b82f6';
            case 'interview': return '#8b5cf6';
            case 'accepted': return '#10b981';
            case 'rejected': return '#ef4444';
            default: return '#94a3b8';
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Application Dashboard</h1>
                <button className="refresh-btn" onClick={fetchLogs}>Refresh Data</button>
            </header>

            <div className="stats-grid">
                <div className="stat-card">
                    <span className="stat-label">Total Emails Sent</span>
                    <span className="stat-value">{logs.length}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Interviews</span>
                    <span className="stat-value">{logs.filter(l => l.status === 'interview').length}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Accepted</span>
                    <span className="stat-value">{logs.filter(l => l.status === 'accepted').length}</span>
                </div>
            </div>

            <div className="logs-table-container">
                <table className="logs-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Professor</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4">Loading applications...</td></tr>
                        ) : logs.length === 0 ? (
                            <tr><td colSpan="4">No applications sent yet.</td></tr>
                        ) : logs.map(log => (
                            <tr key={log.id}>
                                <td>{new Date(log.created_at).toLocaleDateString()}</td>
                                <td>{log.professor_name}</td>
                                <td>
                                    <span
                                        className="status-badge"
                                        style={{ backgroundColor: getStatusColor(log.status) }}
                                    >
                                        {log.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td>
                                    <select
                                        value={log.status}
                                        onChange={(e) => updateStatus(log.id, e.target.value)}
                                        className="status-select"
                                    >
                                        <option value="sent">Sent</option>
                                        <option value="in_review">In Review</option>
                                        <option value="interview">Interview</option>
                                        <option value="accepted">Accepted</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
