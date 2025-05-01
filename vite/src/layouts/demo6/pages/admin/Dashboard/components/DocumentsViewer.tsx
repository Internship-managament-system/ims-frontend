// /layouts/demo6/pages/admin/Dashboard/components/DocumentsViewer.tsx
import React, { useState } from 'react';

const DocumentsViewer: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('active');
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  
  const documents = [
    { id: '1', student: 'Ahmet Yılmaz', type: 'Transkript', date: '25.04.2025', status: 'active' },
    { id: '2', student: 'Ayşe Demir', type: 'Staj Defteri', date: '24.04.2025', status: 'active' },
    { id: '3', student: 'Mehmet Öz', type: 'İş Sağlığı Belgesi', date: '23.04.2025', status: 'active' },
    { id: '4', student: 'Ali Can', type: 'Staj Defteri', date: '20.03.2025', status: 'graduate' },
    { id: '5', student: 'Zeynep Kaya', type: 'Transkript', date: '18.03.2025', status: 'graduate' }
  ];
  
  const filteredDocuments = documents.filter(doc => doc.status === activeFilter);
  
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Belgeler</h2>
        <div className="flex space-x-2">
          <button 
            className={`btn text-sm py-1 px-3 rounded ${activeFilter === 'active' ? 'bg-[#13126e] text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setActiveFilter('active')}
          >
            Aktif Öğrenciler
          </button>
          <button 
            className={`btn text-sm py-1 px-3 rounded ${activeFilter === 'graduate' ? 'bg-[#13126e] text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setActiveFilter('graduate')}
          >
            Mezunlar
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Öğrenci Adı</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Belge Tipi</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Yükleme Tarihi</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments.map(doc => (
              <tr key={doc.id} className="border-b border-gray-200">
                <td className="px-4 py-3 text-sm text-gray-700">{doc.student}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{doc.type}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{doc.date}</td>
                <td className="px-4 py-3 text-sm">
                  <button 
                    className="btn bg-blue-500 text-white text-xs py-1 px-2 rounded"
                    onClick={() => setSelectedDocument(doc.id)}
                  >
                    Görüntüle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {selectedDocument && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-medium text-gray-900">
              Belge Önizleme
            </h3>
            <button 
              className="text-gray-500"
              onClick={() => setSelectedDocument(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 h-64 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2 text-gray-400">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <p className="text-gray-600">
                Belge Önizlemesi
              </p>
              <div className="mt-2">
                <button className="btn bg-blue-500 text-white text-xs py-1 px-3 rounded">
                  İndir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsViewer;