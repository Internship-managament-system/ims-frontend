import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import InternshipList from '@/components/student/InternshipList';
import InternshipDetailsModal from '@/components/student/InternshipDetailsModal';

export default function Applications() {
  const navigate = useNavigate();
  const [selectedInternship, setSelectedInternship] = React.useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState(false);

  // Örnek veri
  const mockInternships = [
    {
      id: '1',
      company: 'ABC Teknoloji',
      startDate: new Date('2024-07-01'),
      endDate: new Date('2024-08-01'),
      status: "PENDING",
      documents: {
        transcript: 'transcript1.pdf',
        internshipBook: 'internship1.pdf',
      },
    },
    {
      id: '2',
      company: 'XYZ Yazılım',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-07-01'),
      status: "APPROVED",
      documents: {
        transcript: 'transcript2.pdf',
        internshipBook: 'internship2.pdf',
      },
      evaluationNotes: 'Staj başarıyla tamamlandı.',
    },
  ];

  const handleViewDetails = (internship: any) => {
    setSelectedInternship(internship);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Staj Başvuruları</h1>
        <Button onClick={() => navigate('/student/applications/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Yeni Başvuru
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Başvuru Listesi</CardTitle>
        </CardHeader>
        <CardContent>
          <InternshipList
            internships={mockInternships as any}
            onViewDetails={handleViewDetails}
          />
        </CardContent>
      </Card>

      <InternshipDetailsModal
        internship={selectedInternship}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
    </div>
  );
} 