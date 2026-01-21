import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
// import '../App.css'; 

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
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
            const user = await login(formData.email, formData.password);
            if (user.role === 'admin') navigate('/admin');
            else navigate('/student');
        } catch (error) {
            alert(error.response?.data?.message || 'Login Failed');
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

            <main className="w-full max-w-[1100px] min-h-[680px] flex flex-col md:flex-row shadow-2xl rounded-3xl overflow-hidden m-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                {/* Left Side - Image/Hero */}
                <div className="relative w-full md:w-1/2 overflow-hidden bg-slate-200 dark:bg-slate-800">
                    <img
                        alt="Students sharing a meal and engaging in lively conversation in a stylish campus dining hall"
                        className="absolute inset-0 w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAznwuRYFNJNPx5iKYX-raWVGdOi7AV0ew4-S0qgqJznjpJEJ3Y4767u7tfSHseoOQeGQv7yCphb36xHaR6xsiKEY2a13ko_ZuG4UXCEXkonph9-ko-Md7oqBF9eNE85fAPT1tgWwstK6l2XZ6ZsFcjGEXWc2X8_MnzulrLB3GS7eG2lXHxzJzPIQ9fPfC_IIoeH7ioi4OyLBYCM5j2WFf4rLgRhfwiB5w5i4QEsEwFMMtqAXPFrq102-obcTnbDVgMhK2Nf4g6VGzz"
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
                            <h1 className="text-4xl font-extrabold mb-4 leading-tight">Better Food,<br />Smarter Decisions.</h1>
                            <p className="text-lg text-white/90 font-medium max-w-sm">Join your campus dining community to vote for your favorite meals and track your nutrition.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-3">
                                <img alt="User avatar" className="w-10 h-10 rounded-full border-2 border-white/50" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgpl7dOMc3zL8jxV2jmL-xcq2GITvriBeeuIKrjYhEllMGUo7o4HYtNLuyBu0X2Yxczf4h1_NCkWGumri87XDWxv8sOLFPjzKUxbIzGwpNF0-oAcuOBPzsWtYX4cHRr1vTFJm9sowdOBA3nOaUQfKEJAbmHjTvjBiGaLhycYAnTRglLONMzbCI5rlgabs5XM_vOjPMqeIOd0xdHT3fVQe4worM7IhRsE42l9YqAy08llfshE6aZHbLmPqlpE-BvM3zQmGNVamiSq7M" />
                                <img alt="User avatar" className="w-10 h-10 rounded-full border-2 border-white/50" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5-q1oISiVkwe3TOW8VnDQkrficsLPw4E72kcHe9EDhNoeRxuAeS_DUlJwlat-WrmdDBUpGha2Vwqhujou25sBH6Rlg8FBXKRRBpF8Rf11CcTvdRVHwEtFN-Dq5sPXV_uXTdOsReU5len18cJYAPNnVuE00UnJdGJs_gNsOZJUUyLiXhj1OJTG73RMKxGb3Wc070Yw9eVW0hdPgYfv7UD-0xJv0rBpx8SzbxEmpVI96z72UFNvuHuoHtevJqYin2tCv3BLgJoSGuXD" />
                                <img alt="User avatar" className="w-10 h-10 rounded-full border-2 border-white/50" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeZiDIxYr9Jf1A4msAI3d5vmN7TUkUs86rKip9IWHA584IBP_QwEVl2V7_ImBlzm21KwyQvRtIh-F_hMGyY49we7rFjj4yUulc4-5CCGKNU8zdc6m43zUKQ8caeZ86LK6YdR_msOg1dWQCGa0a7rKfR_UGPm4y-fb-uhw0qq4He77TalFfwXu0dNx8drQoQwMbCFWFLOFaZ19XkBDnVrEqiBEP6G3GVDGWg7nfWiAtczyiw6UEWFu9SXoPtbNsz9aLGzS1TWypclN0" />
                            </div>
                            <span className="text-sm font-medium">Over 2,000 students joined today</span>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white dark:bg-slate-900 transition-colors">
                    <div className="max-w-md mx-auto w-full">
                        <div className="mb-10">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome back</h2>
                            <p className="text-ocean-muted dark:text-slate-400">Please enter your student credentials to continue.</p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
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
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="password">Password</label>
                                    <a className="text-sm font-semibold text-primary hover:underline underline-offset-4" href="#">Forgot Password?</a>
                                </div>
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
                            <div className="flex items-center gap-3 py-2">
                                <input className="w-5 h-5 rounded text-primary focus:ring-primary border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" id="remember" type="checkbox" />
                                <label className="text-sm font-medium text-ocean-muted dark:text-slate-400" htmlFor="remember">Remember me for 30 days</label>
                            </div>
                            <button className="w-full py-4 px-6 bg-primary hover:brightness-110 text-white font-bold rounded-2xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group" type="submit">
                                Login to Dashboard
                                <span className="material-icons-round group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </button>
                        </form>
                        <div className="mt-10 flex items-center justify-center gap-2">
                            <span className="text-ocean-muted dark:text-slate-400">New Student?</span>
                            <Link className="font-bold text-primary hover:underline underline-offset-4" to="/register">Create Account</Link>
                        </div>
                        <div className="mt-12 flex items-center justify-center gap-6 text-xs text-slate-400 dark:text-slate-600 font-medium">
                            <a className="hover:text-primary dark:hover:text-primary transition-colors" href="#">Support</a>
                            <a className="hover:text-primary dark:hover:text-primary transition-colors" href="#">Privacy Policy</a>
                            <a className="hover:text-primary dark:hover:text-primary transition-colors" href="#">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Login;
