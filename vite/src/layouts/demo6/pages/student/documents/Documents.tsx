import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { Upload, FileText, CheckCircle2 } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'transcript' | 'internshipBook';
  status: 'pending' | 'uploaded' | 'approved';
  uploadDate?: Date;
  downloadUrl?: string;
}

export default function Documents() {
  const { toast } = useToast();
  const [documents, setDocuments] = React.useState<Document[]>([
    {
      id: '1',
      name: 'Transkript',
      type: 'transcript',
      status: 'pending',
    },
    {
      id: '2',
      name: 'Staj Defteri',
      type: 'internshipBook',
      status: 'pending',
    },
  ]);

  const handleFileUpload = (type: 'transcript' | 'internshipBook', file: File) => {
    // Dosya yükleme işlemleri
    setDocuments(docs =>
      docs.map(doc =>
        doc.type === type
          ? {
              ...doc,
              status: 'uploaded',
              uploadDate: new Date(),
            }
          : doc
      )
    );

    toast({
      title: "Belge Yüklendi",
      description: `${type === 'transcript' ? 'Transkript' : 'Staj Defteri'} başarıyla yüklendi.`,
    });
  };

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'uploaded':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'approved':
        return <CheckCircle2 className="h-5 w-5 text-blue-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };

  const handleDownload = (doc: Document) => {
    if (doc.downloadUrl) {
      const link = document.createElement('a');
      link.href = doc.downloadUrl;
      link.download = `${doc.type}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Belge Yükleme</h1>
      </div>

      <Alert>
        <AlertDescription>
          Staj defteri ve transkript belgelerinizi yükleyebilirsiniz. Belgeler PDF formatında olmalıdır.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {documents.map((doc) => (
          <Card key={doc.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{doc.name}</span>
                {getStatusIcon(doc.status)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`file-${doc.id}`}>Dosya Seçin</Label>
                  <Input
                    id={`file-${doc.id}`}
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(doc.type, file);
                      }
                    }}
                    disabled={doc.status === 'approved'}
                  />
                </div>

                {doc.uploadDate && (
                  <p className="text-sm text-muted-foreground">
                    Yüklenme Tarihi: {doc.uploadDate.toLocaleDateString('tr-TR')}
                  </p>
                )}

                {doc.status === 'approved' && (
                  <p className="text-sm text-green-600">
                    Belge onaylanmıştır.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Yüklenen Belgeler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    {doc.uploadDate && (
                      <p className="text-sm text-muted-foreground">
                        Yüklenme: {doc.uploadDate.toLocaleDateString('tr-TR')}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleDownload(doc);
                  }}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  İndir
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 