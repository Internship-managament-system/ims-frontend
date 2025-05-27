// src/layouts/demo6/pages/admin/applications/components/AssignmentPanel.tsx
import React, { useState } from 'react';
import { KeenIcon } from '@/components/keenicons';

interface CommissionMember {
  id: number;
  name: string;
  title: string;
  email: string;
  assignedApplications: number;
  assignedNotebooks: number;
  
}

interface AssignmentTask {
  id: string;
  type: 'application' | 'notebook' | 'graduate';
  studentName: string;
  studentId: string;
  title: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
}

const AssignmentPanel: React.FC = () => {
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [assignmentMode, setAssignmentMode] = useState<'auto' | 'manual'>('auto');
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);

  const commissionMembers: CommissionMember[] = [
    {
      id: 1,
      name: 'Prof. Dr. Ali Demir',
      title: 'Prof. Dr.',
      email: 'alidemir@erciyes.edu.tr',
      assignedApplications: 8,
      assignedNotebooks: 12,
    
    },
    {
      id: 2,
      name: 'Dr. Mehmet Kaya',
      title: 'Dr.',
      email: 'mehmetkaya@erciyes.edu.tr',
      assignedApplications: 6,
      assignedNotebooks: 9,
      
    },
    {
      id: 3,
      name: 'Prof. Dr. Ayşe Yıldız',
      title: 'Prof. Dr.',
      email: 'ayseyildiz@erciyes.edu.tr',
      assignedApplications: 7,
      assignedNotebooks: 11,
      
    },
    {
      id: 4,
      name: 'Arş. Gör. Osman Buğra KAHRAMAN',
      title: 'Arş. Gör.',
      email: 'obkahraman@erciyes.edu.tr',
      assignedApplications: 3,
      assignedNotebooks: 5,
      
    },
    {
      id: 5,
      name: 'Arş. Gör. Fatma AZİZOĞLU',
      title: 'Arş. Gör.',
      email: 'fatmaazizoglu@erciyes.edu.tr',
      assignedApplications: 4,
      assignedNotebooks: 6,
      
    }
  ];

  const pendingTasks: AssignmentTask[] = [
    {
      id: '1',
      type: 'application',
      studentName: 'Mehmet Demir',
      studentId: '20190101100',
      title: 'Staj Başvurusu',
      date: '26.04.2025',
      priority: 'high'
    },
    {
      id: '2',
      type: 'notebook',
      studentName: 'Elif Kaya',
      studentId: '20190101101',
      title: 'Staj Defteri',
      date: '25.04.2025',
      priority: 'medium'
    },
    {
      id: '3',
      type: 'graduate',
      studentName: 'Can Yılmaz',
      studentId: '20180101050',
      title: 'Mezun Staj Defteri',
      date: '24.04.2025',
      priority: 'high'
    }
  ];

  const toggleMemberSelection = (memberId: number) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

 

  const getPriorityBadge = (priority: AssignmentTask['priority']) => {
    switch (priority) {
      case 'high':
        return <span className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Yüksek</span>;
      case 'medium':
        return <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Orta</span>;
      case 'low':
        return <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Düşük</span>;
    }
  };

  const getTaskTypeBadge = (type: AssignmentTask['type']) => {
    switch (type) {
      case 'application':
        return <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Başvuru</span>;
      case 'notebook':
        return <span className="inline-block px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">Defter</span>;
      case 'graduate':
        return <span className="inline-block px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">Mezun</span>;
    }
  };

  const handleAutoAssignment = () => {
    alert('Otomatik atama işlemi başlatılacak!');
  };

  const handleManualAssignment = () => {
    if (selectedMembers.length === 0) {
      alert('Lütfen en az bir komisyon üyesi seçiniz.');
      return;
    }
    setShowAssignmentModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Assignment Mode Selection */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Atama Yöntemi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              assignmentMode === 'auto' 
                ? 'border-[#13126e] bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setAssignmentMode('auto')}
          >
            <div className="flex items-center mb-2">
              <input
                type="radio"
                checked={assignmentMode === 'auto'}
                onChange={() => setAssignmentMode('auto')}
                className="mr-2"
              />
              <KeenIcon icon="setting-2" className="mr-2 text-[#13126e]" />
              <h3 className="font-medium">Otomatik Atama</h3>
            </div>
            <p className="text-sm text-gray-600">
              Sistem komisyon üyelerinin iş yükünü dengeli dağıtacak şekilde otomatik atama yapar.
            </p>
          </div>
          
          <div 
            className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              assignmentMode === 'manual' 
                ? 'border-[#13126e] bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setAssignmentMode('manual')}
          >
            <div className="flex items-center mb-2">
              <input
                type="radio"
                checked={assignmentMode === 'manual'}
                onChange={() => setAssignmentMode('manual')}
                className="mr-2"
              />
              <KeenIcon icon="user" className="mr-2 text-[#13126e]" />
              <h3 className="font-medium">Manuel Atama</h3>
            </div>
            <p className="text-sm text-gray-600">
              Seçilen komisyon üyeleri arasından manuel olarak atama yapın.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Commission Members */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Komisyon Üyeleri</h2>
            {assignmentMode === 'manual' && (
              <button
                className="text-sm text-[#13126e] hover:text-[#1f1e7e]"
              >
                Aktif Üyeleri Seç
              </button>
            )}
          </div>
          
          <div className="space-y-3">
            {commissionMembers.map((member) => (
              <div
                key={member.id}
                className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {assignmentMode === 'manual' && (
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(member.id)}
                        onChange={() => toggleMemberSelection(member.id)}
                        className="mr-3"
                      />
                    )}
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium text-gray-900">{member.name}</h3>
                        
                      </div>
                      <p className="text-sm text-gray-600">{member.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-900">
                      <span className="font-medium">{member.assignedApplications}</span> başvuru
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{member.assignedNotebooks}</span> defter
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Atanmayı Bekleyen İşler</h2>
          
          <div className="space-y-3">
            {pendingTasks.map((task) => (
              <div key={task.id} className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getTaskTypeBadge(task.type)}
                    {getPriorityBadge(task.priority)}
                  </div>
                  <span className="text-sm text-gray-500">{task.date}</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{task.title}</h3>
                  <p className="text-sm text-gray-600">
                    {task.studentName} ({task.studentId})
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex space-x-2">
              {assignmentMode === 'auto' ? (
                <button
                  onClick={handleAutoAssignment}
                  className="flex-1 btn bg-[#13126e] text-white py-2 px-4 rounded hover:bg-[#1f1e7e] transition-colors"
                >
                  <KeenIcon icon="setting-2" className="mr-2" />
                  Otomatik Ata
                </button>
              ) : (
                <button
                  onClick={handleManualAssignment}
                  disabled={selectedMembers.length === 0}
                  className="flex-1 btn bg-[#13126e] text-white py-2 px-4 rounded hover:bg-[#1f1e7e] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <KeenIcon icon="user" className="mr-2" />
                  Seçilenlere Ata ({selectedMembers.length})
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Summary */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Atama Özeti</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-700">{pendingTasks.length}</div>
            <div className="text-sm text-yellow-600">Bekleyen İş</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            
            <div className="text-sm text-green-600">Aktif Üye</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-700">
              {assignmentMode === 'manual' ? selectedMembers.length : 'Otomatik'}
            </div>
            <div className="text-sm text-blue-600">Seçili Üye</div>
          </div>
        </div>
      </div>

      {/* Assignment Modal */}
      {showAssignmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Atama Onayı
              </h3>
              <button 
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setShowAssignmentModal(false)}
              >
                <KeenIcon icon="cross" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-600 mb-2">
                {pendingTasks.length} iş, seçilen {selectedMembers.length} komisyon üyesi arasında dağıtılacak:
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                {selectedMembers.map(memberId => {
                  const member = commissionMembers.find(m => m.id === memberId);
                  return member ? (
                    <li key={memberId} className="flex items-center">
                      <KeenIcon icon="check" className="mr-2 text-green-500" />
                      {member.name}
                    </li>
                  ) : null;
                })}
              </ul>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button 
                className="btn bg-gray-200 text-gray-800 py-2 px-4 rounded"
                onClick={() => setShowAssignmentModal(false)}
              >
                İptal
              </button>
              <button 
                className="btn bg-[#13126e] text-white py-2 px-4 rounded"
                onClick={() => {
                  alert('Manuel atama işlemi tamamlandı!');
                  setShowAssignmentModal(false);
                  setSelectedMembers([]);
                }}
              >
                Atamaları Onayla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentPanel;