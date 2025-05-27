// src/layouts/demo6/pages/admin/applications/index.tsx
import React, { useState } from 'react';
import { Container } from '@/components';
import { KeenIcon } from '@/components/keenicons';

// Components import'larını düzelt
import ApplicationFilters from './components/ApplicationFilters';
import PendingApplications from './components/PendingApplications';
import ApplicationStats from './components/ApplicationStats';
import EvaluationResults from './components/EvaluationResults';
import AssignmentPanel from './components/AssignmentPanel';

const ApplicationManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'evaluations' | 'assignments'>('overview');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <ApplicationStats />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PendingApplications limit={5} />
              <EvaluationResults limit={5} />
            </div>
          </div>
        );
      case 'applications':
        return (
          <div className="space-y-6">
            <ApplicationFilters
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              searchTerm={searchTerm}
              onSearch={setSearchTerm}
            />
            <PendingApplications />
          </div>
        );
      case 'evaluations':
        return (
          <div className="space-y-6">
            <EvaluationResults />
          </div>
        );
      case 'assignments':
        return (
          <div className="space-y-6">
            <AssignmentPanel />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Container>
      <div className="p-5">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Başvuru Yönetimi</h1>
          <p className="text-gray-600">
            Staj başvurularını, değerlendirmeleri ve atamaları yönetin
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-[#13126e] text-[#13126e]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <KeenIcon icon="element-11" className="mr-2" />
                Genel Durum
              </div>
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'applications'
                  ? 'border-[#13126e] text-[#13126e]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <KeenIcon icon="document" className="mr-2" />
                Başvurular
              </div>
            </button>
            <button
              onClick={() => setActiveTab('evaluations')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'evaluations'
                  ? 'border-[#13126e] text-[#13126e]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <KeenIcon icon="chart-line" className="mr-2" />
                Değerlendirmeler
              </div>
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'assignments'
                  ? 'border-[#13126e] text-[#13126e]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <KeenIcon icon="people" className="mr-2" />
                Atamalar
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </Container>
  );
};

export default ApplicationManagement;