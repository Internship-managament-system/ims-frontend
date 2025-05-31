import React, { useState } from 'react';
import { Container } from '@/components';
import { KeenIcon } from '@/components/keenicons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  getAllInternshipApplications,
  getInternshipApplicationById,
  updateInternshipApplicationStatus,
  assignInternshipApplication,
  InternshipApplication,
  InternshipStatus,
} from '@/services/internshipService';
import { getAllUsers, User } from '@/services/userService';

// Başvuru durumu için renk ve etiket bilgileri
const statusConfig: Record<InternshipStatus, { label: string; color: string }> = {
  PENDING: { label: 'Beklemede', color: 'bg-yellow-100 text-yellow-800' },
  APPROVED: { label: 'Onaylandı', color: 'bg-green-100 text-green-800' },
  REJECTED: { label: 'Reddedildi', color: 'bg-red-100 text-red-800' },
  COMPLETED: { label: 'Tamamlandı', color: 'bg-blue-100 text-blue-800' },
};

// Modal tipleri
type ModalType = 'details' | 'status' | 'assign' | null;

const InternshipApplicationsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<InternshipApplication | null>(null);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [newStatus, setNewStatus] = useState<InternshipStatus>('PENDING');
  const [statusComment, setStatusComment] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  const queryClient = useQueryClient();

  // Tüm staj başvurularını getir
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['internship-applications'],
    queryFn: getAllInternshipApplications,
  });

  // Başvuru durumu güncelleme mutation'ı
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, comment }: { id: string; status: InternshipStatus; comment?: string }) =>
      updateInternshipApplicationStatus(id, { status, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internship-applications'] });
      closeModal();
      toast.success('Başvuru durumu başarıyla güncellendi');
    },
    onError: () => {
      toast.error('Başvuru durumu güncellenirken bir hata oluştu');
    },
  });

  // Başvuru atama mutation'ı
  const assignApplicationMutation = useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) =>
      assignInternshipApplication(id, { userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internship-applications'] });
      closeModal();
      toast.success('Başvuru başarıyla atandı');
    },
    onError: () => {
      toast.error('Başvuru atanırken bir hata oluştu');
    },
  });

  // Detay modalını aç
  const openDetailsModal = async (application: InternshipApplication) => {
    try {
      // Detaylı başvuru bilgisini getir
      const applicationDetail = await getInternshipApplicationById(application.id);
      setSelectedApplication(applicationDetail);
      setModalType('details');
    } catch (error) {
      console.error('Başvuru detayı alınırken hata:', error);
      toast.error('Başvuru detayı alınamadı');
    }
  };

  // Durum güncelleme modalını aç
  const openStatusModal = (application: InternshipApplication) => {
    setSelectedApplication(application);
    setNewStatus(application.status);
    setStatusComment('');
    setModalType('status');
  };

  // Atama modalını aç
  const openAssignModal = (application: InternshipApplication) => {
    setSelectedApplication(application);
    setSelectedUserId('');
    setModalType('assign');
  };

  // Modalı kapat
  const closeModal = () => {
    setSelectedApplication(null);
    setModalType(null);
  };

  // Durum güncelleme işlemi
  const handleStatusUpdate = () => {
    if (!selectedApplication) return;

    updateStatusMutation.mutate({
      id: selectedApplication.id,
      status: newStatus,
      comment: statusComment,
    });
  };

  // Atama işlemi
  const handleAssign = () => {
    if (!selectedApplication || !selectedUserId) return;

    assignApplicationMutation.mutate({
      id: selectedApplication.id,
      userId: selectedUserId,
    });
  };

  // Arama filtreleme
  const filteredApplications = applications.filter((app) => {
    const searchLower = searchTerm.toLowerCase();
    const studentNumber = app.studentEmail?.substring(0, 10) || '';
    
    return (
      app.workplaceName.toLowerCase().includes(searchLower) ||
      app.status.toLowerCase().includes(searchLower) ||
      studentNumber.toLowerCase().includes(searchLower) ||
      (app.studentFullName || '').toLowerCase().includes(searchLower) ||
      (app.activityField || '').toLowerCase().includes(searchLower) ||
      (app.provinceText || '').toLowerCase().includes(searchLower) ||
      (app.internshipTypeText || '').toLowerCase().includes(searchLower)
    );
  });

  return (
    <Container className="min-h-screen bg-white">
      <div className="pt-8 px-6">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Staj Başvuruları</h2>
          </div>

          <div className="mb-4 flex justify-end">
            <div className="relative w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Başvuru ara..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="py-10 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-2 text-sm font-medium text-gray-500">Öğrenci</th>
                    <th className="px-4 py-2 text-sm font-medium text-gray-500">Öğrenci No</th>
                    <th className="px-4 py-2 text-sm font-medium text-gray-500">İş Yeri</th>
                    <th className="px-4 py-2 text-sm font-medium text-gray-500">Başlangıç</th>
                    <th className="px-4 py-2 text-sm font-medium text-gray-500">Bitiş</th>
                    <th className="px-4 py-2 text-sm font-medium text-gray-500">Staj Türü</th>
                    <th className="px-4 py-2 text-sm font-medium text-gray-500">Durum</th>
                    <th className="px-4 py-2 text-sm font-medium text-gray-500">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-4 text-center text-gray-500">
                        Staj başvurusu bulunamadı
                      </td>
                    </tr>
                  ) : (
                    filteredApplications.map((application) => (
                      <tr key={application.id} className="border-b border-gray-200">
                        <td className="px-4 py-3 text-sm text-gray-700">
                          <div>
                            <p className="font-medium">{application.studentFullName}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {application.studentEmail?.substring(0, 10) || application.studentId}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          <div>
                            <p>{application.workplaceName}</p>
                            <p className="text-xs text-gray-500">{application.activityField}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {application.startDateFormatted || new Date(application.startDate).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {application.endDateFormatted || new Date(application.endDate).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {application.internshipTypeText || (application.internshipType === 'VOLUNTARY' ? 'Gönüllü' : 'Zorunlu')}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                              statusConfig[application.status].color
                            }`}
                          >
                            {application.statusText || statusConfig[application.status].label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <button
                            className="btn bg-blue-500 text-white text-xs py-1 px-2 rounded"
                            onClick={() => openDetailsModal(application)}
                          >
                            Detay
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Detay Modalı */}
        {modalType === 'details' && selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Staj Başvurusu Detayı</h3>
                <button className="text-gray-500" onClick={closeModal}>
                  <KeenIcon icon="cross" className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-medium mb-2">Öğrenci Bilgileri</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Öğrenci Adı</p>
                      <p>{selectedApplication.studentFullName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Öğrenci ID</p>
                      <p>{selectedApplication.studentEmail?.substring(0, 10) || selectedApplication.studentId}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Departman</p>
                      <p>{selectedApplication.departmentName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">E-posta</p>
                      <p>{selectedApplication.studentEmail}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium mb-2">Staj Bilgileri</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Staj Türü</p>
                      <p>{selectedApplication.internshipTypeText}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Program</p>
                      <p>{selectedApplication.programText}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Staj Dönemi</p>
                      <p>{selectedApplication.internshipPeriodText}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Haftalık Çalışma</p>
                      <p>{selectedApplication.weeklyWorkingDaysText}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Genel Sağlık Sigortası</p>
                      <p>{selectedApplication.hasGeneralHealthInsurance ? 'Var' : 'Yok'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium mb-2">İş Yeri Bilgileri</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">İş Yeri Adı</p>
                      <p>{selectedApplication.workplaceName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">İl/Ülke</p>
                      <p>{selectedApplication.provinceText}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Faaliyet Alanı</p>
                      <p>{selectedApplication.activityField}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">E-posta</p>
                      <p>{selectedApplication.workplaceEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Telefon</p>
                      <p>{selectedApplication.workplacePhone}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-gray-500">Adres</p>
                      <p>{selectedApplication.workplaceAddress}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium mb-2">Staj Tarihleri</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Başlangıç Tarihi</p>
                      <p>{selectedApplication.startDateFormatted || new Date(selectedApplication.startDate).toLocaleDateString('tr-TR')}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Bitiş Tarihi</p>
                      <p>{selectedApplication.endDateFormatted || new Date(selectedApplication.endDate).toLocaleDateString('tr-TR')}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Süre</p>
                      <p>{selectedApplication.durationInfo || `${selectedApplication.durationInDays} gün`}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium mb-2">Başvuru Durumu</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Durum</p>
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                          statusConfig[selectedApplication.status].color
                        }`}
                      >
                        {selectedApplication.statusText || statusConfig[selectedApplication.status].label}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Atanan Kişi</p>
                      <p>{selectedApplication.assignedToUserName || 'Atanmamış'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Oluşturma Tarihi</p>
                      <p>{new Date(selectedApplication.createdAt).toLocaleString('tr-TR')}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Son Güncelleme</p>
                      <p>{new Date(selectedApplication.updatedAt).toLocaleString('tr-TR')}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    Kapat
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Durum Güncelleme Modalı */}
        {modalType === 'status' && selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Başvuru Durumunu Güncelle</h3>
                <button className="text-gray-500" onClick={closeModal}>
                  <KeenIcon icon="cross" className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Durum</label>
                  <select
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as InternshipStatus)}
                  >
                    <option value="PENDING">Beklemede</option>
                    <option value="APPROVED">Onaylandı</option>
                    <option value="REJECTED">Reddedildi</option>
                    <option value="COMPLETED">Tamamlandı</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-md p-2"
                    rows={3}
                    value={statusComment}
                    onChange={(e) => setStatusComment(e.target.value)}
                    placeholder="Durum değişikliği için açıklama giriniz (opsiyonel)"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-2">
                <button onClick={closeModal} className="btn bg-gray-200 text-gray-800 py-2 px-4 rounded">
                  İptal
                </button>
                <button
                  onClick={handleStatusUpdate}
                  className="btn bg-[#13126e] text-white py-2 px-4 rounded flex items-center"
                  disabled={updateStatusMutation.isPending}
                >
                  {updateStatusMutation.isPending ? (
                    <>
                      <span className="animate-spin mr-2">
                        <KeenIcon icon="spinner" className="h-4 w-4" />
                      </span>
                      <span>İşleniyor...</span>
                    </>
                  ) : (
                    'Güncelle'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Atama Modalı */}
        {modalType === 'assign' && selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Başvuruyu Kullanıcıya Ata</h3>
                <button className="text-gray-500" onClick={closeModal}>
                  <KeenIcon icon="cross" className="h-5 w-5" />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kullanıcı ID</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  placeholder="Kullanıcı ID'sini girin"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Atamak istediğiniz kullanıcının ID'sini girin
                </p>
              </div>

              <div className="mt-6 flex justify-end space-x-2">
                <button onClick={closeModal} className="btn bg-gray-200 text-gray-800 py-2 px-4 rounded">
                  İptal
                </button>
                <button
                  onClick={handleAssign}
                  className="btn bg-[#13126e] text-white py-2 px-4 rounded flex items-center"
                  disabled={assignApplicationMutation.isPending || !selectedUserId}
                >
                  {assignApplicationMutation.isPending ? (
                    <>
                      <span className="animate-spin mr-2">
                        <KeenIcon icon="spinner" className="h-4 w-4" />
                      </span>
                      <span>İşleniyor...</span>
                    </>
                  ) : (
                    'Ata'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default InternshipApplicationsPage; 