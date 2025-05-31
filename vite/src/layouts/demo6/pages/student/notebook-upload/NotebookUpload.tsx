import React, { useState } from 'react';
import { Container } from '@/components';
import { KeenIcon } from '@/components/keenicons';

interface InternshipNotebook {
  id: string;
  internshipType: 'SOFTWARE' | 'HARDWARE';
  companyName: string;
  uploadDate?: string;
  status: 'NOT_UPLOADED' | 'UPLOADED' | 'APPROVED' | 'REJECTED';
  fileName?: string;
  fileSize?: string;
  rejectionReason?: string;
}

const NotebookUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);

  // Mock data - öğrencinin stajları
  const [internships, setInternships] = useState<InternshipNotebook[]>([
    {
      id: '1',
      internshipType: 'SOFTWARE',
      companyName: 'ABC Teknoloji A.Ş.',
      status: 'NOT_UPLOADED'
    },
    {
      id: '2',
      internshipType: 'HARDWARE',
      companyName: 'XYZ Elektronik Ltd.',
      uploadDate: '2024-01-15',
      status: 'UPLOADED',
      fileName: 'staj_defteri_donanim.pdf',
      fileSize: '2.5 MB'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NOT_UPLOADED':
        return 'bg-gray-100 text-gray-800';
      case 'UPLOADED':
        return 'bg-blue-100 text-blue-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'NOT_UPLOADED':
        return 'Yüklenmedi';
      case 'UPLOADED':
        return 'Yüklendi';
      case 'APPROVED':
        return 'Onaylandı';
      case 'REJECTED':
        return 'Reddedildi';
      default:
        return status;
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, internshipId: string) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadingFor(internshipId);
    }
  };

  const handleUpload = () => {
    if (selectedFile && uploadingFor) {
      // Simüle upload
      setInternships(prev => prev.map(internship => 
        internship.id === uploadingFor 
          ? {
              ...internship,
              status: 'UPLOADED',
              fileName: selectedFile.name,
              fileSize: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
              uploadDate: new Date().toISOString().split('T')[0]
            }
          : internship
      ));
      
      setSelectedFile(null);
      setUploadingFor(null);
      
      // Reset file input
      const fileInputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
      fileInputs.forEach(input => input.value = '');
    }
  };

  const handleDownload = (internship: InternshipNotebook) => {
    // Simüle download
    console.log(`Downloading ${internship.fileName}`);
  };

  return (
    <Container className="min-h-screen bg-white">
      <div className="flex flex-col gap-5 lg:gap-7.5 pt-8 px-6">
        {/* Header */}
        <div className="flex flex-col gap-2 mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Staj Defteri Yükleme</h1>
          <p className="text-sm text-gray-600">
            Tamamladığınız stajlar için staj defterlerinizi yükleyin.
          </p>
        </div>

        {/* Upload Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <KeenIcon icon="information" className="text-blue-600 text-lg mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Yükleme Talimatları</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Staj defteri PDF formatında olmalıdır</li>
                <li>• Maksimum dosya boyutu: 10 MB</li>
                <li>• Dosya adı Türkçe karakter içermemelidir</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Internships List */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Stajlarım</h2>
            <div className="space-y-4">
              {internships.map((internship) => (
                <div key={internship.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900">{internship.companyName}</h3>
                        <span className="text-sm text-gray-600">
                          ({internship.internshipType === 'SOFTWARE' ? 'Yazılım' : 'Donanım'} Stajı)
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(internship.status)}`}>
                          {getStatusText(internship.status)}
                        </span>
                      </div>
                      
                      {internship.fileName && (
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span>📄 {internship.fileName}</span>
                          <span>📊 {internship.fileSize}</span>
                          <span>📅 {new Date(internship.uploadDate!).toLocaleDateString('tr-TR')}</span>
                        </div>
                      )}

                      {internship.rejectionReason && (
                        <div className="bg-red-50 border border-red-200 rounded p-2 text-sm text-red-800">
                          <strong>Red Gerekçesi:</strong> {internship.rejectionReason}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {internship.status === 'NOT_UPLOADED' || internship.status === 'REJECTED' ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => handleFileSelect(e, internship.id)}
                            className="hidden"
                            id={`file-${internship.id}`}
                          />
                          <label
                            htmlFor={`file-${internship.id}`}
                            className="cursor-pointer flex items-center gap-1 px-3 py-1 text-sm text-[#13126e] hover:bg-[#13126e] hover:text-white border border-[#13126e] rounded transition-colors"
                          >
                            <KeenIcon icon="upload" className="text-xs" />
                            Dosya Seç
                          </label>
                          {uploadingFor === internship.id && selectedFile && (
                            <button
                              onClick={handleUpload}
                              className="flex items-center gap-1 px-3 py-1 text-sm text-white bg-green-600 hover:bg-green-700 rounded transition-colors"
                            >
                              <KeenIcon icon="check" className="text-xs" />
                              Yükle
                            </button>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => handleDownload(internship)}
                          className="flex items-center gap-1 px-3 py-1 text-sm text-[#13126e] hover:bg-[#13126e] hover:text-white border border-[#13126e] rounded transition-colors"
                        >
                          <KeenIcon icon="download" className="text-xs" />
                          İndir
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {internships.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <KeenIcon icon="book-open" className="text-4xl mx-auto" />
                </div>
                <p className="text-gray-500">Henüz tamamlanmış stajınız bulunmamaktadır.</p>
              </div>
            )}
          </div>
        </div>

        {/* Selected File Info */}
        {selectedFile && uploadingFor && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <KeenIcon icon="check-circle" className="text-green-600 text-lg" />
              <div>
                <h3 className="font-medium text-green-900">Seçilen Dosya</h3>
                <p className="text-sm text-green-800">
                  {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(1)} MB)
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default NotebookUpload; 