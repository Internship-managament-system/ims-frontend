// src/layouts/demo6/pages/admin/applications/components/ApplicationFilters.tsx
import React from 'react';
import { KeenIcon } from '@/components/keenicons';

interface ApplicationFiltersProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  searchTerm: string;
  onSearch: (term: string) => void;
}

const ApplicationFilters: React.FC<ApplicationFiltersProps> = ({
  selectedStatus,
  onStatusChange,
  searchTerm,
  onSearch,
}) => {
  const statusOptions = [
    { value: 'all', label: 'Tümü', count: 25 },
    { value: 'pending', label: 'Bekleyen', count: 8 },
    { value: 'approved', label: 'Onaylanan', count: 12 },
    { value: 'rejected', label: 'Reddedilen', count: 3 },
    { value: 'incomplete', label: 'Eksik', count: 2 }
  ];

  const assigneeOptions = [
    'Tümü',
    'Prof. Dr. Ali Demir',
    'Dr. Mehmet Kaya', 
    'Prof. Dr. Ayşe Yıldız',
    'Arş. Gör. Osman Buğra KAHRAMAN',
    'Arş. Gör. Fatma AZİZOĞLU'
  ];

  return (
    <div className="space-y-4">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statusOptions.map((option) => (
          <div
            key={option.value}
            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
              selectedStatus === option.value
                ? 'border-[#13126e] bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onStatusChange(option.value)}
          >
            <div className="text-center">
              <div className={`text-lg font-bold ${
                selectedStatus === option.value ? 'text-[#13126e]' : 'text-gray-900'
              }`}>
                {option.count}
              </div>
              <div className="text-sm text-gray-600">{option.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Advanced Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Arama
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeenIcon icon="search" className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Öğrenci adı, numarası veya şirket..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#13126e] focus:border-[#13126e]"
                value={searchTerm}
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Durum
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#13126e] focus:border-[#13126e]"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} ({option.count})
                </option>
              ))}
            </select>
          </div>

          {/* Assignee Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Atanan Kişi
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#13126e] focus:border-[#13126e]"
            >
              {assigneeOptions.map((assignee, index) => (
                <option key={index} value={assignee}>
                  {assignee}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tarih Aralığı
            </label>
            <div className="flex space-x-2">
              <input
                type="date"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#13126e] focus:border-[#13126e]"
              />
              <input
                type="date"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#13126e] focus:border-[#13126e]"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <button className="btn bg-gray-100 text-gray-700 py-2 px-4 rounded hover:bg-gray-200 transition-colors">
              <KeenIcon icon="download" className="mr-2" />
              Excel'e Aktar
            </button>
            <button className="btn bg-gray-100 text-gray-700 py-2 px-4 rounded hover:bg-gray-200 transition-colors">
              <KeenIcon icon="printer" className="mr-2" />
              Yazdır
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button className="btn bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 transition-colors">
              <KeenIcon icon="refresh" className="mr-2" />
              Filtreleri Temizle
            </button>
            <button className="btn bg-[#13126e] text-white py-2 px-4 rounded hover:bg-[#1f1e7e] transition-colors">
              <KeenIcon icon="search" className="mr-2" />
              Filtrele
            </button>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      <div className="flex flex-wrap gap-2">
        {selectedStatus !== 'all' && (
          <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            <span>Durum: {statusOptions.find(s => s.value === selectedStatus)?.label}</span>
            <button 
              className="ml-2 text-blue-600 hover:text-blue-800"
              onClick={() => onStatusChange('all')}
            >
              <KeenIcon icon="cross" className="w-3 h-3" />
            </button>
          </div>
        )}
        
        {searchTerm && (
          <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            <span>Arama: "{searchTerm}"</span>
            <button 
              className="ml-2 text-green-600 hover:text-green-800"
              onClick={() => onSearch('')}
            >
              <KeenIcon icon="cross" className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationFilters;