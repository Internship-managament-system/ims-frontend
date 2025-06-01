// /pages/admin/commission/components/CommissionFilters.tsx
import React from 'react';

interface CommissionFiltersProps {
  userFilter: string;
  onFilterChange: (filter: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const CommissionFilters: React.FC<CommissionFiltersProps> = ({
  userFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-md ${
              userFilter === 'all' ? 'bg-[#13126e] text-white' : 'bg-gray-100'
            }`}
            onClick={() => onFilterChange('all')}
          >
            Tüm Üyeler
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              userFilter === 'active' ? 'bg-[#13126e] text-white' : 'bg-gray-100'
            }`}
            onClick={() => onFilterChange('active')}
          >
            Aktif Üyeler
          </button>
        </div>

        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Üye ara..."
            className="w-full px-4 py-2 border rounded-md"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default CommissionFilters;