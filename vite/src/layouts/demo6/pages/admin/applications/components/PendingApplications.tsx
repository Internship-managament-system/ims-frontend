// src/layouts/demo6/pages/admin/applications/components/PendingApplications.tsx
import React, { useState } from 'react';
import { KeenIcon } from '@/components/keenicons';

interface Application {
  id: number;
  studentId: string;
  name: string;
  date: string;
  status: string;
  statusClass: string;
  assignee: string;
  company: string;
  startDate: string;
  endDate: string;
}

interface CommissionMember {
  id: number;
  name: string;
}

interface PendingApplicationsProps {
  limit?: number;
}

const PendingApplications: React.FC<PendingApplicationsProps> = ({ limit }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = limit || 10;
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState<number | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  // Commission members data
  const commissionMembers: CommissionMember[] = [
    { id: 1, name: 'Prof. Dr. Ali Demir' },
    { id: 2, name: 'Dr. Mehmet Kaya' },
    { id: 3, name: 'Prof. Dr. Ayşe Yıldız' },
    { id: 4, name: 'Arş. Gör. Osman Buğra KAHRAMAN' },
    { id: 5, name: 'Arş. Gör. Fatma AZİZOĞLU' },
  ];

  // Applications data
  const [applications, setApplications] = useState<Application[]>([
    {
      id: 1,
      studentId: "20190101023",
      name: "Ahmet Yılmaz",
      date: "25.04.2025",
      status: "Beklemede",
      statusClass: "bg-yellow-100 text-yellow-800",
      assignee: "Prof. Dr. Ali Demir",
      company: "ABC Teknoloji A.Ş.",
      startDate: "15.06.2025",
      endDate: "15.07.2025"
    },
    {
      id: 2,
      studentId: "20190101045",
      name: "Ayşe Demir",
      date: "24.04.2025",
      status: "Eksik",
      statusClass: "bg-red-100 text-red-800",
      assignee: "Dr. Mehmet Kaya",
      company: "XYZ Yazılım Ltd.",
      startDate: "01.06.2025",
      endDate: "15.07.2025"
    },
    {
      id: 3,
      studentId: "20190101067",
      name: "Mehmet Öz",
      date: "23.04.2025",
      status: "Onaylandı",
      statusClass: "bg-green-100 text-green-800",
      assignee: "Prof. Dr. Ayşe Yıldız",
      company: "Tech Solutions Inc.",
      startDate: "01.07.2025",
      endDate: "15.08.2025"
    },
    {
      id: 4,
      studentId: "20190101089",
      name: "Zeynep Kaya",
      date: "22.04.2025",
      status: "Beklemede",
      statusClass: "bg-yellow-100 text-yellow-800",
      assignee: "Prof. Dr. Ali Demir",
      company: "Bilişim Sistemleri A.Ş.",
      startDate: "01.08.2025",
      endDate: "15.09.2025"
    },
    {
      id: 5,
      studentId: "20190101099",
      name: "Ali Can",
      date: "21.04.2025",
      status: "Beklemede",
      statusClass: "bg-yellow-100 text-yellow-800",
      assignee: "Dr. Mehmet Kaya",
      company: "Yazılım Merkezi Ltd.",
      startDate: "15.07.2025",
      endDate: "15.08.2025"
    },
    {
      id: 6,
      studentId: "20190101108",
      name: "Fatma Yılmaz",
      date: "20.04.2025",
      status: "Onaylandı",
      statusClass: "bg-green-100 text-green-800",
      assignee: "Prof. Dr. Ayşe Yıldız",
      company: "Teknoloji A.Ş.",
      startDate: "01.06.2025",
      endDate: "01.08.2025"
    }
  ]);

  // Change assignee for an application
  const changeAssignee = (applicationId: number, newAssignee: string) => {
    setApplications(applications.map(app => 
      app.id === applicationId ? { ...app, assignee: newAssignee } : app
    ));
    setShowAssigneeDropdown(null);
  };

  // Get current page items
  const getCurrentItems = () => {
    if (limit) {
      return applications.slice(0, limit);
    }
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return applications.slice(indexOfFirstItem, indexOfLastItem);
  };

  // Total pages
  const totalPages = Math.ceil(applications.length / itemsPerPage);

  // Generate pagination buttons
  const paginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          className={`px-3 py-1 mx-1 rounded ${i === currentPage ? 'bg-[#13126e] text-white' : 'bg-gray-200'}`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  const handleViewDetails = (application: Application) => {
    setSelectedApplication(application);
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">
          {limit ? 'Son Başvurular' : 'Tüm Başvurular'}
        </h2>
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
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Öğrenci No</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Ad Soyad</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Şirket</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Başvuru Tarihi</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Durum</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Atanan Kişi</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {getCurrentItems().map(app => (
              <tr key={app.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-700">{app.studentId}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{app.name}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{app.company}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{app.date}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`inline-block px-2 py-1 text-xs font-medium ${app.statusClass} rounded-full`}>
                    {app.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 relative">
                  <div className="flex items-center">
                    <span className="truncate max-w-[120px]">{app.assignee}</span>
                    <button
                      className="ml-2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowAssigneeDropdown(showAssigneeDropdown === app.id ? null : app.id)}
                    >
                      <KeenIcon icon="down" className="w-3 h-3" />
                    </button>
                  </div>
                  
                  {/* Assignee Change Dropdown */}
                  {showAssigneeDropdown === app.id && (
                    <div className="absolute left-0 mt-1 w-64 bg-white border border-gray-200 rounded shadow-lg z-10">
                      {commissionMembers.map(member => (
                        <button
                          key={member.id}
                          className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${member.name === app.assignee ? 'font-bold bg-gray-50' : ''}`}
                          onClick={() => changeAssignee(app.id, member.name)}
                        >
                          {member.name}
                        </button>
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-sm">
                  <button 
                    className="btn bg-blue-500 text-white text-xs py-1 px-2 rounded hover:bg-blue-600 transition-colors"
                    onClick={() => handleViewDetails(app)}
                  >
                    <KeenIcon icon="eye" className="mr-1" />
                    İncele
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination for full view */}
        {!limit && totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <button
              className="px-3 py-1 mx-1 rounded bg-gray-200 disabled:opacity-50"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <KeenIcon icon="arrow-left" />
            </button>
            
            {paginationButtons()}
            
            <button
              className="px-3 py-1 mx-1 rounded bg-gray-200 disabled:opacity-50"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <KeenIcon icon="arrow-right" />
            </button>
          </div>
        )}
      </div>

      {/* Application Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Başvuru Detayları - {selectedApplication.name}
              </h3>
              <button 
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setSelectedApplication(null)}
              >
                <KeenIcon icon="cross" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Öğrenci Bilgileri</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded">
                    <p><strong>Ad Soyad:</strong> {selectedApplication.name}</p>
                    <p><strong>Öğrenci No:</strong> {selectedApplication.studentId}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Staj Bilgileri</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded">
                    <p><strong>Şirket:</strong> {selectedApplication.company}</p>
                    <p><strong>Başlangıç:</strong> {selectedApplication.startDate}</p>
                    <p><strong>Bitiş:</strong> {selectedApplication.endDate}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Başvuru Durumu</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded">
                    <p><strong>Durum:</strong> 
                      <span className={`ml-2 inline-block px-2 py-1 text-xs font-medium ${selectedApplication.statusClass} rounded-full`}>
                        {selectedApplication.status}
                      </span>
                    </p>
                    <p><strong>Başvuru Tarihi:</strong> {selectedApplication.date}</p>
                    <p><strong>Atanan Kişi:</strong> {selectedApplication.assignee}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Belgeler</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <KeenIcon icon="document" className="mr-2 text-green-500" />
                        <span className="text-sm">Staj Beyannamesi</span>
                      </div>
                      <div className="flex items-center">
                        <KeenIcon icon="document" className="mr-2 text-green-500" />
                        <span className="text-sm">Transkript</span>
                      </div>
                      <div className="flex items-center">
                        <KeenIcon icon="document" className="mr-2 text-yellow-500" />
                        <span className="text-sm">İş Sağlığı Belgesi (Eksik)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-2">
              <button 
                className="btn bg-gray-200 text-gray-800 py-2 px-4 rounded"
                onClick={() => setSelectedApplication(null)}
              >
                Kapat
              </button>
              <button 
                className="btn bg-green-600 text-white py-2 px-4 rounded"
              >
                Onayla
              </button>
              <button 
                className="btn bg-red-600 text-white py-2 px-4 rounded"
              >
                Reddet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingApplications;