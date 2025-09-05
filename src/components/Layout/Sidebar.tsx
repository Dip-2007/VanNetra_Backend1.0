import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Map, 
  BarChart3, 
  FileText, 
  Users, 
  Satellite, 
  Brain, 
  Settings, 
  Home,
  ClipboardList,
  MapPin
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const adminLinks = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/atlas', icon: Map, label: 'FRA Atlas' },
    { to: '/records', icon: FileText, label: 'FRA Records' },
    { to: '/asset-mapping', icon: Satellite, label: 'Asset Mappin' },
    { to: '/dss', icon: Brain, label: 'Decision Support' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/users', icon: Users, label: 'User Management' },
    { to: '/settings', icon: Settings, label: 'System Management' },
  ];

  const beneficiaryLinks = [
    { to: '/dashboard', icon: Home, label: 'My Dashboard' },
    { to: '/my-land', icon: MapPin, label: 'My Land' },
    { to: '/schemes', icon: ClipboardList, label: 'Eligible Schemes' },
    { to: '/status', icon: FileText, label: 'Application Status' },
  ];

  const links = user?.role === 'beneficiary' ? beneficiaryLinks : adminLinks;

  return (
    <aside className="bg-gray-900 text-white w-64 min-h-screen flex flex-col">
      <div className="flex items-center justify-center h-16 bg-gray-800 border-b border-gray-700">
        <span className="text-lg font-semibold">
          {user?.role === 'beneficiary' ? 'Beneficiary Portal' : 'Admin Portal'}
        </span>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <link.icon className="h-5 w-5" />
            <span className="font-medium">{link.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <div className="text-xs text-gray-400">
          <p>Version 1.0</p>
          <p>Ministry of Tribal Affairs</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;