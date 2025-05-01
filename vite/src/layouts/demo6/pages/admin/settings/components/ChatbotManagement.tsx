// /src/layouts/demo6/pages/admin/Dashboard/components/ChatbotManagement.tsx
import React, { useState } from 'react';

const ChatbotManagement: React.FC = () => {
  const [chatbotActive, setChatbotActive] = useState(true);
  const [activeTab, setActiveTab] = useState('faq');
  
  const faqs = [
    { question: 'Staj başvurusu nasıl yapılır?', answer: 'Staj başvurusu için öncelikle...' },
    { question: 'Staj defteri nasıl hazırlanır?', answer: 'Staj defteri günlük olarak...' },
    { question: 'Staj sonuçları ne zaman açıklanır?', answer: 'Staj sonuçları komisyon...' },
  ];
  
  const userMessages = [
    { user: 'Ahmet Yılmaz', message: 'Staj başvuru tarihleri ne zaman?', date: '25.04.2025' },
    { user: 'Ayşe Demir', message: 'Staj defterini nereye teslim edeceğiz?', date: '24.04.2025' },
    { user: 'Mehmet Öz', message: 'Staj sonuçları açıklandı mı?', date: '23.04.2025' },
  ];
  
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Chatbot Yönetimi</h2>
        <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
          <input 
            type="checkbox" 
            name="chatbot-toggle" 
            id="chatbot-toggle" 
            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
            checked={chatbotActive}
            onChange={(e) => setChatbotActive(e.target.checked)}
          />
          <label 
            htmlFor="chatbot-toggle" 
            className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${chatbotActive ? 'bg-green-500' : 'bg-gray-300'}`}
          ></label>
        </div>
      </div>
      
      <div className="mb-4 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
          <li className="mr-2">
            <button 
              className={`inline-block p-4 rounded-t-lg ${activeTab === 'faq' ? 'border-b-2 border-blue-600 text-blue-600' : 'hover:text-gray-600 hover:border-gray-300'}`}
              onClick={() => setActiveTab('faq')}
            >
              Sıkça Sorulan Sorular
            </button>
          </li>
          <li>
            <button 
              className={`inline-block p-4 rounded-t-lg ${activeTab === 'messages' ? 'border-b-2 border-blue-600 text-blue-600' : 'hover:text-gray-600 hover:border-gray-300'}`}
              onClick={() => setActiveTab('messages')}
            >
              Kullanıcı Mesajları
            </button>
          </li>
        </ul>
      </div>
      
      {activeTab === 'faq' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-medium text-gray-900">SSS Listesi</h3>
            <button className="btn bg-[#13126e] text-white text-sm py-1 px-3 rounded">
              Yeni Soru Ekle
            </button>
          </div>
          
          {faqs.map((faq, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">{faq.question}</h4>
                  <p className="text-sm text-gray-600 mt-1">{faq.answer}</p>
                </div>
                <div className="flex space-x-1">
                  <button className="text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button className="text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {activeTab === 'messages' && (
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-3">Son Kullanıcı Mesajları</h3>
          
          <div className="space-y-3">
            {userMessages.map((message, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600">{message.user}</p>
                    <p className="font-medium">{message.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{message.date}</p>
                  </div>
                  <button className="btn bg-gray-100 text-gray-800 text-xs py-1 px-2 rounded">
                    SSS Ekle
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotManagement;