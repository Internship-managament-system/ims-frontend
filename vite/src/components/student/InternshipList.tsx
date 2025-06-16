  import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

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
}

interface InternshipListProps {
  internships: Internship[];
  onViewDetails: (internship: Internship) => void;
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

export default function InternshipList({ internships, onViewDetails }: InternshipListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Şirket</TableHead>
          <TableHead>Başlangıç Tarihi</TableHead>
          <TableHead>Bitiş Tarihi</TableHead>
          <TableHead>Durum</TableHead>
          <TableHead>İşlemler</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {internships.map((internship) => (
          <TableRow key={internship.id}>
            <TableCell>{internship.company}</TableCell>
            <TableCell>{internship.startDate.toLocaleDateString('tr-TR')}</TableCell>
            <TableCell>{internship.endDate.toLocaleDateString('tr-TR')}</TableCell>
            <TableCell>
              <Badge className={statusColors[internship.status]}>
                {statusText[internship.status]}
              </Badge>
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onViewDetails(internship)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 