import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData.name, formData.email, formData.password, formData.role);
            if (formData.role === 'admin') navigate('/admin');
            else navigate('/student');
        } catch (error) {
            alert('Registration Failed');
        }
    };

    return (
        <div className="auth-container page-transition">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Create Account</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Join the mess management system</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Full Name"
                            className="form-input"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="form-input"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Password"
                            className="form-input"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <select
                            className="form-input"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            style={{ cursor: 'pointer' }}
                        >
                            <option value="student">Student</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        Register Now
                    </button>
                    <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                        <Link to="/login" className="auth-link" style={{ color: 'var(--text-muted)' }}>
                            Already have an account? <span style={{ color: 'var(--primary)' }}>Login</span>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
