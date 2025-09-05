import React from 'react';
import { Users, FileText, CheckCircle, Clock, MapPin, TrendingUp, AlertTriangle, Activity, Shield, Database, PlusCircle } from 'lucide-react';
import StatCard from '../components/Dashboard/StatCard';
import AnalyticsChart from '../components/Charts/AnalyticsChart';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Admin stats aligned with UX4G principles (Task-Oriented)
  const adminStats = [
    { title: 'Total FRA Records', value: '12,547', change: { value: '+8.2%', type: 'increase' as const }, icon: FileText, color: 'blue' as const },
    { title: 'Claims Pending Review', value: '2,847', change: { value: '-12.3%', type: 'decrease' as const }, icon: Clock, color: 'yellow' as const },
    { title: 'Claims Approved (Month)', value: '432', change: { value: '+5.1%', type: 'increase' as const }, icon: CheckCircle, color: 'green' as const },
    { title: 'High-Priority Alerts', value: '14', change: { value: '2 new today', type: 'neutral' as const }, icon: AlertTriangle, color: 'red' as const },
  ];

  const beneficiaryStats = [
    { title: 'My Applications', value: '3', icon: FileText, color: 'blue' as const },
    { title: 'Approved Claims', value: '2', icon: CheckCircle, color: 'green' as const },
    { title: 'Eligible Schemes', value: '7', icon: TrendingUp, color: 'purple' as const },
    { title: 'Land Area', value: '4.2 ha', icon: MapPin, color: 'green' as const },
  ];
  
  // Data for charts - simplified for clarity as per UX4G
  const monthlyTrendsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Applications Received',
        data: [450, 520, 480, 600, 750, 680],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Applications Approved',
        data: [380, 420, 390, 510, 580, 620],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };
  
  const claimStatusData = {
    labels: ['Approved', 'Pending', 'Under Review', 'Rejected'],
    datasets: [
      {
        label: 'Claim Status',
        data: [8932, 2847, 1245, 523],
        backgroundColor: ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'],
        borderWidth: 0,
      },
    ],
  };


  const stats = user?.role === 'beneficiary' ? beneficiaryStats : adminStats;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {user?.role === 'beneficiary' ? 'My Dashboard' : 'Administrative Dashboard'}
          </h1>
          <p className="text-gray-500 mt-1">Welcome back, {user?.name}. Here's an overview of the system's status.</p>
        </div>
        {user?.role !== 'beneficiary' && (
             <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors">
                  <PlusCircle size={20} />
                  <span>Add New Record</span>
            </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Dashboard Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column for charts */}
        <div className="lg:col-span-2 space-y-8">
            <AnalyticsChart
              type="line"
              title="Monthly Application Trends"
              data={monthlyTrendsData}
            />
            <AnalyticsChart
              type="bar"
              title="Claim Status Distribution"
              data={claimStatusData}
            />
        </div>
        {/* Right column for actionable items */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center"><Activity className="mr-2"/>Recent System Activity</h3>
                 <ul className="divide-y divide-gray-200 text-sm">
                    <li className="py-2">Admin 'Dr. Priya' updated AI model thresholds. <span className="text-gray-400 text-xs float-right">2 min ago</span></li>
                    <li className="py-2">Employee 'Anil Singh' approved FRA Record #4521. <span className="text-gray-400 text-xs float-right">1 hour ago</span></li>
                    <li className="py-2">System initiated automatic database backup. <span className="text-gray-400 text-xs float-right">3 hours ago</span></li>
                 </ul>
            </div>
             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center"><Shield className="mr-2"/>Security Alerts</h3>
                 <ul className="divide-y divide-gray-200 text-sm">
                    <li className="py-2 text-yellow-700">High number of failed login attempts from IP 192.168.1.1.</li>
                 </ul>
            </div>
             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center"><Database className="mr-2"/>Database Status</h3>
                <p className="text-sm text-gray-600">All systems operational. Last backup completed successfully.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

