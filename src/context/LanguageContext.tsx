import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Common
    'app.title': 'Book Events',
    'app.dark_mode': 'Dark Mode',
    'app.light_mode': 'Light Mode',
    
    // Auth
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.logout': 'Logout',
    'auth.username': 'Username',
    'auth.email': 'Email Address',
    'auth.password': 'Password',
    'auth.confirm_password': 'Confirm Password',
    'auth.secret_key': 'Admin Secret Key',
    'auth.register_as_admin': 'Register as Admin',
    'auth.register_as_user': 'Register as User',
    'auth.already_have_account': 'Already have an account?',
    'auth.dont_have_account': "Don't have an account?",
    
    // Events
    'events.all': 'All Events',
    'events.book_now': 'Book Now',
    'events.booked': 'Booked',
    'events.name': 'Event Name',
    'events.description': 'Description',
    'events.category': 'Category',
    'events.date': 'Date',
    'events.venue': 'Venue',
    'events.price': 'Price',
    'events.image': 'Image',
    
    // Admin
    'admin.panel': 'Admin Panel',
    'admin.create_event': 'Create Event',
    'admin.edit_event': 'Edit Event',
    'admin.delete_event': 'Delete Event',
    'admin.manage_events': 'Manage Events',
    'admin.view_bookings': 'View Bookings',
    
    // Booking
    'booking.success': 'Booking Successful!',
    'booking.congrats': 'Congratulations!',
    'booking.booked_event': 'You have successfully booked this event.',
    'booking.my_bookings': 'My Bookings',
    'booking.cancel': 'Cancel Booking',
    
    // Buttons
    'button.submit': 'Submit',
    'button.cancel': 'Cancel',
    'button.save': 'Save',
    'button.back': 'Back',
    'button.home': 'Go Home',
    
    // Footer
    'footer.rights_reserved': 'All rights reserved.',
    'footer.terms': 'Terms',
    'footer.privacy': 'Privacy',
    'footer.contact': 'Contact',
  },
  ar: {
    // Common
    'app.title': 'حجز الفعاليات',
    'app.dark_mode': 'الوضع الداكن',
    'app.light_mode': 'الوضع الفاتح',
    
    // Auth
    'auth.login': 'تسجيل الدخول',
    'auth.register': 'التسجيل',
    'auth.logout': 'تسجيل الخروج',
    'auth.username': 'اسم المستخدم',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.confirm_password': 'تأكيد كلمة المرور',
    'auth.secret_key': 'المفتاح السري للمسؤول',
    'auth.register_as_admin': 'التسجيل كمسؤول',
    'auth.register_as_user': 'التسجيل كمستخدم',
    'auth.already_have_account': 'لديك حساب بالفعل؟',
    'auth.dont_have_account': 'ليس لديك حساب؟',
    
    // Events
    'events.all': 'جميع الفعاليات',
    'events.book_now': 'احجز الآن',
    'events.booked': 'تم الحجز',
    'events.name': 'اسم الفعالية',
    'events.description': 'الوصف',
    'events.category': 'الفئة',
    'events.date': 'التاريخ',
    'events.venue': 'المكان',
    'events.price': 'السعر',
    'events.image': 'الصورة',
    
    // Admin
    'admin.panel': 'لوحة الإدارة',
    'admin.create_event': 'إنشاء فعالية',
    'admin.edit_event': 'تعديل فعالية',
    'admin.delete_event': 'حذف فعالية',
    'admin.manage_events': 'إدارة الفعاليات',
    'admin.view_bookings': 'عرض الحجوزات',
    
    // Booking
    'booking.success': 'تم الحجز بنجاح!',
    'booking.congrats': 'تهانينا!',
    'booking.booked_event': 'لقد تم حجز هذه الفعالية بنجاح.',
    'booking.my_bookings': 'حجوزاتي',
    'booking.cancel': 'إلغاء الحجز',
    
    // Buttons
    'button.submit': 'إرسال',
    'button.cancel': 'إلغاء',
    'button.save': 'حفظ',
    'button.back': 'رجوع',
    'button.home': 'الصفحة الرئيسية',
    
    // Footer
    'footer.rights_reserved_ar': 'جميع الحقوق محفوظة.',
    'footer.terms_ar': 'الشروط',
    'footer.privacy_ar': 'الخصوصية',
    'footer.contact_ar': 'اتصل بنا',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLang = localStorage.getItem('language');
    return (savedLang as Language) || 'en';
  });

  useEffect(() => {
    // Store the selected language
    localStorage.setItem('language', language);
    
    // Update document direction for RTL languages
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    
    // Add language class to body
    document.body.className = language === 'ar' ? 'font-arabic' : 'font-english';
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
