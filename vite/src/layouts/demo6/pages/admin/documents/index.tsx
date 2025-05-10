// /src/layouts/demo6/pages/admin/documents/index.tsx
import React, { useState } from 'react';
import { Container } from '@/components';
import { KeenIcon } from '@/components/keenicons';
import AddDocumentModal from './components/AddDocumentModal';
import RequiredDocumentsTable from './components/RequiredDocumentsTable';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import { Document } from './types';

const DocumentManagement: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<number | null>(null);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Örnek belgeler verisi
  const [requiredDocuments, setRequiredDocuments] = useState<Document[]>([
    {
      id: 1,
      type: 'Transkript',
      description: 'Güncel not dökümü belgesi',
      fileFormats: ['.pdf']
    },
    
    {
      id: 3,
      type: 'İş Sağlığı Belgesi',
      description: 'İşyeri sağlık raporu',
      fileFormats: ['.pdf', '.jpg', '.jpeg', '.png']
    },
    {
      id: 4,
      type: 'Staj Beyannamesi',
      description: 'Obisis üzerinden çıktısı alınıp imzalanmış staj beyannamesi',
      fileFormats: ['.pdf'],
      templateUrl: '/documents/staj-beyannamesi.pdf'
    },
    {
      id: 5,
      type: 'Staj Başvuru Kontrol Formu',
      description: 'Doldurulup imzalanmış staj başvuru kontrol formu',
      fileFormats: ['.pdf'],
      templateUrl: '/documents/staj-basvuru-kontrol-formu.pdf'
    },
    {
      id: 6,
      type: 'Yüzyüze Staj Taahhüt Dilekçesi',
      description: 'Doldurulup imzalanmış yüzyüze staj taahhüt dilekçesi',
      fileFormats: ['.pdf'],
      templateUrl: '/documents/yuzyuze-staj-taahhut-dilekcesi.pdf'
    }
  ]);

  // Belgeleri filtrele (sadece arama)
  const filteredDocuments = requiredDocuments.filter(doc => {
    return doc.type.toLowerCase().includes(searchTerm.toLowerCase()) || 
           doc.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleAddDocument = (newDocument: Omit<Document, 'id'>) => {
    const document: Document = {
      ...newDocument,
      id: requiredDocuments.length + 1
    };
    setRequiredDocuments([...requiredDocuments, document]);
    setShowAddModal(false);
  };

  const handleEditDocument = (updatedDocument: Document) => {
    setRequiredDocuments(requiredDocuments.map(doc => 
      doc.id === updatedDocument.id ? updatedDocument : doc
    ));
    setEditingDocument(null);
  };

  const handleDeleteClick = (id: number) => {
    setDocumentToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (documentToDelete) {
      setRequiredDocuments(requiredDocuments.filter(doc => doc.id !== documentToDelete));
      setShowDeleteModal(false);
      setDocumentToDelete(null);
    }
  };

  const handleEditClick = (document: Document) => {
    setEditingDocument(document);
    setShowAddModal(true);
  };

  return (
    <Container className="p-5">
      <div className="space-y-6">
        {/* Üst Başlık ve Ekleme Butonu */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Staj için Gerekli Belgeler</h2>
          <button
            className="bg-[#13126e] text-white px-4 py-2 text-sm font-medium rounded flex items-center"
            onClick={() => {
              setEditingDocument(null);
              setShowAddModal(true);
            }}
          >
            <KeenIcon icon="plus" className="mr-1" />
            Yeni Belge Ekle
          </button>
        </div>

        {/* Arama */}
        <div className="flex justify-end mb-6">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <KeenIcon icon="search" className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="border border-gray-300 rounded-md p-2 pl-10 w-full"
              placeholder="Belge ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Belge Tablosu */}
        <div className="bg-white shadow border">
          <div className="p-6">
            <RequiredDocumentsTable
              documents={filteredDocuments}
              onDelete={handleDeleteClick}
              onUpdate={handleEditClick}
            />
          </div>
        </div>

        {/* Bilgi Kutusu */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <KeenIcon icon="warning" className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Burada tanımlanan belgeler, öğrencilerin staj başvuruları sırasında yüklemesi gereken belgeleri temsil eder.
                Her belge için gerekli açıklamalar ve desteklenen dosya formatları belirtilebilir.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modaller */}
      {showAddModal && (
        <AddDocumentModal
          onClose={() => {
            setShowAddModal(false);
            setEditingDocument(null);
          }}
          onAdd={handleAddDocument}
          editDocument={editingDocument}
          onUpdate={handleEditDocument}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          onClose={() => {
            setShowDeleteModal(false);
            setDocumentToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
        />
      )}
    </Container>
  );
};

export default DocumentManagement;