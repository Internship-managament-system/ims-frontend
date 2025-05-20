// src/layouts/demo6/pages/admin/applications/components/PendingApplications.tsx
import React, { useState } from 'react';

interface Application {
  id: number;
  studentId: string;
  name: string;
  date: string;
  status: string;
  statusClass: string;
  assignee: string;
}

interface CommissionMember {
  id: number;
  name: string;
}

const PendingApplications: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState<number | null>(null);

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
      assignee: "Prof. Dr. Ali Demir"
    },
    {
      id: 2,
      studentId: "20190101045",
      name: "Ayşe Demir",
      date: "24.04.2025",
      status: "Eksik",
      statusClass: "bg-red-100 text-red-800",
      assignee: "Dr. Mehmet Kaya"
    },
    {
      id: 3,
      studentId: "20190101067",
      name: "Mehmet Öz",
      date: "23.04.2025",
      status: "Onaylandı",
      statusClass: "bg-green-100 text-green-800",
      assignee: "Prof. Dr. Ayşe Yıldız"
    },
    {
      id: 4,
      studentId: "20190101089",
      name: "Zeynep Kaya",
      date: "22.04.2025",
      status: "Beklemede",
      statusClass: "bg-yellow-100 text-yellow-800",
      assignee: "Prof. Dr. Ali Demir"
    },
    {
      id: 5,
      studentId: "20190101099",
      name: "Ali Can",
      date: "21.04.2025",
      status: "Beklemede",
      statusClass: "bg-yellow-100 text-yellow-800",
      assignee: "Dr. Mehmet Kaya"
    },
    {
      id: 6,
      studentId: "20190101108",
      name: "Fatma Yılmaz",
      date: "20.04.2025",
      status: "Onaylandı",
      statusClass: "bg-green-100 text-green-800",
      assignee: "Prof. Dr. Ayşe Yıldız"
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

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Son Başvurular</h2>
        <button className="btn bg-[#13126e] text-white text-sm py-1 px-3 rounded">
          Tümünü Görüntüle
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Öğrenci No</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Ad Soyad</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Tarih</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Durum</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Atanan Kişi</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {getCurrentItems().map(app => (
              <tr key={app.id} className="border-b border-gray-200">
                <td className="px-4 py-3 text-sm text-gray-700">{app.studentId}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{app.name}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{app.date}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`inline-block px-2 py-1 text-xs font-medium ${app.statusClass} rounded-full`}>
                    {app.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 relative">
                  <div className="flex items-center">
                    <span>{app.assignee}</span>
                    <button
                      className="ml-2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowAssigneeDropdown(showAssigneeDropdown === app.id ? null : app.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20V10"></path>
                        <path d="M18 14l-6-6-6 6"></path>
                      </svg>
                    </button>
                  </div>
                  
                  {/* Assignee Change Dropdown */}
                  {showAssigneeDropdown === app.id && (
                    <div className="absolute left-0 mt-1 w-48 bg-white border border-gray-200 rounded shadow-lg z-10">
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
                  <button className="btn bg-blue-500 text-white text-xs py-1 px-2 rounded">
                    İncele
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          <button
            className="px-3 py-1 mx-1 rounded bg-gray-200 disabled:opacity-50"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            &laquo;
          </button>
          
          {paginationButtons()}
          
          <button
            className="px-3 py-1 mx-1 rounded bg-gray-200 disabled:opacity-50"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            &raquo;
          </button>
        </div>
      </div>
    </div>
  );
};

export default PendingApplications;