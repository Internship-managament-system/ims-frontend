import React, { useState, useEffect } from 'react';
import { Container } from '@/components';
import { KeenIcon } from '@/components';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
}

const faqSchema = Yup.object().shape({
  question: Yup.string()
    .min(10, 'Soru en az 10 karakter olmalı')
    .required('Soru zorunludur'),
  answer: Yup.string()
    .min(20, 'Cevap en az 20 karakter olmalı')
    .required('Cevap zorunludur'),
  order: Yup.number()
    .min(1, 'Sıra numarası 1 veya daha büyük olmalı')
    .required('Sıra numarası zorunludur'),
});

const FAQManagement: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - gerçek uygulamada API'den gelecek
  useEffect(() => {
    const mockFaqs: FAQ[] = [
      {
        id: '1',
        question: 'Staj başvurusu nasıl yapılır?',
        answer: 'Staj başvurusu için öncelikle sisteme giriş yapmanız gerekir. Ardından "Staj Başvurusu" menüsünden gerekli bilgileri doldurarak başvurunuzu tamamlayabilirsiniz.',
        order: 1,
      },
      {
        id: '2',
        question: 'Staj süresi ne kadar olmalı?',
        answer: 'Zorunlu staj süresi minimum 30 iş günüdür. Bu süre hafta sonları ve resmi tatiller hariç hesaplanır.',
        order: 2,
      },
      {
        id: '3',
        question: 'Staj defteri nasıl doldurulur?',
        answer: 'Staj defteri her gün düzenli olarak doldurulmalıdır. Yapılan işler detaylı bir şekilde açıklanmalı ve staj yeri yetkilisi tarafından imzalanmalıdır.',
        order: 3,
      }
    ];
    setFaqs(mockFaqs);
  }, []);

  const formik = useFormik({
    initialValues: {
      question: '',
      answer: '',
      order: faqs.length + 1
    },
    validationSchema: faqSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        if (editingFaq) {
          // Güncelleme işlemi
          const updatedFaq: FAQ = {
            ...editingFaq,
            ...values,
          };
          setFaqs(prev => prev.map(faq => faq.id === editingFaq.id ? updatedFaq : faq));
        } else {
          // Yeni ekleme işlemi
          const newFaq: FAQ = {
            id: Date.now().toString(),
            ...values,
          };
          setFaqs(prev => [...prev, newFaq]);
        }
        
        resetForm();
        setShowModal(false);
        setEditingFaq(null);
      } catch (error) {
        console.error('FAQ save error:', error);
      } finally {
        setLoading(false);
      }
    }
  });

  const handleEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    formik.setValues({
      question: faq.question,
      answer: faq.answer,
      order: faq.order
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bu SSS\'yi silmek istediğinizden emin misiniz?')) {
      setFaqs(prev => prev.filter(faq => faq.id !== id));
    }
  };

  const handleAddNew = () => {
    setEditingFaq(null);
    formik.resetForm();
    formik.setFieldValue('order', faqs.length + 1);
    setShowModal(true);
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => a.order - b.order);

  return (
    <Container>
      <div className="p-5">
        {/* Header */}
        <div className="flex flex-wrap items-center lg:items-end justify-between gap-5 pb-7.5">
          <div className="flex flex-col justify-center gap-2">
            <h1 className="text-xl font-semibold leading-none text-gray-900">
              SSS Yönetimi
            </h1>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
              Sıkça sorulan soruları yönetme sayfası
            </div>
          </div>
          <button
            onClick={handleAddNew}
            className="btn bg-[#13126e] text-white hover:bg-[#1f1e7e] flex items-center gap-2"
          >
            <KeenIcon icon="plus" />
            Yeni SSS Ekle
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <KeenIcon icon="magnifier" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="SSS'lerde ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#13126e] focus:border-[#13126e]"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Toplam: {faqs.length}</span>
            </div>
          </div>
        </div>

        {/* FAQ List */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">SSS Listesi</h2>
            
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-8">
                <KeenIcon icon="questionnaire-tablet" className="text-gray-400 text-4xl mb-4" />
                <p className="text-gray-600">
                  {searchTerm ? 'Arama kriterlerine uygun SSS bulunamadı.' : 'Henüz SSS eklenmemiş.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFaqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="border rounded-lg p-4 border-gray-200 bg-white"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium text-gray-500">#{faq.order}</span>
                        </div>
                        <h3 className="font-medium text-gray-900 mb-2">{faq.question}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{faq.answer}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(faq)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Düzenle"
                        >
                          <KeenIcon icon="edit" />
                        </button>
                        <button
                          onClick={() => handleDelete(faq.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Sil"
                        >
                          <KeenIcon icon="trash" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingFaq ? 'SSS Düzenle' : 'Yeni SSS Ekle'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingFaq(null);
                      formik.resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <KeenIcon icon="cross" />
                  </button>
                </div>

                <form onSubmit={formik.handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Soru *
                    </label>
                    <input
                      type="text"
                      {...formik.getFieldProps('question')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#13126e] focus:border-[#13126e]"
                      placeholder="Sıkça sorulan soruyu yazın..."
                    />
                    {formik.touched.question && formik.errors.question && (
                      <p className="text-red-500 text-xs mt-1">{formik.errors.question}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cevap *
                    </label>
                    <textarea
                      {...formik.getFieldProps('answer')}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#13126e] focus:border-[#13126e]"
                      placeholder="Sorunun cevabını yazın..."
                    />
                    {formik.touched.answer && formik.errors.answer && (
                      <p className="text-red-500 text-xs mt-1">{formik.errors.answer}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sıra Numarası *
                    </label>
                    <input
                      type="number"
                      {...formik.getFieldProps('order')}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#13126e] focus:border-[#13126e]"
                    />
                    {formik.touched.order && formik.errors.order && (
                      <p className="text-red-500 text-xs mt-1">{formik.errors.order}</p>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setEditingFaq(null);
                        formik.resetForm();
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 text-sm font-medium text-white bg-[#13126e] rounded-lg hover:bg-[#1f1e7e] disabled:bg-gray-400 transition-colors"
                    >
                      {loading ? 'Kaydediliyor...' : (editingFaq ? 'Güncelle' : 'Ekle')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default FAQManagement; 