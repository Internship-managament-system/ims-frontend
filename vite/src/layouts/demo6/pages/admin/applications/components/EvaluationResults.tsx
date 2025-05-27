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
  const itemsPerPage = limit || 10;

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

  const displayedEvaluations = limit ? evaluations.slice(0, limit) : evaluations;
  const totalPages = Math.ceil(evaluations.length / itemsPerPage);

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Değerlendirme Sonuçları</h2>
        {limit && (
          <button className="btn bg-[#13126e] text-white text-sm py-1 px-3 rounded">
            Tümünü Görüntüle
          </button>
        )}
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
            {displayedEvaluations.map((evaluation) => (
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
      </div>

      {/* Pagination for full view */}
      {!limit && totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-1">
          <button
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <KeenIcon icon="arrow-left" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? 'bg-[#13126e] text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <KeenIcon icon="arrow-right" />
          </button>
        </div>
      )}

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