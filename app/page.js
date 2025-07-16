'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Search, PlusCircle, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, LogOut, User, Lock, AlertTriangle, Sun, Moon, Mail, Package, Home, Users, BarChart2, ChevronDown, Settings, Camera, AlertCircle, ShoppingCart, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

// --- MOCK DATA & CONFIG ---
const initialProducts = [
  { id: 1, name: 'MacBook Pro 16"', sku: 'MBP16-2023', category: 'Laptops', stock: 15, price: 2499.99, supplier: 'Apple Inc.', dateAdded: '2025-07-01', description: 'The 16-inch MacBook Pro with M3 Pro and M3 Max chips takes power and speed to the next level, whether it’s on battery or plugged in.' },
  { id: 2, name: 'iPhone 15 Pro', sku: 'IP15P-256', category: 'Mobiles', stock: 4, price: 999.00, supplier: 'Apple Inc.', dateAdded: '2025-07-05', description: 'Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and a more versatile Pro camera system.' },
  { id: 3, name: 'Dell XPS 15', sku: 'DXPS15-2023', category: 'Laptops', stock: 25, price: 1899.50, supplier: 'Dell Technologies', dateAdded: '2025-06-15', description: 'Stunning 15.6-inch OLED display, powerful performance with 13th Gen Intel Core processors, and a sleek, premium design.' },
  { id: 4, name: 'Samsung Galaxy S23 Ultra', sku: 'SGS23U-512', category: 'Mobiles', stock: 30, price: 1199.99, supplier: 'Samsung Electronics', dateAdded: '2025-06-20', description: 'Experience the epic standard in mobile with a 200MP camera, our fastest mobile processor ever, and a built-in S Pen.' },
  { id: 5, name: 'Lenovo ThinkPad X1 Carbon', sku: 'LTX1C-G11', category: 'Laptops', stock: 8, price: 1450.00, supplier: 'Lenovo', dateAdded: '2025-05-30', description: 'Ultralight, ultrapowerful, and ultra-durable, the ThinkPad X1 Carbon Gen 11 is the ultimate business laptop.' },
  { id: 6, name: 'Google Pixel 8 Pro', sku: 'GP8P-128', category: 'Mobiles', stock: 2, price: 899.00, supplier: 'Google LLC', dateAdded: '2025-07-10', description: 'The most advanced Pixel camera yet, the new Google Tensor G3 chip, and all-day battery life.' },
  { id: 7, name: 'HP Spectre x360', sku: 'HSX360-14', category: 'Laptops', stock: 18, price: 1249.00, supplier: 'HP Inc.', dateAdded: '2025-04-01', description: 'A convertible PC with a stunning gem-cut design, powerful performance, and advanced security features.' },
  { id: 8, name: 'Razer Blade 15', sku: 'RB15-2023', category: 'Laptops', stock: 12, price: 2100.00, supplier: 'Razer Inc.', dateAdded: '2025-05-20', description: 'The ultimate gaming laptop with NVIDIA GeForce RTX 40 Series graphics and a stunning QHD 240Hz display.' },
  { id: 9, name: 'Logitech MX Master 3S', sku: 'LMXM3S', category: 'Accessories', stock: 50, price: 99.99, supplier: 'Logitech', dateAdded: '2025-06-11', description: 'An iconic mouse, remastered. Experience ultimate comfort and performance with Quiet Clicks and an 8K DPI sensor.' },
  { id: 10, name: 'NVIDIA RTX 4090', sku: 'NV-4090', category: 'Components', stock: 22, price: 1599.00, supplier: 'NVIDIA', dateAdded: '2025-07-02', description: 'The NVIDIA GeForce RTX 4090 is the ultimate GeForce GPU. It brings an enormous leap in performance, efficiency, and AI-powered graphics.' },
];
const initialSuppliers = [
    { id: 1, name: 'Apple Inc.', contactPerson: 'Tim Cook', email: 'tim@apple.com', phone: '1-800-MY-APPLE', productsSupplied: 2 },
    { id: 2, name: 'Dell Technologies', contactPerson: 'Michael Dell', email: 'michael@dell.com', phone: '1-800-BUY-DELL', productsSupplied: 1 },
    { id: 3, name: 'Samsung Electronics', contactPerson: 'H.K. Choi', email: 'sales@samsung.com', phone: '1-800-SAMSUNG', productsSupplied: 1 },
    { id: 4, name: 'Lenovo', contactPerson: 'Yang Yuanqing', email: 'support@lenovo.com', phone: '1-855-2-LENOVO', productsSupplied: 1 },
    { id: 5, name: 'Google LLC', contactPerson: 'Sundar Pichai', email: 'partners@google.com', phone: '1-855-836-3987', productsSupplied: 1 },
    { id: 6, name: 'NVIDIA', contactPerson: 'Jensen Huang', email: 'sales@nvidia.com', phone: '1-800-NVIDIA-AI', productsSupplied: 1 },
];
const LOW_STOCK_THRESHOLD = 5;
const CHART_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

// --- HELPER & UI COMPONENTS ---
const Card = ({ children, className = '' }) => <div className={`bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 transition-all duration-300 ${className}`}>{children}</div>;
const Badge = ({ children, color }) => {
  const colorClasses = { green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300', red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' };
  return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${colorClasses[color]}`}>{children}</span>;
};
const Button = ({ children, onClick, className = '', variant = 'primary', ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg text-sm font-semibold shadow-sm transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:pointer-events-none disabled:transform-none';
  const variantClasses = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 focus:ring-indigo-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };
  return <button onClick={onClick} className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>{children}</button>;
};
const Input = React.forwardRef(({ className = '', icon, ...props }, ref) => (
    <div className="relative">
        {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>}
        <input ref={ref} className={`flex h-10 w-full rounded-lg border border-gray-300 bg-gray-50 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-50 dark:focus:ring-indigo-500 dark:focus:border-indigo-500 ${icon ? 'pl-10' : ''} ${className}`} {...props} />
    </div>
));
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="relative w-full max-w-lg p-4 mx-auto bg-white rounded-xl shadow-2xl dark:bg-gray-800 transform transition-all duration-300 scale-95 opacity-0 animate-scale-in">
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white" id="modal-title">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"><span className="sr-only">Close</span>&times;</button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
};
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end space-x-4"><Button onClick={onClose} variant="secondary" className="px-4 py-2">Cancel</Button><Button onClick={onConfirm} variant="danger" className="px-4 py-2">Confirm</Button></div>
    </Modal>
);
const ThemeToggleButton = ({ theme, toggleTheme }) => (
    <button onClick={toggleTheme} className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Toggle theme">
        {theme === 'dark' ? <Sun className="h-5 w-5 mr-3" /> : <Moon className="h-5 w-5 mr-3" />}
        Toggle Theme
    </button>
);
const Logo = ({ className = '' }) => (
    <div className={`flex items-center space-x-2 ${className}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
            <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v2"/><path d="M21 14v2a2 2 0 0 1-1 1.73l-7 4a2 2 0 0 1-2 0l-7-4A2 2 0 0 1 3 16v-2"/><path d="m3.4 7 8.6 4.9 8.6-4.9"/><path d="M3.4 17 12 12.1 20.6 17"/><path d="M12 22.1V12.1"/>
        </svg>
        <span className="text-xl font-bold text-gray-800 dark:text-white">InvSys</span>
    </div>
);

// --- AUTHENTICATION SCREEN ---
function AuthScreen({ onAuthSuccess, users, addUser, theme, toggleTheme }) {
    const [authMode, setAuthMode] = useState('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const handleLogin = (e) => { e.preventDefault(); setError(''); const user = users.find(u => u.email === email && u.password === password); if (user) { onAuthSuccess(user); } else { setError('Invalid email or password.'); } };
    const handleRegister = (e) => { 
        e.preventDefault(); 
        setError(''); 
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }
        if (users.some(u => u.email === email)) { 
            setError('An account with this email already exists.'); 
            return; 
        } 
        const newUser = {id: Date.now(), name, email, password, profileImage: null}; 
        addUser(newUser); 
        onAuthSuccess(newUser); 
    };
    const toggleMode = () => { setAuthMode(prev => prev === 'login' ? 'register' : 'login'); setError(''); setName(''); setEmail(''); setPassword(''); };
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900">
            <div className="absolute top-4 right-4"><button onClick={toggleTheme} className="p-2 rounded-full text-gray-200 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white"><Sun className="h-5 w-5" /></button></div>
            <div className="w-full max-w-md p-8 space-y-6 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 animate-scale-in">
                <div className="text-center space-y-4"><Logo className="justify-center !text-white" /> <h1 className="text-3xl font-bold text-white">{authMode === 'login' ? 'Welcome Back!' : 'Create an Account'}</h1><p className="mt-2 text-gray-300">{authMode === 'login' ? 'Sign in to manage your inventory.' : 'Get started by creating a new account.'}</p></div>
                <form className="mt-8 space-y-6" onSubmit={authMode === 'login' ? handleLogin : handleRegister}>
                    <div className="space-y-4 rounded-md">
                        {authMode === 'register' && <Input id="name" name="name" type="text" required placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} icon={<User className="h-5 w-5 text-gray-400" />} />}
                        <Input id="email-address" name="email" type="email" required placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Mail className="h-5 w-5 text-gray-400" />} />
                        <Input id="password" name="password" type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} icon={<Lock className="h-5 w-5 text-gray-400" />} />
                    </div>
                    {error && <div className="flex items-center p-3 text-sm text-red-200 bg-red-500/30 rounded-lg" role="alert"><AlertTriangle className="w-5 h-5 mr-2"/><span className="font-medium">{error}</span></div>}
                    <div><Button type="submit" className="w-full px-4 py-2.5">{authMode === 'login' ? 'Sign in' : 'Create Account'}</Button></div>
                </form>
                <p className="mt-4 text-sm text-center text-gray-300">{authMode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}<button onClick={toggleMode} className="font-medium text-indigo-400 hover:text-indigo-300 focus:outline-none">{authMode === 'login' ? 'Register' : 'Sign in'}</button></p>
            </div>
        </div>
    );
}

// --- NAVIGATION & LAYOUT ---
const Navbar = ({ onLogout, theme, toggleTheme, activePage, setActivePage, onSettingsClick, currentUser }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navItems = [ { name: 'Home', icon: Home, page: 'home' }, { name: 'Inventory', icon: Package, page: 'inventory' }, { name: 'Suppliers', icon: Users, page: 'suppliers' }];
    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-8"><Logo /><div className="hidden md:flex space-x-4">{navItems.map(item => (<button key={item.page} onClick={() => setActivePage(item.page)} className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${activePage === item.page ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-white' : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}><item.icon className="mr-2 h-5 w-5" />{item.name}</button>))}</div></div>
                    <div className="relative">
                        <button onClick={() => setIsDropdownOpen(prev => !prev)} className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">{currentUser.name}</span>
                            {currentUser.profileImage ? (
                                <img src={currentUser.profileImage} alt="Profile" className="h-8 w-8 rounded-full object-cover" />
                            ) : (
                                <User className="h-8 w-8 p-1 text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-full" />
                            )}
                            <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5" onMouseLeave={() => setIsDropdownOpen(false)}>
                                <div className="px-4 py-2 border-b dark:border-gray-700"><p className="text-sm font-medium text-gray-900 dark:text-white">{currentUser.name}</p><p className="text-xs text-gray-500 dark:text-gray-400">{currentUser.email}</p></div>
                                <button onClick={() => { onSettingsClick(); setIsDropdownOpen(false); }} className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"><Settings className="mr-3 h-5 w-5" />Profile Settings</button>
                                <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
                                <button onClick={onLogout} className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"><LogOut className="mr-3 h-5 w-5" />Logout</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

// --- PAGES ---
const HomePage = ({ products, suppliers, theme, currentUser }) => {
    const [suggestions, setSuggestions] = useState('');
    const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

    const categoryStock = useMemo(() => {
        const stock = products.reduce((acc, product) => { acc[product.category] = (acc[product.category] || 0) + product.stock; return acc; }, {});
        return Object.entries(stock).map(([name, value]) => ({ name, value }));
    }, [products]);

    const categoryDistribution = useMemo(() => {
        const dist = products.reduce((acc, product) => { acc[product.category] = (acc[product.category] || 0) + 1; return acc; }, {});
        return Object.entries(dist).map(([name, value]) => ({ name, value }));
    }, [products]);

    const productsAddedOverTime = useMemo(() => {
        const sortedProducts = [...products].sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
        const data = sortedProducts.reduce((acc, product) => {
            const date = new Date(product.dateAdded).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            const existingEntry = acc.find(entry => entry.date === date);
            if (existingEntry) {
                existingEntry.count += 1;
            } else {
                acc.push({ date, count: 1 });
            }
            return acc;
        }, []);
        for (let i = 1; i < data.length; i++) {
            data[i].count += data[i - 1].count;
        }
        return data;
    }, [products]);

    const lowStockItems = useMemo(() => products.filter(p => p.stock <= LOW_STOCK_THRESHOLD).sort((a,b) => a.stock - b.stock), [products]);

    const fetchRestockSuggestions = async () => {
        setIsLoadingSuggestions(true);
        setIsSuggestionModalOpen(true);
        const lowStockNames = lowStockItems.map(item => `${item.name} (Stock: ${item.stock})`).join(', ');
        const prompt = `Given the following low-stock electronics inventory items: ${lowStockNames}. Generate a prioritized restock suggestion list. For each item, provide a brief justification for its priority (e.g., 'High Priority - High demand item'). Format the response as a simple, clean list.`;
        
        try {
            const apiKey = ""; // API key is handled by the environment
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });
            const result = await response.json();
            if (result.candidates && result.candidates[0]?.content?.parts[0]?.text) {
                setSuggestions(result.candidates[0].content.parts[0].text);
            } else {
                setSuggestions('Could not generate suggestions at this time.');
            }
        } catch (error) {
            console.error("Error fetching suggestions:", error);
            setSuggestions('An error occurred while fetching suggestions.');
        } finally {
            setIsLoadingSuggestions(false);
        }
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="p-2 text-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border dark:border-gray-700 rounded-md shadow-lg">
                    <p className="label font-bold text-gray-800 dark:text-gray-200">{`${label}`}</p>
                    <p className="intro" style={{color: payload[0].fill || payload[0].stroke}}>{`${payload[0].name} : ${payload[0].value}`}</p>
                </div>
            );
        }
        return null;
    };

    const StatCard = ({ icon, label, value, colorClass }) => {
        const Icon = icon;
        return (
            <Card className="flex items-center p-4 hover:shadow-xl hover:-translate-y-1">
                <div className={`p-3 rounded-full ${colorClass} mr-4`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                </div>
            </Card>
        );
    };

    return (
        <div className="space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {currentUser.name.split(' ')[0]}! 👋</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={Package} label="Total Products" value={products.length} colorClass="bg-blue-500" />
                <StatCard icon={AlertCircle} label="Low Stock" value={lowStockItems.length} colorClass="bg-red-500" />
                <StatCard icon={Users} label="Suppliers" value={suppliers.length} colorClass="bg-green-500" />
                <StatCard icon={ShoppingCart} label="Categories" value={[...new Set(products.map(p => p.category))].length} colorClass="bg-yellow-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Stock by Category</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={categoryStock} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#4A5568' : '#E2E8F0'} />
                            <XAxis dataKey="name" tick={{ fill: theme === 'dark' ? '#A0AEC0' : '#4A5568' }} />
                            <YAxis tick={{ fill: theme === 'dark' ? '#A0AEC0' : '#4A5568' }} />
                            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(128, 138, 224, 0.1)'}}/>
                            <Legend />
                            <Bar dataKey="value" name="Stock Quantity" fill="#8884d8" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
                <Card>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Category Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={categoryDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} label>
                                {categoryDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Product Additions Over Time</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={productsAddedOverTime} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#4A5568' : '#E2E8F0'} />
                            <XAxis dataKey="date" tick={{ fill: theme === 'dark' ? '#A0AEC0' : '#4A5568' }} />
                            <YAxis tick={{ fill: theme === 'dark' ? '#A0AEC0' : '#4A5568' }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line type="monotone" dataKey="count" name="Total Products" stroke="#82ca9d" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
                <Card>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Low Stock Alerts</h3>
                    <div className="space-y-3 overflow-y-auto max-h-[250px] pr-2">
                        {lowStockItems.length > 0 ? lowStockItems.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                                <div>
                                    <p className="font-medium text-gray-800 dark:text-gray-200">{item.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">SKU: {item.sku}</p>
                                </div>
                                <span className="font-bold text-red-500">{item.stock} units</span>
                            </div>
                        )) : <p className="text-sm text-gray-500 dark:text-gray-400">No items with low stock. Great job!</p>}
                    </div>
                    {lowStockItems.length > 0 && (
                        <Button onClick={fetchRestockSuggestions} className="w-full mt-4" disabled={isLoadingSuggestions}>
                            <Sparkles className="h-4 w-4 mr-2" />
                            {isLoadingSuggestions ? 'Generating...' : 'Get Restock Suggestions'}
                        </Button>
                    )}
                </Card>
            </div>
            <Modal isOpen={isSuggestionModalOpen} onClose={() => setIsSuggestionModalOpen(false)} title="✨ AI Restock Suggestions">
                {isLoadingSuggestions ? (
                    <div className="flex justify-center items-center h-40">
                        <p>Generating suggestions...</p>
                    </div>
                ) : (
                    <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{suggestions}</div>
                )}
            </Modal>
        </div>
    );
};
const InventoryPage = ({ products, setProducts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productToDelete, setProductToDelete] = useState(null);
  const itemsPerPage = 6;
  const addProduct = (product) => setProducts(prev => [{ ...product, id: Date.now(), dateAdded: new Date().toISOString().split('T')[0] }, ...prev]);
  const updateProduct = (updatedProduct) => setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  const confirmDeleteProduct = () => { if (productToDelete) { setProducts(prev => prev.filter(p => p.id !== productToDelete.id)); setProductToDelete(null); } };
  const handleOpenModal = (product = null) => { setEditingProduct(product); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setEditingProduct(null); };
  const handleSaveProduct = (product) => { if (editingProduct) updateProduct({ ...editingProduct, ...product }); else addProduct(product); handleCloseModal(); };
  const filteredProducts = useMemo(() => products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase())), [products, searchTerm]);
  const paginatedProducts = useMemo(() => { const start = (currentPage - 1) * itemsPerPage; return filteredProducts.slice(start, start + itemsPerPage); }, [filteredProducts, currentPage, itemsPerPage]);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const handlePageChange = (page) => { if (page >= 1 && page <= totalPages) setCurrentPage(page); };
  return (
    <>
        <Card className="overflow-hidden !p-0">
          <div className="flex flex-col sm:flex-row items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 gap-4">
            <Input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="w-full sm:max-w-xs" icon={<Search className="h-5 w-5 text-gray-400" />} />
            <Button onClick={() => handleOpenModal()} className="w-full sm:w-auto px-5 py-2.5"><PlusCircle className="mr-2 h-5 w-5" />Add Product</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"><tr><th scope="col" className="px-6 py-4">Product Name</th><th scope="col" className="px-6 py-4">SKU</th><th scope="col" className="px-6 py-4">Category</th><th scope="col" className="px-6 py-4 text-center">Stock</th><th scope="col" className="px-6 py-4 text-right">Price</th><th scope="col" className="px-6 py-4 text-center">Status</th><th scope="col" className="px-6 py-4 text-center">Actions</th></tr></thead>
              <tbody>
                {paginatedProducts.map(product => (<tr key={product.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"><td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{product.name}</td><td className="px-6 py-4">{product.sku}</td><td className="px-6 py-4">{product.category}</td><td className="px-6 py-4 text-center font-semibold">{product.stock}</td><td className="px-6 py-4 text-right font-semibold">${product.price.toFixed(2)}</td><td className="px-6 py-4 text-center">{product.stock <= LOW_STOCK_THRESHOLD ? <Badge color="red">Low Stock</Badge> : <Badge color="green">In Stock</Badge>}</td><td className="px-6 py-4 text-center"><div className="flex items-center justify-center space-x-2"><Button onClick={() => handleOpenModal(product)} variant="secondary" className="px-3 py-1 text-xs">Edit</Button><Button onClick={() => setProductToDelete(product)} variant="danger" className="px-3 py-1 text-xs">Delete</Button></div></td></tr>))}
                {paginatedProducts.length === 0 && (<tr><td colSpan="7" className="text-center py-10 text-gray-500 dark:text-gray-400">No products found.</td></tr>)}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (<div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700"><span className="text-sm font-normal text-gray-500 dark:text-gray-400">Showing <span className="font-semibold text-gray-900 dark:text-white">{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredProducts.length)}</span> of <span className="font-semibold text-gray-900 dark:text-white">{filteredProducts.length}</span></span><div className="flex items-center space-x-1"><Button onClick={() => handlePageChange(1)} disabled={currentPage === 1} variant="secondary" className="p-2"><ChevronsLeft className="h-4 w-4" /></Button><Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} variant="secondary" className="p-2"><ChevronLeft className="h-4 w-4" /></Button><span className="text-sm px-2">Page {currentPage} of {totalPages}</span><Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} variant="secondary" className="p-2"><ChevronRight className="h-4 w-4" /></Button><Button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} variant="secondary" className="p-2"><ChevronsRight className="h-4 w-4" /></Button></div></div>)}
        </Card>
        <ProductForm isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveProduct} product={editingProduct} />
        <ConfirmationModal isOpen={!!productToDelete} onClose={() => setProductToDelete(null)} onConfirm={confirmDeleteProduct} title="Confirm Deletion" message={`Are you sure you want to permanently delete "${productToDelete?.name}"? This action cannot be undone.`} />
    </>
  );
};
const SuppliersPage = ({ suppliers, setSuppliers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const addSupplier = (supplier) => setSuppliers(prev => [{ ...supplier, id: Date.now() }, ...prev]);
  const updateSupplier = (updatedSupplier) => setSuppliers(prev => prev.map(s => s.id === updatedSupplier.id ? updatedSupplier : s));
  const confirmDeleteSupplier = () => { if (supplierToDelete) { setSuppliers(prev => prev.filter(s => s.id !== supplierToDelete.id)); setSupplierToDelete(null); } };
  const handleOpenModal = (supplier = null) => { setEditingSupplier(supplier); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setEditingSupplier(null); };
  const handleSaveSupplier = (supplier) => { if (editingSupplier) updateSupplier({ ...editingSupplier, ...supplier }); else addSupplier(supplier); handleCloseModal(); };
  const filteredSuppliers = useMemo(() => suppliers.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.email.toLowerCase().includes(searchTerm.toLowerCase())), [suppliers, searchTerm]);
  return (
    <>
        <Card className="overflow-hidden !p-0">
            <div className="flex flex-col sm:flex-row items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 gap-4">
                <Input type="text" placeholder="Search suppliers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full sm:max-w-xs" icon={<Search className="h-5 w-5 text-gray-400" />} />
                <Button onClick={() => handleOpenModal()} className="w-full sm:w-auto px-5 py-2.5"><PlusCircle className="mr-2 h-5 w-5" />Add Supplier</Button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"><tr><th scope="col" className="px-6 py-4">Supplier Name</th><th scope="col" className="px-6 py-4">Contact Person</th><th scope="col" className="px-6 py-4">Email</th><th scope="col" className="px-6 py-4">Phone</th><th scope="col" className="px-6 py-4 text-center">Actions</th></tr></thead>
                    <tbody>
                        {filteredSuppliers.map(supplier => (<tr key={supplier.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"><td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{supplier.name}</td><td className="px-6 py-4">{supplier.contactPerson}</td><td className="px-6 py-4">{supplier.email}</td><td className="px-6 py-4">{supplier.phone}</td><td className="px-6 py-4 text-center"><div className="flex items-center justify-center space-x-2"><Button onClick={() => handleOpenModal(supplier)} variant="secondary" className="px-3 py-1 text-xs">Edit</Button><Button onClick={() => setSupplierToDelete(supplier)} variant="danger" className="px-3 py-1 text-xs">Delete</Button></div></td></tr>))}
                        {filteredSuppliers.length === 0 && (<tr><td colSpan="5" className="text-center py-10 text-gray-500 dark:text-gray-400">No suppliers found.</td></tr>)}
                    </tbody>
                </table>
            </div>
        </Card>
        <SupplierForm isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveSupplier} supplier={editingSupplier} />
        <ConfirmationModal isOpen={!!supplierToDelete} onClose={() => setSupplierToDelete(null)} onConfirm={confirmDeleteSupplier} title="Confirm Deletion" message={`Are you sure you want to permanently delete supplier "${supplierToDelete?.name}"? This action cannot be undone.`} />
    </>
  );
};

// --- FORM COMPONENTS ---
function ProductForm({ isOpen, onClose, onSave, product }) {
  const [formData, setFormData] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => { 
      if (product) {
          setFormData(product);
      } else {
          setFormData({ name: '', sku: '', category: 'Laptops', stock: 0, price: 0, supplier: '', description: '' });
      }
  }, [product, isOpen]);

  const handleChange = (e) => { 
      const { name, value, type } = e.target; 
      setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value })); 
  };
  
  const handleGenerateDescription = async () => {
      if (!formData.name) {
          alert("Please enter a product name first.");
          return;
      }
      setIsGenerating(true);
      const prompt = `Generate a concise, engaging, and SEO-friendly product description for an electronics product named '${formData.name}'. Include key potential specifications and target audience. Keep it under 60 words.`;
      try {
          const apiKey = ""; // API key is handled by the environment
          const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
          const response = await fetch(apiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
          });
          const result = await response.json();
          if (result.candidates && result.candidates[0]?.content?.parts[0]?.text) {
              setFormData(prev => ({...prev, description: result.candidates[0].content.parts[0].text}));
          }
      } catch (error) {
          console.error("Error generating description:", error);
      } finally {
          setIsGenerating(false);
      }
  };
  
  const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product ? 'Edit Product' : 'Add New Product'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name</label><Input id="name" name="name" type="text" value={formData.name || ''} onChange={handleChange} required /></div>
            <div><label htmlFor="sku" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SKU</label><Input id="sku" name="sku" type="text" value={formData.sku || ''} onChange={handleChange} required /></div>
        </div>
        <div><label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label><select id="category" name="category" value={formData.category || 'Laptops'} onChange={handleChange} className="flex h-10 w-full rounded-lg border border-gray-300 bg-gray-50 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-50 dark:focus:ring-indigo-500"><option>Laptops</option><option>Mobiles</option><option>Accessories</option><option>Components</option></select></div>
        <div>
            <div className="flex justify-between items-center mb-1">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <Button type="button" onClick={handleGenerateDescription} variant="secondary" className="text-xs px-2 py-1" disabled={isGenerating}>
                    <Sparkles className="h-3 w-3 mr-1"/>
                    {isGenerating ? 'Generating...' : 'Generate'}
                </Button>
            </div>
            <textarea id="description" name="description" rows="3" value={formData.description || ''} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50"></textarea>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label htmlFor="stock" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock Quantity</label><Input id="stock" name="stock" type="number" value={formData.stock || 0} onChange={handleChange} min="0" required /></div><div><label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price ($)</label><Input id="price" name="price" type="number" value={formData.price || 0} onChange={handleChange} min="0" step="0.01" required /></div></div>
        <div><label htmlFor="supplier" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Supplier</label><Input id="supplier" name="supplier" type="text" value={formData.supplier || ''} onChange={handleChange} /></div>
        <div className="flex justify-end space-x-3 pt-4"><Button type="button" onClick={onClose} variant="secondary" className="px-4 py-2"><ChevronLeft className="h-4 w-4 mr-2"/>Back</Button><Button type="submit" className="px-4 py-2">{product ? 'Save Changes' : 'Add Product'}</Button></div>
      </form>
    </Modal>
  );
}
function SupplierForm({ isOpen, onClose, onSave, supplier }) {
  const [formData, setFormData] = useState({});
  useEffect(() => { if (supplier) setFormData(supplier); else setFormData({ name: '', contactPerson: '', email: '', phone: '' }); }, [supplier, isOpen]);
  const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
  const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={supplier ? 'Edit Supplier' : 'Add New Supplier'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Supplier Name</label><Input id="name" name="name" type="text" value={formData.name || ''} onChange={handleChange} required /></div>
        <div><label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Person</label><Input id="contactPerson" name="contactPerson" type="text" value={formData.contactPerson || ''} onChange={handleChange} required /></div>
        <div><label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label><Input id="email" name="email" type="email" value={formData.email || ''} onChange={handleChange} required /></div>
        <div><label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label><Input id="phone" name="phone" type="tel" value={formData.phone || ''} onChange={handleChange} required /></div>
        <div className="flex justify-end space-x-3 pt-4"><Button type="button" onClick={onClose} variant="secondary" className="px-4 py-2"><ChevronLeft className="h-4 w-4 mr-2"/>Back</Button><Button type="submit" className="px-4 py-2">{supplier ? 'Save Changes' : 'Add Supplier'}</Button></div>
      </form>
    </Modal>
  );
}
function ProfileSettingsModal({ isOpen, onClose, user, onSave }) {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [profileImage, setProfileImage] = useState(user.profileImage);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProfileImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        let updatedPassword = user.password;

        if (currentPassword || newPassword || confirmPassword) {
            if (currentPassword !== user.password) {
                setError("Current password does not match.");
                return;
            }
            if (newPassword !== confirmPassword) {
                setError("New passwords do not match.");
                return;
            }
            if (newPassword.length < 6) {
                setError("New password must be at least 6 characters long.");
                return;
            }
            updatedPassword = newPassword;
        }

        onSave({ ...user, name, email, password: updatedPassword, profileImage });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Profile Settings">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                        <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                            {profileImage ? (
                                <img src={profileImage} alt="Profile Preview" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-12 h-12 text-gray-500" />
                            )}
                        </div>
                        <label htmlFor="profile-image-upload" className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
                            <Camera className="w-4 h-4" />
                            <input id="profile-image-upload" type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        </label>
                    </div>
                </div>
                <div><label htmlFor="profile-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label><Input id="profile-name" type="text" value={name} onChange={(e) => setName(e.target.value)} /></div>
                <div><label htmlFor="profile-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label><Input id="profile-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                
                <div className="pt-4 border-t dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Change Password</p>
                    <div className="space-y-2 mt-2">
                        <Input type="password" placeholder="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                        <Input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        <Input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                </div>

                {error && <div className="flex items-center p-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-300" role="alert"><AlertTriangle className="w-5 h-5 mr-2"/><span className="font-medium">{error}</span></div>}
                
                <div className="flex justify-end space-x-3 pt-4"><Button type="button" onClick={onClose} variant="secondary" className="px-4 py-2"><ChevronLeft className="h-4 w-4 mr-2"/>Back</Button><Button type="submit" className="px-4 py-2">Save Changes</Button></div>
            </form>
        </Modal>
    );
}

// --- MAIN APP CONTROLLER ---
export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState(() => {
        const savedUsers = localStorage.getItem('users');
        return savedUsers ? JSON.parse(savedUsers) : [{ id: 1, name: 'Admin User', email: 'admin@example.com', password: 'password', profileImage: null }];
    });
    const [products, setProducts] = useState(initialProducts);
    const [suppliers, setSuppliers] = useState(initialSuppliers);
    const [activePage, setActivePage] = useState('home');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') { const savedTheme = localStorage.getItem('theme'); if (savedTheme) return savedTheme; return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
        return 'light';
    });

    useEffect(() => {
        localStorage.setItem('users', JSON.stringify(users));
    }, [users]);

    useEffect(() => { 
        const root = window.document.documentElement; 
        if (theme === 'dark') root.classList.add('dark'); 
        else root.classList.remove('dark'); 
        localStorage.setItem('theme', theme); 
    }, [theme]);
    
    useEffect(() => {
        const loggedInUserId = localStorage.getItem('loggedInUserId');
        if (loggedInUserId) {
            const user = users.find(u => u.id === parseInt(loggedInUserId));
            if (user) {
                handleAuthSuccess(user);
            }
        }
    }, [users]);

    const toggleTheme = () => setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
    const handleAuthSuccess = (user) => { 
        setCurrentUser(user); 
        setIsAuthenticated(true);
        localStorage.setItem('loggedInUserId', user.id);
    };
    const handleLogout = () => { 
        setIsAuthenticated(false); 
        setCurrentUser(null); 
        localStorage.removeItem('loggedInUserId');
    };
    const addUser = (user) => setUsers(prev => [...prev, user]);
    const updateUser = (updatedUser) => { 
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u)); 
        setCurrentUser(updatedUser); 
    };

    const renderPage = () => {
        switch (activePage) {
            case 'home': return <HomePage products={products} suppliers={suppliers} theme={theme} currentUser={currentUser} />;
            case 'inventory': return <InventoryPage products={products} setProducts={setProducts} />;
            case 'suppliers': return <SuppliersPage suppliers={suppliers} setSuppliers={setSuppliers} />;
            default: return <HomePage products={products} suppliers={suppliers} theme={theme} currentUser={currentUser} />;
        }
    };

    return (
        <div className={`bg-gray-100 dark:bg-gray-900 min-h-screen font-sans transition-colors duration-300 ${!isAuthenticated ? 'bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900' : ''}`}>
            <style>{`
                @keyframes scale-in { 
                    from { transform: scale(0.95); opacity: 0; } 
                    to { transform: scale(1); opacity: 1; } 
                }
                .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
            `}</style>
            {isAuthenticated ? (
                <>
                    <Navbar onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} activePage={activePage} setActivePage={setActivePage} onSettingsClick={() => setIsSettingsOpen(true)} currentUser={currentUser} />
                    <main className="container mx-auto p-4 sm:p-6 lg:p-8">{renderPage()}</main>
                    {isSettingsOpen && <ProfileSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} user={currentUser} onSave={updateUser} />}
                </>
            ) : (
                <AuthScreen onAuthSuccess={handleAuthSuccess} users={users} addUser={addUser} theme={theme} toggleTheme={toggleTheme} />
            )}
        </div>
    );
}
