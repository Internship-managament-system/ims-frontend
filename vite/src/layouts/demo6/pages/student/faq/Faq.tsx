import React, { useState } from 'react';
import { Container } from '@/components';
import { KeenIcon } from '@/components/keenicons';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
}

const Faq: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Mock data - admin panelindeki gibi
  const mockFAQs: FAQ[] = [
    {
      id: '1',
      question: 'Staj başvurusu nasıl yapılır?',
      answer: 'Staj başvurusu yapmak için öncelikle sisteme giriş yapmanız gerekir. Ardından "Yeni Başvuru" butonuna tıklayarak başvuru formunu doldurabilirsiniz. Formda iş yeri bilgileri, staj dönemi ve diğer gerekli bilgileri eksiksiz olarak girmeniz gerekmektedir.',
      order: 1
    },
    {
      id: '2',
      question: 'Staj defteri ne zaman yüklenmeli?',
      answer: 'Staj defteri, stajınız bittikten sonra en geç 15 gün içinde sisteme yüklenmelidir. Defterinizin PDF formatında ve maksimum 10 MB boyutunda olması gerekmektedir. Geç yüklenen defterler kabul edilmeyebilir.',
      order: 2
    },
    {
      id: '3',
      question: 'Staj başvurum reddedilirse ne yapmalıyım?',
      answer: 'Staj başvurunuz reddedilirse, red gerekçesini inceleyerek eksiklikleri tamamlayabilirsiniz. Yeni bir başvuru yaparak tekrar değerlendirme sürecine girebilirsiniz. Gerekirse akademik danışmanınızdan yardım alabilirsiniz.',
      order: 3
    }
  ];

  const filteredFAQs = mockFAQs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => a.order - b.order);

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <Container>
      <div className="flex flex-col gap-5 lg:gap-7.5">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold text-gray-900">Sıkça Sorulan Sorular</h1>
          <p className="text-sm text-gray-600">
            Staj sürecinizle ilgili sık sorulan soruları burada bulabilirsiniz.
          </p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="relative">
            <KeenIcon icon="magnifier" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Sorularda ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#13126e] focus:border-transparent"
            />
          </div>
        </div>

        {/* FAQ List */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6">
            {filteredFAQs.length > 0 ? (
              <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <div key={faq.id} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleExpanded(faq.id)}
                      className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      <KeenIcon 
                        icon={expandedItems.has(faq.id) ? "minus" : "plus"} 
                        className="text-gray-500 flex-shrink-0 ml-2" 
                      />
                    </button>
                    
                    {expandedItems.has(faq.id) && (
                      <div className="px-4 pb-3 border-t border-gray-200">
                        <p className="text-gray-700 leading-relaxed pt-3">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <KeenIcon icon="message-question" className="text-4xl mx-auto" />
                </div>
                <p className="text-gray-500">
                  {searchTerm ? 'Arama kriterlerinize uygun soru bulunamadı.' : 'Henüz soru bulunmamaktadır.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <KeenIcon icon="information" className="text-blue-600 text-lg mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Sorunuz burada yok mu?</h3>
              <p className="text-sm text-blue-800 mb-2">
                Aradığınız soruyu bulamadıysanız, canlı destek üzerinden bizimle iletişime geçebilirsiniz.
              </p>
              <button className="text-sm text-blue-700 hover:text-blue-900 font-medium underline">
                Canlı Desteğe Git →
              </button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Faq; 