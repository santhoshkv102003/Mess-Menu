import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
    const [showPassword, setShowPassword] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    // Dark mode state check
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        if (document.documentElement.classList.contains('dark')) {
            setIsDark(true);
        }
    }, []);

    const toggleDarkMode = () => {
        document.documentElement.classList.toggle('dark');
        setIsDark(!isDark);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData.name, formData.email, formData.password, formData.role);
            if (formData.role === 'admin') navigate('/admin');
            else navigate('/student');
        } catch (error) {
            alert(error.response?.data?.message || 'Registration Failed');
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center transition-colors duration-300 font-display">
            {/* Dark Mode Toggle */}
            <button
                className="fixed top-6 right-6 p-2 rounded-full bg-white dark:bg-slate-800 shadow-md text-slate-600 dark:text-slate-300 hover:scale-110 transition-all z-50"
                onClick={toggleDarkMode}
            >
                <span className={`material-icons-round ${isDark ? 'hidden' : 'block'}`}>dark_mode</span>
                <span className={`material-icons-round ${isDark ? 'block' : 'hidden'}`}>light_mode</span>
            </button>

            <main className="w-full max-w-[1100px] min-h-[680px] flex flex-col md:flex-row shadow-2xl rounded-3xl overflow-hidden m-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                {/* Left Side - Image/Hero */}
                <div className="relative w-full md:w-1/2 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                        alt="Fresh healthy dining experience"
                        className="absolute inset-0 w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZE3mPWqpF9ajGeovBTd1Ac89zSoLEXBFF1to8MnR_HkXRhRAbLC_dLb7oAGPP9sfp1PnExI-0Rz6QMEVoWJ0_YT3i70AmrYhRU-Szuqwz4tiMEdzEBDLmFCW5ipjyHLYRjyy-yNhNVcdeOkeladS29pPf48ZLSaB2jCCwoas7guucO7wq0pIj_qy3C5jOM5IWbyr1f6jU0dXTrJirnFd9O072TZrrppJVIXAcbCK4covHJWq5-2kyZSwlx3m6z78B-tey2zGLJcEV"
                    />
                    <div className="absolute inset-0 login-image-gradient"></div>
                    <div className="relative h-full flex flex-col justify-between p-10 text-white z-10">
                        <div className="flex items-center gap-2">
                            <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl">
                                <span className="material-icons-round text-white text-3xl">restaurant</span>
                            </div>
                            <span className="text-2xl font-bold tracking-tight">Smart Mess</span>
                        </div>
                        <div>
                            <h1 className="text-4xl font-extrabold mb-4 leading-tight">Join the<br />Community.</h1>
                            <p className="text-lg text-white/90 font-medium max-w-sm">Create your account to start voting for your daily meals.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                                <p className="text-sm font-medium">✨ Student & Admin Access</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white dark:bg-slate-900 transition-colors">
                    <div className="max-w-md mx-auto w-full">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Create Account</h2>
                            <p className="text-slate-500 dark:text-slate-400">Please fill in the details to register.</p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" htmlFor="name">Full Name</label>
                                <div className="relative">
                                    <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">person</span>
                                    <input
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                                        id="name"
                                        type="text"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" htmlFor="email">Email Address</label>
                                <div className="relative">
                                    <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">alternate_email</span>
                                    <input
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                                        id="email"
                                        type="email"
                                        placeholder="student@university.edu"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" htmlFor="password">Password</label>
                                <div className="relative">
                                    <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock_open</span>
                                    <input
                                        className="w-full pl-12 pr-12 py-3.5 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                    <button
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <span className="material-icons-round text-xl">
                                            {showPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" htmlFor="role">Account Type</label>
                                <div className="relative">
                                    <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">badge</span>
                                    <select
                                        className="w-full pl-12 pr-10 py-3.5 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-slate-900 dark:text-white appearance-none cursor-pointer"
                                        id="role"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="student">Student</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                    <span className="material-icons-round absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">expand_more</span>
                                </div>
                            </div>

                            <button className="w-full py-4 px-6 bg-primary hover:opacity-90 text-white font-bold rounded-2xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group mt-2" type="submit">
                                Create Account
                                <span className="material-icons-round group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </button>
                        </form>

                        <div className="mt-8 flex items-center justify-center gap-2">
                            <span className="text-slate-500 dark:text-slate-400">Already have an account?</span>
                            <Link className="font-bold text-primary hover:underline underline-offset-4" to="/login">Login</Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Register;
