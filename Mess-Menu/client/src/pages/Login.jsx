import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await login(formData.email, formData.password);
            if (user.role === 'admin') navigate('/admin');
            else navigate('/student');
        } catch (error) {
            alert('Login Failed');
        }
    };

    return (
        <div className="auth-container page-transition">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Smart Mess Login</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Welcome back, please login to your account</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="form-input"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="form-input"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        Login to Dashboard
                    </button>
                    <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                        <Link to="/register" className="auth-link" style={{ color: 'var(--primary)' }}>
                            New Student? <span style={{ textDecoration: 'underline' }}>Create Account</span>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
