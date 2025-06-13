// src/layouts/demo6/pages/admin/applications/components/AssignmentPanel.tsx
import React, { useState } from 'react';
import { KeenIcon } from '@/components/keenicons';
import { useToast } from '@/components/ui/use-toast';

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
  assignedMember?: number;
  assignmentType?: 'application' | 'notebook';
}

const AssignmentPanel: React.FC = () => {
  const { toast } = useToast();
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [assignmentMode, setAssignmentMode] = useState<'auto' | 'manual'>('manual');
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [taskAssignments, setTaskAssignments] = useState<{[key: string]: number}>({});
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

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

  const [pendingTasks, setPendingTasks] = useState<AssignmentTask[]>([
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
  ]);

  const toggleMemberSelection = (memberId: number) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleTaskAssignment = (taskId: string, memberId: number) => {
    setTaskAssignments(prev => ({
      ...prev,
      [taskId]: memberId
    }));
  };

  const getAssignmentType = (taskType: AssignmentTask['type']) => {
    switch (taskType) {
      case 'application':
        return 'Staj Başvurusu';
      case 'notebook':
      case 'graduate':
        return 'Staj Defteri';
      default:
        return 'Bilinmeyen';
    }
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

  const handleAutoAssign = () => {
    if (selectedCategories.length === 0) {
      toast({ title: "Hata", description: "Lütfen en az bir kategori seçiniz.", type: "error" });
      return;
    }

    if (selectedMembers.length === 0) {
      toast({ title: "Hata", description: "Lütfen en az bir komisyon üyesi seçiniz.", type: "error" });
      return;
    }

    // Otomatik atama işlemi
    toast({ title: "Bilgi", description: "Otomatik atama işlemi başlatılacak!", type: "info" });
    
    // API çağrısı simülasyonu
    setTimeout(() => {
      toast({ title: "Başarılı", description: `${selectedCategories.length} kategori için atama başarıyla tamamlandı!`, type: "success" });
    }, 2000);
  };

  const handleManualAssignment = () => {
    if (selectedCategories.length === 0) {
      alert('Lütfen en az bir kategori seçiniz.');
      return;
    }
    if (selectedMembers.length === 0) {
      alert('Lütfen en az bir komisyon üyesi seçiniz.');
      return;
    }
    setShowAssignmentModal(true);
  };

  const confirmAssignments = () => {
    // Seçilen kategoriler için atama yap
    const categoryNames = {
      'staj-basvurulari': 'Staj Başvuruları',
      'staj-defterleri': 'Staj Defterleri',
      'mezun-staj-defterleri': 'Mezun Staj Defterleri'
    };
    
    const assignments = selectedCategories.map(categoryId => ({
      category: categoryNames[categoryId as keyof typeof categoryNames],
      memberCount: selectedMembers.length
    }));
    
    console.log('Atamalar:', assignments);
    alert(`${selectedCategories.length} kategori için atama başarıyla tamamlandı!`);
    
    // Seçimleri temizle
    setSelectedCategories([]);
    setSelectedMembers([]);
    setShowAssignmentModal(false);
  };

  const toggleCategorySelection = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(cat => cat !== category)
        : [...prev, category]
    );
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
          </div>
          
          <div className="space-y-3">
            {commissionMembers.map((member) => (
              <div
                key={member.id}
                className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
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
              </div>
            ))}
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Atanmayı Bekleyen İşler</h2>
          
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes('staj-basvurulari')}
                  onChange={() => toggleCategorySelection('staj-basvurulari')}
                  className="mr-3"
                />
                <h3 className="font-medium text-gray-900">Staj Başvuruları</h3>
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes('staj-defterleri')}
                  onChange={() => toggleCategorySelection('staj-defterleri')}
                  className="mr-3"
                />
                <h3 className="font-medium text-gray-900">Staj Defterleri</h3>
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes('mezun-staj-defterleri')}
                  onChange={() => toggleCategorySelection('mezun-staj-defterleri')}
                  className="mr-3"
                />
                <h3 className="font-medium text-gray-900">Mezun Staj Defterleri</h3>
              </div>
            </div>
          </div>

          {/* Selection Info */}
          {selectedMembers.length === 0 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
              <div className="flex items-center">
                <KeenIcon icon="warning" className="mr-2 w-4 h-4" />
                <span>Atama yapabilmek için önce sol taraftan komisyon üyelerini seçiniz.</span>
              </div>
            </div>
          )}
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex space-x-2">
              {assignmentMode === 'auto' ? (
                <button
                  onClick={handleAutoAssign}
                  disabled={selectedCategories.length === 0}
                  className="flex-1 btn bg-[#13126e] text-white py-2 px-4 rounded hover:bg-[#1f1e7e] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <KeenIcon icon="setting-2" className="mr-2" />
                  Otomatik Ata ({selectedCategories.length} kategori)
                </button>
              ) : (
                <button
                  onClick={handleManualAssignment}
                  disabled={selectedCategories.length === 0 || selectedMembers.length === 0}
                  className="flex-1 btn bg-[#13126e] text-white py-2 px-4 rounded hover:bg-[#1f1e7e] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <KeenIcon icon="user" className="mr-2" />
                  Seçilen Kategorileri Ata ({selectedCategories.length})
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Modal */}
      {showAssignmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
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
              <p className="text-gray-600 mb-3">
                {selectedCategories.length} kategori için {selectedMembers.length} komisyon üyesine atama yapılacak:
              </p>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {selectedCategories.map((categoryId) => {
                  const categoryNames = {
                    'staj-basvurulari': 'Staj Başvuruları',
                    'staj-defterleri': 'Staj Defterleri',
                    'mezun-staj-defterleri': 'Mezun Staj Defterleri'
                  };
                  return (
                    <div key={categoryId} className="p-3 bg-gray-50 rounded border">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm text-gray-900">
                            {categoryNames[categoryId as keyof typeof categoryNames]}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-[#13126e]">
                            {selectedMembers.length} üye
                          </div>
                          <div className="text-xs text-gray-600">
                            Atanacak
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
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
                onClick={confirmAssignments}
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