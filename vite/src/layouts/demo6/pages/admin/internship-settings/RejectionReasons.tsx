// /src/layouts/demo6/pages/admin/internship-settings/RejectionReasons.tsx
import React, { useState } from 'react';
import { Container } from '@/components';
import { KeenIcon } from '@/components/keenicons';

interface RejectionReason {
  id: number;
  reason: string;
  isCommon: boolean;
}

const RejectionReasons: React.FC = () => {
  const [reasons, setReasons] = useState<RejectionReason[]>([
    { id: 1, reason: "Staj defteri formatı uygun değil", isCommon: true },
    { id: 2, reason: "İmzalar eksik", isCommon: true },
    { id: 3, reason: "Staj süresi yetersiz", isCommon: true },
    { id: 4, reason: "Staj içeriği yetersiz", isCommon: true },
    { id: 5, reason: "İş Sağlığı ve Güvenliği belgesi eksik", isCommon: true },
  ]);
  
  const [newReason, setNewReason] = useState<string>("");
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>("");
  
  const handleAddReason = () => {
    if (newReason.trim() === "") return;
    
    const newReasonObj: RejectionReason = {
      id: Math.max(0, ...reasons.map(r => r.id)) + 1,
      reason: newReason.trim(),
      isCommon: true
    };
    
    setReasons([...reasons, newReasonObj]);
    setNewReason("");
  };
  
  const handleEdit = (id: number) => {
    const reason = reasons.find(r => r.id === id);
    if (!reason) return;
    
    setIsEditing(id);
    setEditText(reason.reason);
  };
  
  const handleSaveEdit = (id: number) => {
    if (editText.trim() === "") return;
    
    setReasons(reasons.map(r => 
      r.id === id ? { ...r, reason: editText.trim() } : r
    ));
    
    setIsEditing(null);
    setEditText("");
  };
  
  const handleToggleCommon = (id: number) => {
    setReasons(reasons.map(r => 
      r.id === id ? { ...r, isCommon: !r.isCommon } : r
    ));
  };
  
  const handleDelete = (id: number) => {
    if (window.confirm("Bu red gerekçesini silmek istediğinizden emin misiniz?")) {
      setReasons(reasons.filter(r => r.id !== id));
    }
  };

  return (
    <Container>
      <div className="p-5">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Staj Red Gerekçeleri</h2>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Komisyon üyeleri tarafından staj başvuruları veya staj defterlerinin reddedilmesi durumunda
              kullanılacak hazır red gerekçelerini yönetin. Bu gerekçeler, komisyon üyelerinin
              değerlendirme sürecinde hızlı seçim yapabilmesini sağlar.
            </p>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Yeni Red Gerekçesi Ekle</h3>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="border border-gray-300 rounded-md p-2 flex-grow"
                  placeholder="Red gerekçesini yazın..."
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddReason()}
                />
                <button 
                  className="btn bg-[#13126e] text-white px-4 py-2 rounded flex items-center gap-2"
                  onClick={handleAddReason}
                >
                  <KeenIcon icon="plus" />
                  <span>Ekle</span>
                </button>
              </div>
            </div>
            
            <h3 className="text-lg font-medium mb-3">Mevcut Red Gerekçeleri</h3>
            <div className="space-y-2">
              {reasons.map((reason) => (
                <div 
                  key={reason.id} 
                  className={`p-3 rounded-lg border ${reason.isCommon ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}
                >
                  {isEditing === reason.id ? (
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        className="border border-gray-300 rounded-md p-2 flex-grow"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit(reason.id)}
                        autoFocus
                      />
                      <button 
                        className="btn bg-green-500 text-white px-3 py-1 rounded"
                        onClick={() => handleSaveEdit(reason.id)}
                      >
                        <KeenIcon icon="check" />
                      </button>
                      <button 
                        className="btn bg-gray-300 text-gray-800 px-3 py-1 rounded"
                        onClick={() => setIsEditing(null)}
                      >
                        <KeenIcon icon="cross" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${reason.isCommon ? 'text-blue-800' : 'text-gray-700'}`}>
                          {reason.reason}
                        </span>
                        {reason.isCommon && (
                          <span className="inline-block px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            Sık Kullanılan
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <button 
                          className="btn bg-blue-100 text-blue-700 p-1 rounded"
                          onClick={() => handleToggleCommon(reason.id)}
                          title={reason.isCommon ? "Sık kullanılanlardan çıkar" : "Sık kullanılanlara ekle"}
                        >
                          <KeenIcon icon={reason.isCommon ? "bookmark" : "bookmark-minus"} />
                        </button>
                        <button 
                          className="btn bg-yellow-100 text-yellow-700 p-1 rounded"
                          onClick={() => handleEdit(reason.id)}
                          title="Düzenle"
                        >
                          <KeenIcon icon="pencil" />
                        </button>
                        <button 
                          className="btn bg-red-100 text-red-700 p-1 rounded"
                          onClick={() => handleDelete(reason.id)}
                          title="Sil"
                        >
                          <KeenIcon icon="trash" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {reasons.length === 0 && (
                <div className="text-center py-6 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-gray-500">Henüz red gerekçesi eklenmemiş.</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0 text-yellow-500">
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
              <p className="text-sm text-yellow-700">
                  Red gerekçelerini düzenlerken dikkat ediniz. Komisyon üyeleri bu gerekçeleri staj değerlendirmelerinde kullanacaktır.
                  "Sık Kullanılan" olarak işaretlenen gerekçeler, değerlendirme ekranında en üstte gösterilecektir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default RejectionReasons;