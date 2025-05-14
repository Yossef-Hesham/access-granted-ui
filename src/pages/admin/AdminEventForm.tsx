
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService, CreateEventRequest, UpdateEventRequest } from '@/services/eventService';
import { useLanguage } from '@/context/LanguageContext';
import AdminLayout from './AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar, ImageIcon, ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const AdminEventForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState<CreateEventRequest>({
    name: '',
    description: '',
    category: '',
    date: '',
    venue: '',
    price: 0,
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch event data if in edit mode
  const {
    data: event,
    isLoading: isEventLoading,
    error: eventError,
  } = useQuery({
    queryKey: ['event', id],
    queryFn: () => eventService.getEvent(id || ''),
    enabled: isEditMode,
  });
  
  // Set form data when event is loaded in edit mode
  useEffect(() => {
    if (isEditMode && event) {
      setFormData({
        name: event.name,
        description: event.description,
        category: event.category,
        date: new Date(event.date).toISOString().slice(0, 16), // Format as YYYY-MM-DDThh:mm
        venue: event.venue,
        price: event.price,
      });
      
      if (event.image) {
        setImagePreview(event.image);
      }
    }
  }, [isEditMode, event]);
  
  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: (data: CreateEventRequest) => eventService.createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success(language === 'en' ? 'Event created successfully' : 'تم إنشاء الفعالية بنجاح');
      navigate('/admin/events');
    },
    onError: (error) => {
      console.error('Create event error:', error);
      toast.error(language === 'en' ? 'Failed to create event' : 'فشل في إنشاء الفعالية');
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });
  
  // Update event mutation
  const updateEventMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: UpdateEventRequest }) => 
      eventService.updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', id] });
      toast.success(language === 'en' ? 'Event updated successfully' : 'تم تحديث الفعالية بنجاح');
      navigate('/admin/events');
    },
    onError: (error) => {
      console.error('Update event error:', error);
      toast.error(language === 'en' ? 'Failed to update event' : 'فشل في تحديث الفعالية');
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };
  
  const validateForm = () => {
    // Basic validation
    if (!formData.name || !formData.description || !formData.category || !formData.date || !formData.venue) {
      toast.error(language === 'en' ? 'Please fill in all required fields' : 'يرجى ملء جميع الحقول المطلوبة');
      return false;
    }
    
    if (formData.price < 0) {
      toast.error(language === 'en' ? 'Price cannot be negative' : 'لا يمكن أن يكون السعر سالبًا');
      return false;
    }
    
    // In create mode, image is required
    if (!isEditMode && !formData.image) {
      toast.error(language === 'en' ? 'Please upload an event image' : 'يرجى تحميل صورة للفعالية');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    if (isEditMode && id) {
      updateEventMutation.mutate({ id, data: formData });
    } else {
      createEventMutation.mutate(formData);
    }
  };
  
  if (isEditMode && isEventLoading) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-muted rounded"></div>
          ))}
        </div>
      </AdminLayout>
    );
  }
  
  if (isEditMode && eventError) {
    return (
      <AdminLayout>
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold mb-4">
            {language === 'en' ? 'Event Not Found' : 'لم يتم العثور على الفعالية'}
          </h2>
          <p className="text-muted-foreground mb-6">
            {language === 'en' 
              ? 'The event you are trying to edit does not exist or has been deleted.'
              : 'الفعالية التي تحاول تعديلها غير موجودة أو تم حذفها.'}
          </p>
          <Button onClick={() => navigate('/admin/events')}>
            {language === 'en' ? 'Back to Events' : 'العودة إلى الفعاليات'}
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate('/admin/events')} className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">
            {isEditMode ? t('admin.edit_event') : t('admin.create_event')}
          </h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">{t('events.name')}</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">{t('events.description')}</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={5}
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category">{t('events.category')}</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                disabled={isSubmitting}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">{t('events.date')}</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="date"
                  name="date"
                  type="datetime-local"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="pl-10"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="venue">{t('events.venue')}</Label>
              <Input
                id="venue"
                name="venue"
                value={formData.venue}
                onChange={handleInputChange}
                disabled={isSubmitting}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">{t('events.price')}</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleInputChange}
                disabled={isSubmitting}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">{t('events.image')}</Label>
            <div className="flex items-center space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('image')?.click()}
                className="h-32 w-32 flex flex-col items-center justify-center border-dashed"
                disabled={isSubmitting}
              >
                <ImageIcon className="h-6 w-6 mb-2" />
                <span className="text-xs">
                  {language === 'en' ? 'Upload Image' : 'تحميل صورة'}
                </span>
              </Button>
              
              {imagePreview && (
                <div className="h-32 w-32 relative">
                  <img
                    src={imagePreview}
                    alt="Event preview"
                    className="h-full w-full object-cover rounded"
                  />
                </div>
              )}
              
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/events')}
              disabled={isSubmitting}
            >
              {t('button.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting 
                ? (language === 'en' ? 'Saving...' : 'جاري الحفظ...')
                : isEditMode 
                  ? t('button.save') 
                  : (language === 'en' ? 'Create Event' : 'إنشاء فعالية')}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminEventForm;
