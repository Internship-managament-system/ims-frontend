// /pages/admin/applications/components/ApplicationFilters.tsx
import React from 'react';

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
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-md ${
              selectedStatus === 'all' ? 'bg-[#13126e] text-white' : 'bg-gray-100'
            }`}
            onClick={() => onStatusChange('all')}
          >
            Tümü
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              selectedStatus === 'pending' ? 'bg-[#13126e] text-white' : 'bg-gray-100'
            }`}
            onClick={() => onStatusChange('pending')}
          >
            Bekleyen
          </button>
        </div>

        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Başvuru ara..."
            className="w-full px-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default ApplicationFilters;