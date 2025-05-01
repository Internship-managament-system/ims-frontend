// /pages/admin/commission/components/AddMemberForm.tsx
import React, { useState } from 'react';

interface AddMemberFormProps {
  onAddMember: (memberData: { name: string; title: string }) => void;
}

const AddMemberForm: React.FC<AddMemberFormProps> = ({ onAddMember }) => {
  const [newMember, setNewMember] = useState({ name: '', title: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddMember(newMember);
    setNewMember({ name: '', title: '' });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Yeni Komisyon Üyesi Ekle</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ad Soyad
          </label>
          <input
            type="text"
            value={newMember.name}
            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Unvan
          </label>
          <input
            type="text"
            value={newMember.title}
            onChange={(e) => setNewMember({ ...newMember, title: e.target.value })}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-[#13126e] text-white rounded-md hover:bg-opacity-90"
        >
          Üye Ekle
        </button>
      </form>
    </div>
  );
};

export default AddMemberForm;