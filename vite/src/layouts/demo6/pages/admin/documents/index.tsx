// /pages/admin/documents/index.tsx
import React, { useState } from 'react';
import { Container } from '@/components';
import RequiredDocumentsTable from '../documents/components/RequiredDocumentsTable';
import StudentDocumentsTable from '../documents/components/StudentDocumentsTable';
import AddDocumentModal from '../documents/components/AddDocumentModal';
import { Document, StudentDocument } from './types';

const DocumentManagement: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'graduate'>('active');
  
  // Örnek gerekli belgeler verisi
  const [requiredDocuments, setRequiredDocuments] = useState<Document[]>([
    {
      id: 1,
      type: 'Transkript',
      isRequired: true,
      description: 'Güncel not dökümü belgesi',
      fileFormats: ['.pdf']
    },
    {
      id: 2,
      type: 'Staj Defteri',
      isRequired: true,
      description: 'Staj süresince yapılan işlerin detaylı raporu',
      fileFormats: ['.pdf', '.doc', '.docx']
    },
    {
      id: 3,
      type: 'İş Sağlığı Belgesi',
      isRequired: true,
      description: 'İşyeri sağlık raporu',
      fileFormats: ['.pdf', '.jpg', '.jpeg', '.png']
    }
  ]);

  // Örnek öğrenci belgeleri verisi
  const [studentDocuments, setStudentDocuments] = useState<StudentDocument[]>([
    {
      id: 1,
      studentName: 'Ahmet Yılmaz',
      documentType: 'Transkript',
      uploadDate: '25.04.2025',
      status: 'pending',
      fileUrl: '/documents/transkript.pdf'
    },
    // ... diğer belgeler
  ]);

  const handleAddDocument = (newDocument: Omit<Document, 'id'>) => {
    const document: Document = {
      ...newDocument,
      id: requiredDocuments.length + 1
    };
    setRequiredDocuments([...requiredDocuments, document]);
  };

  const handleDeleteDocument = (id: number) => {
    setRequiredDocuments(requiredDocuments.filter(doc => doc.id !== id));
  };

  const handleUpdateDocument = (updatedDocument: Document) => {
    setRequiredDocuments(requiredDocuments.map(doc => 
      doc.id === updatedDocument.id ? updatedDocument : doc
    ));
  };

  return (
    <Container className="p-5">
      <div className="space-y-6">
        {/* Gerekli Belgeler Bölümü */}
        <div className="bg-white shadow border">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Staj için Gerekli Belgeler</h2>
              <button
                className="bg-[#13126e] text-white px-4 py-2 text-sm font-medium"
                onClick={() => setShowAddModal(true)}
              >
                Yeni Belge Ekle
              </button>
            </div>
            <RequiredDocumentsTable
              documents={requiredDocuments}
              onDelete={handleDeleteDocument}
              onUpdate={handleUpdateDocument}
            />
          </div>
        </div>

        
      </div>

      {showAddModal && (
        <AddDocumentModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddDocument}
        />
      )}
    </Container>
  );
};

export default DocumentManagement;