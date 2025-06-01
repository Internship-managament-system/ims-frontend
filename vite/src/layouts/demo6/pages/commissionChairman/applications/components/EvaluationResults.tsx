// src/layouts/demo6/pages/admin/applications/components/EvaluationResults.tsx
import React, { useState } from 'react';
import { KeenIcon } from '@/components/keenicons';

interface Evaluation {
  id: string;
  studentName: string;
  studentId: string;
  company: string;
  points: number;
  result: 'approved' | 'partially' | 'rejected';
  evaluator: string;
  date: string;
  reason?: string;
}

interface EvaluationResultsProps {
  limit?: number;
}

const EvaluationResults: React.FC<EvaluationResultsProps> = ({ limit }) => {
  const [selectedEvaluation, setSelectedEvaluation] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(limit || 10);
  const [activeTab, setActiveTab] = useState<string>('all');

  const evaluations: Evaluation[] = [
    {
      id: '1',
      studentName: 'Ahmet Yılmaz',
      studentId: '20190101023',
      company: 'ABC Teknoloji A.Ş.',
      points: 0,
      result: 'approved',
      evaluator: 'Prof. Dr. Ali Demir',
      date: '25.04.2025'
    },
    {
      id: '2',
      studentName: 'Ayşe Demir',
      studentId: '20190101045',
      company: 'XYZ Yazılım Ltd.',
      points: 4,
      result: 'partially',
      evaluator: 'Dr. Mehmet Kaya',
      date: '24.04.2025',
      reason: 'Staj defteri formatı uygun değil, bazı bölümler eksik'
    },
    {
      id: '3',
      studentName: 'Mehmet Öz',
      studentId: '20190101067',
      company: 'Tech Solutions Inc.',
      points: 12,
      result: 'rejected',
      evaluator: 'Prof. Dr. Ayşe Yıldız',
      date: '23.04.2025',
      reason: 'Yetersiz içerik, eksik günler, staj yeri uygun değil'
    },
    {
      id: '4',
      studentName: 'Zeynep Kaya',
      studentId: '20190101089',
      company: 'Bilişim Sistemleri A.Ş.',
      points: 2,
      result: 'partially',
      evaluator: 'Prof. Dr. Ali Demir',
      date: '22.04.2025',
      reason: 'İmzalar eksik'
    },
    {
      id: '5',
      studentName: 'Ali Can',
      studentId: '20190101099',
      company: 'Yazılım Merkezi Ltd.',
      points: 0,
      result: 'approved',
      evaluator: 'Dr. Mehmet Kaya',
      date: '21.04.2025'
    }
  ];

  // Status tabs
  const statusTabs = [
    { key: 'all', label: 'Tümü', count: evaluations.length },
    { key: 'approved', label: 'Onaylandı', count: evaluations.filter(evaluation => evaluation.result === 'approved').length },
    { key: 'partially', label: 'Kısmen Kabul', count: evaluations.filter(evaluation => evaluation.result === 'partially').length },
    { key: 'rejected', label: 'Reddedildi', count: evaluations.filter(evaluation => evaluation.result === 'rejected').length },
  ];

  // Filter evaluations by active tab
  const getFilteredEvaluations = () => {
    if (activeTab === 'all') {
      return evaluations;
    }
    return evaluations.filter(evaluation => evaluation.result === activeTab);
  };

  // Get current page items
  const getCurrentItems = () => {
    const filteredEvals = getFilteredEvaluations();
    if (limit) {
      return filteredEvals.slice(0, limit);
    }
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredEvals.slice(indexOfFirstItem, indexOfLastItem);
  };

  // Total pages
  const totalPages = Math.ceil(getFilteredEvaluations().length / itemsPerPage);

  // Reset page when tab changes
  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey);
    setCurrentPage(1);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Calculate current range
  const getCurrentRange = () => {
    const filteredEvals = getFilteredEvaluations();
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, filteredEvals.length);
    return { start, end, total: filteredEvals.length };
  };

  const getStatusBadge = (result: Evaluation['result']) => {
    switch (result) {
      case 'approved':
        return (
          <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            Onaylandı
          </span>
        );
      case 'partially':
        return (
          <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
            Kısmen Kabul
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
            Reddedildi
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Değerlendirme Sonuçları</h2>
      </div>

      {/* Status Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {statusTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-[#13126e] text-[#13126e]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Öğrenci</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Şirket</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Tarih</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Sonuç</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Değerlendiren</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {getCurrentItems().map((evaluation) => (
              <tr key={evaluation.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">
                  <div>
                    <div className="text-gray-900 font-medium">{evaluation.studentName}</div>
                    <div className="text-gray-500 text-xs">{evaluation.studentId}</div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{evaluation.company}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{evaluation.date}</td>
                
                <td className="px-4 py-3 text-sm">
                  {getStatusBadge(evaluation.result)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{evaluation.evaluator}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex space-x-1">
                    <button className="btn bg-blue-500 text-white text-xs py-1 px-2 rounded hover:bg-blue-600 transition-colors">
                      <KeenIcon icon="eye" className="mr-1" />
                      Detay
                    </button>
                    {(evaluation.result === 'partially' || evaluation.result === 'rejected') && evaluation.reason && (
                      <button
                        className="btn bg-yellow-500 text-white text-xs py-1 px-2 rounded hover:bg-yellow-600 transition-colors"
                        onClick={() => setSelectedEvaluation(
                          selectedEvaluation === evaluation.id ? null : evaluation.id
                        )}
                      >
                        <KeenIcon icon="message-text" className="mr-1" />
                        Gerekçe
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Simple Pagination like in photo */}
        {!limit && (
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
            {/* Left side - Record info */}
            <div className="text-sm text-gray-600">
              {(() => {
                const range = getCurrentRange();
                return `Toplam ${range.total} kayıttan ${range.start}-${range.end} arası gösteriliyor`;
              })()}
            </div>

            {/* Right side - Controls */}
            <div className="flex items-center gap-4">
              {/* Items per page */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sayfa başına:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              {/* Pagination buttons */}
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  {/* Previous button */}
                  <button
                    className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <KeenIcon icon="arrow-left" className="w-4 h-4" />
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 text-sm rounded ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {/* Next button */}
                  <button
                    className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <KeenIcon icon="arrow-right" className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* No results message */}
        {getCurrentItems().length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-500">
              {activeTab === 'all' ? 'Henüz değerlendirme bulunmuyor.' : `${statusTabs.find(t => t.key === activeTab)?.label} durumunda değerlendirme bulunmuyor.`}
            </div>
          </div>
        )}
      </div>

      {/* Reason Display */}
      {selectedEvaluation && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-medium text-yellow-800">
              {evaluations.find(e => e.id === selectedEvaluation)?.result === 'rejected' 
                ? 'Red Gerekçesi' 
                : 'Kısmen Kabul Gerekçesi'}
            </h3>
            <button
              className="text-yellow-600 hover:text-yellow-800"
              onClick={() => setSelectedEvaluation(null)}
            >
              <KeenIcon icon="cross" />
            </button>
          </div>
          <p className="text-yellow-700">
            {evaluations.find(e => e.id === selectedEvaluation)?.reason || 'Gerekçe belirtilmemiş.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default EvaluationResults;