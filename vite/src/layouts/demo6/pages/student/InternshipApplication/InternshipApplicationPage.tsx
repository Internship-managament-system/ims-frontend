import React, { useState } from 'react';
import { KeenIcon } from '@/components/keenicons';

interface FormDataType {
    name: string;
    studentId: string;
    department: string;
    internshipType: string;
    company: string;
    startDate: string;
    endDate: string;
    files: {
      declaration: File | null;
      transcript: File | null;
      courseStatus: File | null;
      safety: File | null;
      applicationForm: File | null;
      commitment: File | null;
    }
  }
  
const InternshipApplicationPage: React.FC = () => {
    const [formData, setFormData] = useState<FormDataType>({
        name: '',
        studentId: '',
        department: '',
        internshipType: 'mandatory',
        company: '',
        startDate: '',
        endDate: '',
        files: {
          declaration: null,
          transcript: null,
          courseStatus: null,
          safety: null,
          applicationForm: null,
          commitment: null
        }
      });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (documentId: string, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      files: {
        ...prev.files,
        [documentId]: file
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form gönderildi:', formData);
    // API'ye gönderme işlemi burada yapılacak
  };

  return (
    <div className="p-5 w-full">
      <div className="mb-6">
        <h1 className="text-xl font-semibold mb-2">Staj Başvurusu</h1>
        <p className="text-gray-600">
          Staja başvurmak için aşağıdaki formu doldurun ve gerekli belgeleri yükleyin.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Kişisel Bilgiler */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-medium mb-4">Kişisel Bilgiler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Form alanları */}
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium">Adınız Soyadınız</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2"
                required
              />
            </div>
            {/* Diğer alanlar benzer şekilde... */}
          </div>
        </div>

        {/* Staj Bilgileri */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-medium mb-4">Staj Bilgileri</h2>
          {/* Staj bilgileri form alanları */}
        </div>

        {/* Belge Yükleme */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-medium mb-4">Gerekli Belgeler</h2>
          <p className="text-sm text-gray-600 mb-4">
            Lütfen gerekli belgeleri yükleyiniz. Belgeleri "Gerekli Belgeler" sayfasından indirebilirsiniz.
          </p>
          
          <div className="space-y-4">
            {/* Belge yükleme alanları */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Staj Beyannamesi</h3>
                  <p className="text-sm text-gray-600">İmzalanmış staj beyannamesi</p>
                </div>
                <input
                  type="file"
                  id="declaration"
                  className="hidden"
                  onChange={(e) => handleFileUpload('declaration', e.target.files?.[0] || null)}
                />
                <label 
                  htmlFor="declaration"
                  className="btn flex items-center justify-center gap-2 bg-[#13126e] text-white cursor-pointer"
                >
                  <KeenIcon icon="cloud-upload" className="text-white" />
                  <span>Belgeyi Yükle</span>
                </label>
              </div>
              {formData.files.declaration && (
                <div className="mt-2 text-sm text-green-600">
                  {formData.files.declaration.name} yüklendi
                </div>
              )}
            </div>

            {/* Diğer belge yükleme alanları benzer şekilde... */}
          </div>
        </div>

        <button 
          type="submit" 
          className="btn bg-[#13126e] text-white py-2 px-6 rounded"
        >
          Başvuruyu Tamamla
        </button>
      </form>
    </div>
  );
};

export default InternshipApplicationPage;