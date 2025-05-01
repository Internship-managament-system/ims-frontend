// /pages/admin/commission/components/CommissionMemberList.tsx
import React from 'react';

interface CommissionMember {
    id: string;
    name: string;
    role: string;
    status: string;
    reviewedApplications: number;
    reviewedFiles: number;
}

interface CommissionMemberListProps {
    members: CommissionMember[];
    onSetChairman: (memberId: string) => void;
    onRemoveMember: (memberId: string) => void;
}

const CommissionMemberList: React.FC<CommissionMemberListProps> = ({
    members,
    onSetChairman,
    onRemoveMember
}) => {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Komisyon Üyesi İstatistikleri</h2>
            <table className="w-full">
                <thead>
                    <tr className="border-b">
                        <th className="text-left py-4">Komisyon Üyesi</th>
                        <th className="text-left py-4">İncelenen Başvuru</th>
                        <th className="text-left py-4">Değerlendirilen Defter</th>
                        <th className="text-center py-4">İşlemler</th>
                    </tr>
                </thead>
                <tbody>
                    {members.map((member) => (
                        <tr key={member.id} className="border-b">
                            <td className="py-4">{member.name}</td>
                            <td className="py-4">{member.reviewedApplications}</td>
                            <td className="py-4">{member.reviewedFiles}</td>
                            <td className="py-4 text-center">
                                <button
                                    onClick={() => onSetChairman(member.id)}
                                    className="mr-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Başkan Ata
                                </button>
                                <button
                                    onClick={() => onRemoveMember(member.id)}
                                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                                >
                                    Üyeyi Çıkar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CommissionMemberList;