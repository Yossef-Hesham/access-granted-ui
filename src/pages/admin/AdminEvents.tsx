
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '@/services/eventService';
import { useLanguage } from '@/context/LanguageContext';
import AdminLayout from './AdminLayout';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { PlusCircle, Edit, Trash2, ExternalLink } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const AdminEvents: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  
  const {
    data: events = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['events'],
    queryFn: eventService.getAllEvents,
  });
  
  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: (id: string | number) => eventService.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success(language === 'en' ? 'Event deleted successfully' : 'تم حذف الفعالية بنجاح');
    },
    onError: (error) => {
      console.error('Delete event error:', error);
      toast.error(language === 'en' ? 'Failed to delete event' : 'فشل في حذف الفعالية');
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });
  
  const handleDeleteEvent = (id: string | number) => {
    if (confirm(language === 'en' ? 'Are you sure you want to delete this event?' : 'هل أنت متأكد من أنك تريد حذف هذه الفعالية؟')) {
      setDeletingId(id);
      deleteEventMutation.mutate(id);
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{t('admin.manage_events')}</h1>
          <Button onClick={() => navigate('/admin/events/new')}>
            <PlusCircle className="h-4 w-4 mr-2" />
            {t('admin.create_event')}
          </Button>
        </div>
        
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-muted rounded"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground mb-4">
              {language === 'en' 
                ? 'Failed to load events. Please try again.'
                : 'فشل في تحميل الفعاليات. يرجى المحاولة مرة أخرى.'}
            </p>
            <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['events'] })}>
              {language === 'en' ? 'Retry' : 'إعادة المحاولة'}
            </Button>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground mb-4">
              {language === 'en' 
                ? 'No events found. Create your first event.'
                : 'لم يتم العثور على فعاليات. قم بإنشاء أول فعالية.'}
            </p>
            <Button onClick={() => navigate('/admin/events/new')}>
              <PlusCircle className="h-4 w-4 mr-2" />
              {t('admin.create_event')}
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('events.name')}</TableHead>
                <TableHead>{t('events.date')}</TableHead>
                <TableHead>{t('events.venue')}</TableHead>
                <TableHead>{t('events.price')}</TableHead>
                <TableHead className="text-right">{language === 'en' ? 'Actions' : 'الإجراءات'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell>{formatDate(event.date)}</TableCell>
                  <TableCell>{event.venue}</TableCell>
                  <TableCell>${event.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`/events/${event.id}`, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/admin/events/edit/${event.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEvent(event.id)}
                        disabled={deletingId === event.id}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminEvents;
