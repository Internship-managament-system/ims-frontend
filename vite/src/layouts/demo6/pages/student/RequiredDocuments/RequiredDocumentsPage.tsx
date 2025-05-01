import React from 'react';
import { KeenIcon } from '@/components/keenicons';
import { toAbsoluteUrl } from '@/utils';

interface DocumentItem {
  id: string;
  title: string;
  description: string;
  instructions: string;
  downloadUrl: string | null;
}

const documents: DocumentItem[] = [
  {
    id: 'declaration',
    title: 'Staj Beyannamesi',
    description: 'Obisis üzerinden çıktısı alınıp imzalanmış staj beyannamesi',
    instructions: 'Obisis sisteminden staj beyannamenizi indirip, çıktısını alarak imzalayınız.',
    downloadUrl: '/documents/staj-beyannamesi.pdf',
  },
  {
    id: 'transcript',
    title: 'Güncel Transkript',
    description: 'Obisisten alınmış güncel transkript',
    instructions: 'Obisis sisteminden güncel transkriptinizi alınız.',
    downloadUrl: null, // Dışarıdan indirilen bir belge olduğu için null
  },
  {
    id: 'course-status',
    title: 'Ders Durumu Belgesi',
    description: 'Staj yapılacak tarihlerin ders dönemine denk gelmesi durumunda ilgili dönemde alınan dersleri ve derslere devam zorunluluğu durumunu göstermek üzere güncel obisis ekran görüntüsü',
    instructions: 'Staj tarihleri ders dönemine denk geliyorsa, aldığınız dersleri ve devam zorunluluğu durumunu gösteren Obisis ekran görüntüsünü hazırlayınız.',
    downloadUrl: null, // Dışarıdan indirilen bir belge olduğu için null
  },
  {
    id: 'safety',
    title: 'İş Sağlığı ve Güvenliği Belgesi',
    description: '"İş sağlığı ve güvenliği" belgesi aslı/onaylı kopyası (veya iş sağlığı ve güvenliği ile ilgili dersleri aldığını gösterir transkript)',
    instructions: 'İş sağlığı ve güvenliği belgesinin aslını veya onaylı kopyasını hazırlayınız. Belge fotokopisinin arkasına/altına el yazısı ile "Teslim ettiğim bu belge aslının aynısıdır. Beyanların doğruluğunu taahhüt ederim." yazıp imzalayınız.',
    downloadUrl: null, // Dışarıdan indirilen bir belge olduğu için null
  },
  {
    id: 'application-form',
    title: 'Staj Başvuru Kontrol Formu',
    description: 'Doldurulup imzalanmış staj başvuru kontrol formu',
    instructions: 'Staj başvuru kontrol formunu indirip, doldurup imzalayınız.',
    downloadUrl: '/documents/staj-basvuru-kontrol-formu.pdf',
  },
  {
    id: 'commitment',
    title: 'Yüzyüze Staj Taahhüt Dilekçesi',
    description: 'Doldurulup imzalanmış yüzyüze staj taahhüt dilekçesi',
    instructions: 'Yüzyüze staj taahhüt dilekçesini indirip, doldurup imzalayınız.',
    downloadUrl: '/documents/yuzyuze-staj-taahhut-dilekcesi.pdf',
  },
];

const RequiredDocumentsPage: React.FC = () => {
  const handleDownload = (documentId: string, downloadUrl: string | null) => {
    if (downloadUrl) {
      // Belge indirme işlemi burada gerçekleştirilecek
      console.log(`Downloading document: ${documentId}`);
      // Gerçek indirme işlemi için:
      // window.open(toAbsoluteUrl(downloadUrl), '_blank');
    } else {
      console.log(`No download URL available for ${documentId}`);
    }
  };

  return (
    <div className="p-5 w-full">
      <div className="flex flex-col space-y-6">
        <div>
          <p className="text-gray-600">
            Staj başvurunuz için aşağıdaki belgeleri hazırlayıp sisteme yüklemeniz gerekmektedir. Her belge için açıklamaları okuyunuz ve belgeleri "Staj Başvurusu" sayfasından yükleyiniz.
          </p>
        </div>
        
        <div className="border-b border-gray-300 my-4"></div>
        
        <div className="flex flex-col space-y-4">
          {documents.map((document) => (
            <div 
              key={document.id} 
              className="border border-gray-200 rounded-lg p-5 bg-white hover:shadow-sm transition-shadow"
            >
              <div className="flex flex-col lg:flex-row justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-lg font-medium text-gray-900 mb-2">{document.title}</h2>
                  <p className="text-gray-600 text-sm mb-3">{document.description}</p>
                  <div className="bg-light rounded-md p-3 mb-4">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Talimat:</span> {document.instructions}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 min-w-[180px]">
                  {document.downloadUrl ? (
                    <button 
                      onClick={() => handleDownload(document.id, document.downloadUrl)}
                      className="btn flex items-center justify-center gap-2 bg-[#13126e] text-white"
                    >
                      <KeenIcon icon="cloud-download" className="text-white" />
                      <span>Belgeyi İndir</span>
                    </button>
                  ) : (
                    <div className="text-sm text-gray-500 italic p-2 border border-gray-200 rounded bg-gray-50 text-center">
                      Bu belge Obisis'ten almanız gereken bir belgedir
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RequiredDocumentsPage;