// src/layouts/demo6/pages/admin/applications/components/AssignmentStatus.tsx
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface CommissionMember {
  id: number;
  name: string;
  selected: boolean;
}

interface AssignmentStatusProps {
  pendingApplications: number;
  internshipNotebooks: number;
  graduateNotebooks: number;
}

const AssignmentStatus: React.FC<AssignmentStatusProps> = ({ 
  pendingApplications = 5, 
  internshipNotebooks = 3, 
  graduateNotebooks = 2 
}) => {
  const { toast } = useToast();
  const [showMembersDropdown, setShowMembersDropdown] = useState(false);
  const [commissionMembers, setCommissionMembers] = useState<CommissionMember[]>([
    { id: 1, name: 'Prof. Dr. Ali Demir', selected: true },
    { id: 2, name: 'Dr. Mehmet Kaya', selected: true },
    { id: 3, name: 'Prof. Dr. Ayşe Yıldız', selected: true },
    { id: 4, name: 'Arş. Gör. Osman Buğra KAHRAMAN', selected: false },
    { id: 5, name: 'Arş. Gör. Fatma AZİZOĞLU', selected: false },
  ]);

  // Toggle commission member selection
  const toggleMemberSelection = (id: number) => {
    setCommissionMembers(commissionMembers.map(member => 
      member.id === id ? { ...member, selected: !member.selected } : member
    ));
  };

  const handleAssign = () => {
    if (selectedMembers.length === 0) {
      toast({ title: "Hata", description: "Lütfen en az bir komisyon üyesi seçiniz.", type: "error" });
      return;
    }

    // Atama işlemi
    toast({ title: "Bilgi", description: "Seçili komisyon üyeleri arasında atama yapılacak!", type: "info" });
    
    // API çağrısı simülasyonu
    setTimeout(() => {
      toast({ title: "Başarılı", description: "Atama işlemi başarıyla tamamlandı!", type: "success" });
    }, 2000);
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm h-full">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Atanmamış İşlemler</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-yellow-50 rounded border border-yellow-100">
          <div>
            <p className="font-medium">Bekleyen Başvurular</p>
            <p className="text-sm text-gray-600">Atama bekleyen başvurular</p>
          </div>
          <div>
            <span className="text-lg font-bold text-yellow-700">{pendingApplications}</span>
          </div>
        </div>
        <div className="flex justify-between items-center p-3 bg-blue-50 rounded border border-blue-100">
          <div>
            <p className="font-medium">Staj Defterleri</p>
            <p className="text-sm text-gray-600">Değerlendirici atanmamış</p>
          </div>
          <div>
            <span className="text-lg font-bold text-blue-700">{internshipNotebooks}</span>
          </div>
        </div>
        <div className="flex justify-between items-center p-3 bg-purple-50 rounded border border-purple-100">
          <div>
            <p className="font-medium">Mezun Defterleri</p>
            <p className="text-sm text-gray-600">Mezunlardan gelen defterler</p>
          </div>
          <div>
            <span className="text-lg font-bold text-purple-700">{graduateNotebooks}</span>
          </div>
        </div>
        <div className="relative">
          <button 
            className="btn bg-[#13126e] text-white w-full py-2 px-4 rounded mt-4"
            onClick={() => setShowMembersDropdown(!showMembersDropdown)}
          >
            Atama İşlemi
          </button>

          {/* Commission Members Selection Dropdown */}
          {showMembersDropdown && (
            <div className="absolute left-0 right-0 mt-2 p-3 bg-white border border-gray-200 rounded-lg z-10 shadow-lg">
              <h3 className="text-md font-medium mb-2">Komisyon Üyeleri</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {commissionMembers.map(member => (
                  <div key={member.id} className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id={`member-${member.id}`}
                      checked={member.selected}
                      onChange={() => toggleMemberSelection(member.id)}
                      className="w-4 h-4"
                    />
                    <label htmlFor={`member-${member.id}`}>
                      {member.name}
                    </label>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2 mt-3">
                <button 
                  className="px-3 py-1 bg-gray-200 rounded text-sm"
                  onClick={() => setShowMembersDropdown(false)}
                >
                  İptal
                </button>
                <button 
                  className="px-3 py-1 bg-[#13126e] text-white rounded text-sm"
                  onClick={handleAssign}
                >
                  Seçilenlere Ata
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentStatus;