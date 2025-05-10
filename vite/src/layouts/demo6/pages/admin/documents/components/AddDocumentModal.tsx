// /src/layouts/demo6/pages/admin/documents/components/AddDocumentModal.tsx
import React, { useState, useEffect } from 'react';
import { KeenIcon } from '@/components/keenicons';
import { Document } from '../types';

interface AddDocumentModalProps {
  onClose: () => void;
  onAdd: (document: Omit<Document, 'id'>) => void;
  onUpdate: (document: Document) => void;
  editDocument: Document | null;
}

const AddDocumentModal: React.FC<AddDocumentModalProps> = ({ 
  onClose, 
  onAdd, 
  onUpdate, 
  editDocument 
}) => {
  const [formData, setFormData] = useState<Omit<Document, 'id'>>({
    type: '',
    description: '',
    fileFormats: ['.pdf']
  });

  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Eğer düzenleme modunda ise, var olan belge bilgilerini form alanlarına doldur
  useEffect(() => {
    if (editDocument) {
      setFormData({
        type: editDocument.type,
        description: editDocument.description,
        fileFormats: editDocument.fileFormats,
        templateUrl: editDocument.templateUrl
      });

      if (editDocument.fileName) {
        setFileName(editDocument.fileName);
      }
    }
  }, [editDocument]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileFormatsChange = (value: string) => {
    setFormData({
      ...formData,
      fileFormats: value.split(',').map(format => format.trim())
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileToUpload(file);
      setFileName(file.name);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFileToUpload(e.dataTransfer.files[0]);
      setFileName(e.dataTransfer.files[0].name);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Dosya yüklendiyse, onun URL'sini formData'ya ekle
    // Gerçek uygulamada burada dosya yükleme işlemi yapılır
    const templateUrl = fileToUpload 
      ? URL.createObjectURL(fileToUpload) // Bu sadece demo amaçlı, gerçek uygulamada sunucuya yüklenir
      : formData.templateUrl;
    
    const submittedData = {
      ...formData,
      templateUrl,
      fileName: fileName || undefined
    };
    
    if (editDocument) {
      onUpdate({
        ...submittedData,
        id: editDocument.id
      });
    } else {
      onAdd(submittedData);
    }
    
    setIsSubmitting(false);
  };

  const handleDownloadTemplate = () => {
    if (editDocument?.templateUrl) {
      // Gerçek uygulamada burada şablon indirme işlemi yapılır
      window.open(editDocument.templateUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {editDocument ? 'Belgeyi Düzenle' : 'Yeni Belge Ekle'}
          </h3>
          <button 
            className="text-gray-500"
            onClick={onClose}
          >
            <KeenIcon icon="cross" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Belge Tipi
            </label>
            <input
              type="text"
              name="type"
              className="border p-2 w-full"
              value={formData.type}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Açıklama
            </label>
            <textarea
              name="description"
              className="border p-2 w-full"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Dosya Formatları (virgülle ayırın)
            </label>
            <input
              type="text"
              className="border p-2 w-full"
              value={formData.fileFormats.join(', ')}
              onChange={(e) => handleFileFormatsChange(e.target.value)}
              placeholder=".pdf, .doc, .docx"
              required
            />
          </div>

          {/* Şablon Dosyası Yükleme Alanı */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm text-gray-600">
                Şablon Dosyası
              </label>
              {editDocument?.templateUrl && (
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="text-blue-600 text-sm"
                >
                  <KeenIcon icon="download" className="mr-1 inline" />
                  İndir
                </button>
              )}
            </div>
            
            <div 
              className={`border-2 border-dashed rounded-lg p-4 text-center ${
                dragActive ? 'border-blue-300 bg-blue-50' : 'border-gray-300'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {fileName ? (
                <div className="flex items-center justify-center">
                  <KeenIcon icon="document" className="mr-2 text-gray-500" />
                  <span className="text-sm text-gray-700">{fileName}</span>
                  <button
                    type="button"
                    className="ml-2 text-red-500"
                    onClick={() => {
                      setFileToUpload(null);
                      setFileName('');
                    }}
                  >
                    <KeenIcon icon="cross" />
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Dosyayı buraya sürükleyin veya</p>
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileChange}
                    accept={formData.fileFormats.join(',')}
                  />
                  <label
                    htmlFor="file-upload"
                    className="bg-[#13126e] text-white px-3 py-1 rounded text-sm cursor-pointer"
                  >
                    Dosya Seçin
                  </label>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              İzin verilen formatlar: {formData.fileFormats.join(', ')}
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-800 px-4 py-2"
            >
              İptal
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-[#13126e] text-white px-4 py-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin inline-block mr-1">&#8635;</span>
                  İşleniyor...
                </>
              ) : (
                editDocument ? 'Güncelle' : 'Ekle'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDocumentModal;