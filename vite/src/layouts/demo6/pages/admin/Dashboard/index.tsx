import React from 'react';
import { Container } from '@/components';
import { KeenIcon } from '@/components/keenicons';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  return (
    <Container>
      <div className="p-5">
        {/* Header */}
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Fakülte ve departman yönetimi için merkezi kontrol paneli
          </p>
        </div>

        {/* Hızlı Erişim Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fakülte Yönetimi Kartı */}
          <Link to="/admin/faculty" className="block">
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-lg">
                  <KeenIcon icon="bank" className="text-2xl" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Fakülte Yönetimi</h2>
                  <p className="text-gray-600 mt-1">Fakülte ekle, düzenle ve yönet</p>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-blue-600 font-medium">Yönet &rarr;</span>
              </div>
            </div>
          </Link>

          {/* Departman Yönetimi Kartı */}
          <Link to="/admin/department" className="block">
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-lg">
                  <KeenIcon icon="abstract-14" className="text-2xl" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Departman Yönetimi</h2>
                  <p className="text-gray-600 mt-1">Departman ekle, düzenle ve yönet</p>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-green-600 font-medium">Yönet &rarr;</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default AdminDashboard; 