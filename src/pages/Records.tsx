import React, { useState, useMemo } from 'react';
import { FRARecord } from '../types';
import { Search, Plus, ChevronLeft, ChevronRight, Eye, Edit, Trash2 } from 'lucide-react';

// Mock Data for FRA Records
const mockRecords: FRARecord[] = [
  { id: 'FRA001', type: 'IFR', holderName: 'Ravi Kumar', village: 'Kondagaon', district: 'Bastar', state: 'Chhattisgarh', area: 2.5, status: 'approved', coordinates: [19.0760, 82.6040], dateApplied: '2022-01-15', documents: [] },
  { id: 'FRA002', type: 'CR', holderName: 'Sunita Devi', village: 'Narayanpur', district: 'Narayanpur', state: 'Chhattisgarh', area: 15.0, status: 'pending', coordinates: [19.1340, 82.6510], dateApplied: '2022-03-22', documents: [] },
  { id: 'FRA003', type: 'CFR', holderName: 'Mangal Singh', village: 'Geedam', district: 'Dantewada', state: 'Chhattisgarh', area: 50.2, status: 'approved', coordinates: [19.2150, 82.5830], dateApplied: '2021-11-30', documents: [] },
  { id: 'FRA004', type: 'IFR', holderName: 'Lakshmi Bai', village: 'Jagdalpur', district: 'Bastar', state: 'Chhattisgarh', area: 1.8, status: 'rejected', coordinates: [19.0800, 82.0300], dateApplied: '2022-05-10', documents: [] },
  { id: 'FRA005', type: 'IFR', holderName: 'Ganesh Murmu', village: 'Jashpur', district: 'Jashpur', state: 'Jharkhand', area: 3.1, status: 'under_review', coordinates: [22.9032, 84.1437], dateApplied: '2023-02-01', documents: [] },
  { id: 'FRA006', type: 'CR', holderName: 'Sarna Samiti', village: 'Khunti', district: 'Khunti', state: 'Jharkhand', area: 25.5, status: 'approved', coordinates: [23.0782, 85.2799], dateApplied: '2022-06-18', documents: [] },
  { id: 'FRA007', type: 'IFR', holderName: 'Budhni Manjhi', village: 'Rayagada', district: 'Rayagada', state: 'Odisha', area: 2.2, status: 'pending', coordinates: [19.1713, 83.4180], dateApplied: '2023-01-05', documents: [] },
  { id: 'FRA008', type: 'CFR', holderName: 'Dongria Kondh', village: 'Niyamgiri', district: 'Kalahandi', state: 'Odisha', area: 120.0, status: 'approved', coordinates: [19.7845, 83.3702], dateApplied: '2020-09-25', documents: [] },
  { id: 'FRA009', type: 'IFR', holderName: 'Soma Mandavi', village: 'Kanker', district: 'Kanker', state: 'Chhattisgarh', area: 4.5, status: 'pending', coordinates: [20.2741, 81.4920], dateApplied: '2023-03-11', documents: [] },
  { id: 'FRA010', type: 'IFR', holderName: 'Rina Oraon', village: 'Gumla', district: 'Gumla', state: 'Jharkhand', area: 1.5, status: 'approved', coordinates: [23.0457, 84.5446], dateApplied: '2022-08-01', documents: [] },
];

const StatusBadge: React.FC<{ status: FRARecord['status'] }> = ({ status }) => {
  const statusStyles = {
    approved: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    rejected: 'bg-red-100 text-red-800',
    under_review: 'bg-blue-100 text-blue-800',
  };
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status]}`}>
      {status.replace('_', ' ').toUpperCase()}
    </span>
  );
};

const Records: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7;

  const filteredRecords = useMemo(() => {
    return mockRecords
      .filter(record =>
        record.holderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.district.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(record => statusFilter === 'all' || record.status === statusFilter);
  }, [searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">FRA Records Management</h1>
        <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
          <Plus className="h-4 w-4" />
          <span>Add New Record</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, village, district..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
            <option value="under_review">Under Review</option>
          </select>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Holder Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area (ha)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedRecords.map(record => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{record.holderName}</div>
                  <div className="text-xs text-gray-500">{record.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.area.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={record.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.village}</div>
                    <div className="text-xs text-gray-500">{record.district}, {record.state}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-3">
                    <button className="text-blue-600 hover:text-blue-900"><Eye className="h-4 w-4" /></button>
                    <button className="text-yellow-600 hover:text-yellow-900"><Edit className="h-4 w-4" /></button>
                    <button className="text-red-600 hover:text-red-900"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

       {/* Pagination */}
      <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
            <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * recordsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * recordsPerPage, filteredRecords.length)}</span> of <span className="font-medium">{filteredRecords.length}</span> results
            </div>
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm text-gray-700">
                    Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
                </span>
                <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
      </div>
    </div>
  );
};

export default Records;

