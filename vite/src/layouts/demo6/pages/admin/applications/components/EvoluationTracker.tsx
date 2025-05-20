// src/layouts/demo6/pages/admin/applications/components/EvaluationTracker.tsx
import React, { useState } from 'react';

interface Evaluation {
  id: string;
  student: string;
  company: string;
  points: number;
  result: 'Onaylandı' | 'Kısmen Kabul' | 'Reddedildi';
  evaluator: string;
  reason?: string;
}

const EvaluationTracker: React.FC = () => {
  const [selectedEvaluation, setSelectedEvaluation] = useState<string | null>(null);
  
  const evaluations: Evaluation[] = [
    { 
      id: '1', 
      student: 'Ahmet Yılmaz', 
      company: 'ABC Teknoloji A.Ş.', 
      points: 0, 
      result: 'Onaylandı', 
      evaluator: 'Prof. Dr. Ali Demir' 
    },
    { 
      id: '2', 
      student: 'Ayşe Demir', 
      company: 'XYZ Yazılım Ltd.', 
      points: 4, 
      result: 'Kısmen Kabul', 
      evaluator: 'Dr. Mehmet Kaya',
      reason: 'Staj defteri formatı uygun değil, bazı bölümler eksik' 
    },
    { 
      id: '3', 
      student: 'Mehmet Öz', 
      company: 'Tech Solutions Inc.', 
      points: 12, 
      result: 'Reddedildi', 
      evaluator: 'Prof. Dr. Ayşe Yıldız',
      reason: 'Yetersiz içerik, eksik günler, staj yeri uygun değil' 
    }
  ];
  
  const getStatusClass = (result: string) => {
    switch(result) {
      case 'Onaylandı': return 'bg-green-100 text-green-800';
      case 'Kısmen Kabul': return 'bg-yellow-100 text-yellow-800';
      case 'Reddedildi': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Değerlendirme Takibi</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Öğrenci Adı</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Şirket</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Eksiklik Puanı</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Sonuç</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Değerlendiren</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {evaluations.map(evaluation => (
              <tr key={evaluation.id} className="border-b border-gray-200">
                <td className="px-4 py-3 text-sm text-gray-700">{evaluation.student}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{evaluation.company}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{evaluation.points}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(evaluation.result)}`}>
                    {evaluation.result}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{evaluation.evaluator}</td>
                <td className="px-4 py-3 text-sm">
                  {(evaluation.result === 'Kısmen Kabul' || evaluation.result === 'Reddedildi') && (
                    <button 
                      className="btn bg-blue-500 text-white text-xs py-1 px-2 rounded"
                      onClick={() => setSelectedEvaluation(evaluation.id)}
                    >
                      Gerekçe
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {selectedEvaluation && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-medium text-gray-900">
              Red/Kısmen Kabul Gerekçesi
            </h3>
            <button 
              className="text-gray-500"
              onClick={() => setSelectedEvaluation(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <p className="text-gray-600">
            {evaluations.find(e => e.id === selectedEvaluation)?.reason || 'Gerekçe belirtilmemiş.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default EvaluationTracker;