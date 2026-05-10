import React, { useState } from 'react';
import { login } from '../api/authApi';
import './Login.css';

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const user = await login({ email, password });
            localStorage.setItem('user', JSON.stringify(user));
            onLoginSuccess(user);
        } catch (err) {
            setError(err.response?.data || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="sticker login-sticker-1">📔</div>
            <div className="sticker login-sticker-2">✏️</div>
            
            <div className="login-card aesthetic-card">
                <div className="login-header">
                    <div className="logo-icon">🎓</div>
                    <h1>Student Tracker</h1>
                    <p>Enter your credentials to access your portal</p>
                </div>

                {error && <div className="login-error">⚠️ {error}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@school.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Authenticating...' : 'Sign In →'}
                    </button>
                </form>

                <div className="login-footer">
                    <p><strong>Demo Admin:</strong> admin@school.com / admin</p>
                    <p><strong>Demo Student:</strong> alice@school.com / student123</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
