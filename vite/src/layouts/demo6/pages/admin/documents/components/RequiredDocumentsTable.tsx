// /pages/admin/documents/components/RequiredDocumentsTable.tsx
import React, { useState } from 'react';
import { Document } from '../types';
import DeleteConfirmModal from './DeleteConfirmModal';
import DocumentTableRow from './DocumentTableRow';
import DocumentEditRow from './DocumentEditRow';

interface Props {
  documents: Document[];
  onDelete: (id: number) => void;
  onUpdate: (document: Document) => void;
}

const RequiredDocumentsTable: React.FC<Props> = ({ documents, onDelete, onUpdate }) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Document | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<number | null>(null);

  const handleEdit = (document: Document) => {
    setEditingId(document.id);
    setEditForm(document);
  };

  const handleSave = (document: Document) => {
    onUpdate(document);
    setEditingId(null);
    setEditForm(null);
  };

  const handleDeleteClick = (documentId: number) => {
    setDocumentToDelete(documentId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (documentToDelete) {
      onDelete(documentToDelete);
      setShowDeleteModal(false);
      setDocumentToDelete(null);
    }
  };

  return (
    <>
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4">Belge Tipi</th>
            <th className="text-left py-3 px-4">Açıklama</th>
            <th className="text-left py-3 px-4">Zorunlu</th>
            <th className="text-left py-3 px-4">Dosya Formatları</th>
            <th className="text-right py-3 px-4">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {documents.map(doc => (
            editingId === doc.id && editForm ? (
              <DocumentEditRow
                key={doc.id}
                editForm={editForm}
                onSave={handleSave}
                onCancel={() => {
                  setEditingId(null);
                  setEditForm(null);
                }}
                onChange={setEditForm}
              />
            ) : (
              <DocumentTableRow
                key={doc.id}
                document={doc}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            )
          ))}
        </tbody>
      </table>

      {showDeleteModal && (
        <DeleteConfirmModal
          onClose={() => {
            setShowDeleteModal(false);
            setDocumentToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
};

export default RequiredDocumentsTable;