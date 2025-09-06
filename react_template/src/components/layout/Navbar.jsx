import React, { useState } from 'react';
import { LogOut, User, Settings, Bell, Menu, X, Search, Sun, Moon, Map as MapIcon } from 'lucide-react';
// The import path is corrected to point to the new location of AuthContext
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

const getPageTitle = (pathname) => {
    if (pathname === '/' || pathname === '/dashboard') return 'Dashboard';
    const title = pathname
        .replace('/', '')
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    return title;
};

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isDarkMode, setIsDarkMode] = useState(false);

    const pageTitle = getPageTitle(location.pathname);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        // In a real app, you would also apply a 'dark' class to the html element
        // document.documentElement.classList.toggle('dark');
    };

    return (
        <header className="sticky top-0 z-30 w-full bg-slate-50/80 backdrop-blur-sm border-b border-gray-200 shadow-sm transition-all duration-300">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left side: Logo, Sidebar Toggle & Page Title */}
                    <div className="flex items-center space-x-4">
                        <a href="/dashboard" className="flex items-center space-x-2">
                            <MapIcon className="h-6 w-6 text-green-600" />
                            <span className="font-bold text-lg text-gray-800 hidden sm:block">FRA Atlas</span>
                        </a>
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
                        >
                            <span className="sr-only">Toggle sidebar</span>
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>

                    {/* Center: Page Title */}
                    <h1 className="text-xl font-semibold text-gray-800 hidden md:block">{pageTitle}</h1>

                    {/* Right side: Actions & User Menu */}
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <div className="relative hidden lg:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-48 sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
                            />
                        </div>
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
                        >
                             <span className="sr-only">Toggle theme</span>
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button className="relative p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors">
                            <span className="sr-only">Notifications</span>
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                        </button>
                        <div className="relative group">
                             <button className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-200 transition-colors">
                                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">
                                        {user?.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="hidden md:block text-left">
                                    <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                                </div>
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 invisible group-hover:visible">
                                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    <User size={16} className="mr-2"/> Profile
                                </a>
                                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    <Settings size={16} className="mr-2"/> Settings
                                </a>
                                <hr className="my-1"/>
                                <button
                                    onClick={logout}
                                    className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                    <LogOut size={16} className="mr-2"/> Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;

