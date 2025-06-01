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
  return (
    <div className="space-y-4">
      {/* Search Only */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
          {/* Search */}
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Öğrenci Arama
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeenIcon icon="magnifier" className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Öğrenci adı veya numarası..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#13126e] focus:border-[#13126e]"
                value={searchTerm}
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 w-full sm:w-auto">
            {/* Search Button */}
            <button 
              className="btn bg-[#13126e] text-white py-2 px-4 rounded-md hover:bg-[#1f1e7e] transition-colors flex items-center justify-center flex-1 sm:flex-none"
              onClick={() => {/* Arama işlemi burada yapılabilir */}}
            >
              <KeenIcon icon="magnifier" className="mr-1" />
              Ara
            </button>

            {/* Clear Search Button */}
            {searchTerm && (
              <button 
                className="btn bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors flex items-center justify-center flex-1 sm:flex-none"
                onClick={() => onSearch('')}
              >
                <KeenIcon icon="refresh" className="mr-1" />
                Temizle
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Search Display */}
      {searchTerm && (
        <div className="flex flex-wrap gap-2">
          <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            <span>Arama: "{searchTerm}"</span>
            <button 
              className="ml-2 text-green-600 hover:text-green-800"
              onClick={() => onSearch('')}
            >
              <KeenIcon icon="cross" className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationFilters;