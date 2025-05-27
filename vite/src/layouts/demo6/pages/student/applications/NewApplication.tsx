import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

export default function NewApplication() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [startDate, setStartDate] = React.useState<Date | undefined>(new Date());
  const [isGraduate, setIsGraduate] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form gönderme işlemleri
    toast({
      title: "Başvuru Gönderildi",
      description: "Staj başvurunuz başarıyla gönderildi.",
    });
    navigate('/student/applications');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Yeni Staj Başvurusu</h1>
        <Button variant="outline" onClick={() => navigate('/student/applications')}>
          Geri Dön
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Başvuru Formu</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="company">Şirket Adı</Label>
                <Input
                  id="company"
                  placeholder="Şirket adını giriniz"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Departman</Label>
                <Input
                  id="department"
                  placeholder="Departman adını giriniz"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Başlangıç Tarihi</Label>
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  disabled={(date) => {
                    const today = new Date();
                    const minDate = new Date();
                    minDate.setDate(today.getDate() + 10);
                    return date < minDate;
                  }}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Staj Süresi (Gün)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="20"
                  max="60"
                  placeholder="Staj süresini giriniz"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="graduate"
                  checked={isGraduate}
                  onCheckedChange={(checked) => setIsGraduate(checked as boolean)}
                />
                <Label htmlFor="graduate">Mezun durumundayım</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Staj Açıklaması</Label>
                <textarea
                  id="description"
                  className="w-full min-h-[100px] p-2 border rounded-md"
                  placeholder="Staj yapacağınız pozisyon ve görevler hakkında bilgi veriniz"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/student/applications')}
              >
                İptal
              </Button>
              <Button type="submit">
                Başvuruyu Gönder
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 