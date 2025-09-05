import React, { useState } from 'react';
import { Eye, EyeOff, User, Briefcase, Handshake } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Define the RoleButton component to keep the main component clean
interface RoleButtonProps {
  role: 'admin' | 'employee' | 'beneficiary';
  label: string;
  icon: React.ElementType;
  isSelected: boolean;
  onClick: (role: 'admin' | 'employee' | 'beneficiary') => void;
}

const RoleButton: React.FC<RoleButtonProps> = ({ role, label, icon: Icon, isSelected, onClick }) => {
  const selectedClasses = isSelected 
    ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg ring-2 ring-white' 
    : 'bg-white text-gray-800 hover:bg-gray-200 shadow-sm';

  return (
    <button
      type="button"
      className={`flex items-center justify-center space-x-2 w-full p-3 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 ${selectedClasses}`}
      onClick={() => onClick(role)}
    >
      <Icon className="h-4 w-4" />
      <span className="text-sm font-medium tracking-wide">{label}</span>
    </button>
  );
};

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'admin' as 'admin' | 'employee' | 'beneficiary',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleRoleChange = (role: 'admin' | 'employee' | 'beneficiary') => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const success = await login(formData.email, formData.password, formData.role);

    if (!success) {
      setError('Invalid credentials. Use password: demo123');
    }

    setLoading(false);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="1448735-uhd_4096_2160_24fps.mp4"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10" />

      {/* Header */}
      <header className="relative z-20 text-center mb-8">
            <h1 className="text-3xl font-bold text-white tracking-wide">FRA Atlas & WebGIS</h1>
            <p className="text-md text-gray-200 mt-1">Forest Rights Act Decision Support System</p>
            <p className="text-sm text-gray-300 mt-1">Ministry of Tribal Affairs, Government of India</p>
      </header>

      {/* Main Content */}
      <main className="relative z-20 flex flex-col items-center justify-center w-full">
        <div className="max-w-md w-full animate-fadeIn">
          <form className="space-y-6 bg-black bg-opacity-25 p-8 rounded-2xl shadow-2xl border border-white border-opacity-30 backdrop-filter backdrop-blur-md" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Login As
              </label>
              <div className="flex space-x-3">
                <RoleButton
                  role="admin"
                  label="Admin"
                  icon={Briefcase}
                  isSelected={formData.role === 'admin'}
                  onClick={handleRoleChange}
                />
                <RoleButton
                  role="employee"
                  label="Employee"
                  icon={User}
                  isSelected={formData.role === 'employee'}
                  onClick={handleRoleChange}
                />
                <RoleButton
                  role="beneficiary"
                  label="Beneficiary"
                  icon={Handshake}
                  isSelected={formData.role === 'beneficiary'}
                  onClick={handleRoleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:bg-opacity-30 text-white placeholder-gray-300"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-white mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 pr-10 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:bg-opacity-30 text-white placeholder-gray-300"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500 bg-opacity-50 border border-red-400 text-white px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-br from-green-500 to-green-700 text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 focus:ring-offset-black focus:ring-offset-opacity-25 disabled:opacity-60 transition-all duration-300 transform hover:scale-105"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </main>
       {/* Footer Text */}
       <footer className="absolute bottom-6 z-20 w-full text-center">
          <div className="text-xs text-white text-opacity-70 space-y-1">
            <p>Demo Credentials: Use password "demo123" for any email</p>
            <p>Click on the buttons above to select a role</p>
          </div>
       </footer>
    </div>
  );
};

export default LoginForm;

