import React, { useState } from 'react';
import { LogOut, User, Settings, Bell, Menu, X, Search, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';

// This interface defines the props that the Header component expects to receive from its parent.
// The error you saw might be because the parent component (App.tsx) wasn't passing these props.
interface HeaderProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
}

// This is a helper function to get the page title from the URL path.
// It's defined outside the component because it doesn't need any component props or state.
const getPageTitle = (pathname: string): string => {
    if (pathname === '/') return 'Dashboard';
    // Takes a path like "/asset-mapping", removes "/", splits it, and capitalizes each word.
    const title = pathname
        .replace('/', '')
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    return title;
};

// The component is defined using React.FC (Functional Component) and it uses the
// HeaderProps interface to type-check its props, preventing errors.
const Header: React.FC<HeaderProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
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
        <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm transition-all duration-300">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left side: Sidebar Toggle & Page Title */}
                    <div className="flex items-center space-x-4">
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                        >
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <h1 className="text-xl font-semibold text-gray-800 hidden md:block">{pageTitle}</h1>
                    </div>

                    {/* Right side: Actions & User Menu */}
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <div className="relative hidden lg:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-48 sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                            />
                        </div>
                        <button 
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                        </button>
                        <div className="relative group">
                             <button className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
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

export default Header;