import { useState } from 'react';

const Sidebar = ({ 
  layers, 
  onToggleLayer, 
  onFilterChange,
  activeFilters,
  activeLayers,
  isOpen,
  toggleSidebar
}) => {
  const [expandedSection, setExpandedSection] = useState('layers');

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const layerTypes = [
    { id: 'fraRecords', label: 'FRA Records', color: 'bg-blue-500' },
    { id: 'forestCover', label: 'Forest Cover', color: 'bg-green-600' },
    { id: 'waterBodies', label: 'Water Bodies', color: 'bg-blue-400' },
    { id: 'villages', label: 'Villages', color: 'bg-orange-400' },
  ];

  const filterOptions = {
    state: ['All States', 'Maharashtra', 'Chhattisgarh', 'Odisha'],
    claimType: ['All Types', 'Individual Forest Rights', 'Community Forest Rights', 'Community Forest Resource Rights'],
    claimStatus: ['All Statuses', 'Approved', 'Pending', 'Rejected']
  };

  return (
    <div className={`bg-white shadow-lg h-full transition-all duration-300 ${isOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
      <div className="flex justify-between items-center p-3 border-b border-gray-200">
        <h2 className="font-semibold text-green-800">Map Controls</h2>
        <button 
          onClick={toggleSidebar}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M15.707 4.293a1 1 0 010 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 64px)' }}>
        {/* Layers Section */}
        <div className="mb-6">
          <button 
            className="flex justify-between items-center w-full text-left font-medium text-gray-700 mb-2"
            onClick={() => toggleSection('layers')}
          >
            <span>Layers</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-4 w-4 transition-transform ${expandedSection === 'layers' ? 'transform rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {expandedSection === 'layers' && (
            <div className="pl-2 space-y-2 animate-in fade-in duration-200">
              {layerTypes.map(layer => (
                <div key={layer.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`layer-${layer.id}`}
                    checked={activeLayers.includes(layer.id)}
                    onChange={() => onToggleLayer(layer.id)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`layer-${layer.id}`} className="ml-2 text-sm text-gray-700 flex items-center">
                    <span className={`inline-block w-3 h-3 mr-2 rounded-sm ${layer.color}`}></span>
                    {layer.label}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filters Section */}
        <div className="mb-6">
          <button 
            className="flex justify-between items-center w-full text-left font-medium text-gray-700 mb-2"
            onClick={() => toggleSection('filters')}
          >
            <span>Filters</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-4 w-4 transition-transform ${expandedSection === 'filters' ? 'transform rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {expandedSection === 'filters' && (
            <div className="pl-2 space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <select
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  value={activeFilters.state || 'All States'}
                  onChange={(e) => onFilterChange('state', e.target.value)}
                >
                  {filterOptions.state.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Claim Type</label>
                <select
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  value={activeFilters.claimType || 'All Types'}
                  onChange={(e) => onFilterChange('claimType', e.target.value)}
                >
                  {filterOptions.claimType.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  value={activeFilters.claimStatus || 'All Statuses'}
                  onChange={(e) => onFilterChange('claimStatus', e.target.value)}
                >
                  {filterOptions.claimStatus.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Legend Section */}
        <div>
          <button 
            className="flex justify-between items-center w-full text-left font-medium text-gray-700 mb-2"
            onClick={() => toggleSection('legend')}
          >
            <span>Legend</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-4 w-4 transition-transform ${expandedSection === 'legend' ? 'transform rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {expandedSection === 'legend' && (
            <div className="pl-2 space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 mr-2 rounded-full bg-blue-500"></span>
                <span className="text-sm text-gray-700">Individual Claims</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 mr-2 rounded-full bg-purple-500"></span>
                <span className="text-sm text-gray-700">Community Claims</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 mr-2 rounded-full bg-green-700"></span>
                <span className="text-sm text-gray-700">Dense Forest</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 mr-2 rounded-full bg-green-400"></span>
                <span className="text-sm text-gray-700">Moderate Forest</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 mr-2 rounded-full bg-blue-400"></span>
                <span className="text-sm text-gray-700">Water Bodies</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 mr-2 border border-gray-400"></span>
                <span className="text-sm text-gray-700">Village Boundary</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;