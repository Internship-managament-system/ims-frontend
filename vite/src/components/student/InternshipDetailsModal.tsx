import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface Internship {
  id: string;
  company: string;
  startDate: Date;
  endDate: Date;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'HALF_APPROVED';
  documents: {
    transcript: string;
    internshipBook: string;
  };
  rejectionReason?: string;
  evaluationNotes?: string;
}

interface InternshipDetailsModalProps {
  internship: Internship | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  HALF_APPROVED: 'bg-blue-100 text-blue-800',
};

const statusText = {
  PENDING: 'Beklemede',
  APPROVED: 'Onaylandı',
  REJECTED: 'Reddedildi',
  HALF_APPROVED: 'Kısmi Onay',
};

export default function InternshipDetailsModal({
  internship,
  isOpen,
  onClose,
}: InternshipDetailsModalProps) {
  if (!internship) return null;

  const handleDownload = (documentType: string) => {
    // İleride gerçek download URL'i backend'den alınacak
    const downloadUrls: { [key: string]: string } = {
      'application_form': '/documents/staj-formu.pdf',
      'acceptance_letter': '/documents/kabul-mektubu.pdf',
      'evaluation_form': '/documents/degerlendirme-formu.pdf'
    };

    const downloadUrl = downloadUrls[documentType];
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${documentType}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Staj Detayları</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Şirket</h3>
              <p>{internship.company}</p>
            </div>
            <div>
              <h3 className="font-semibold">Durum</h3>
              <Badge className={statusColors[internship.status]}>
                {statusText[internship.status]}
              </Badge>
            </div>
            <div>
              <h3 className="font-semibold">Başlangıç Tarihi</h3>
              <p>{internship.startDate.toLocaleDateString('tr-TR')}</p>
            </div>
            <div>
              <h3 className="font-semibold">Bitiş Tarihi</h3>
              <p>{internship.endDate.toLocaleDateString('tr-TR')}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Belgeler</h3>
            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={() => handleDownload('transcript')}
              >
                <Download className="h-4 w-4 mr-2" />
                Transkript
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDownload('internshipBook')}
              >
                <Download className="h-4 w-4 mr-2" />
                Staj Defteri
              </Button>
            </div>
          </div>

          {internship.rejectionReason && (
            <div className="space-y-2">
              <h3 className="font-semibold">Red Gerekçesi</h3>
              <p className="text-red-600">{internship.rejectionReason}</p>
            </div>
          )}

          {internship.evaluationNotes && (
            <div className="space-y-2">
              <h3 className="font-semibold">Değerlendirme Notları</h3>
              <p>{internship.evaluationNotes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 