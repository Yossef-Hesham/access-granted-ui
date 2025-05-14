
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-background border-t border-border py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="text-muted-foreground text-sm">
          &copy; {currentYear} {t('app.title')}. {language === 'en' ? 'All rights reserved.' : 'جميع الحقوق محفوظة.'}
        </div>
        <div className="flex mt-4 md:mt-0">
          <a href="#" className="text-muted-foreground hover:text-primary text-sm mx-2">
            {language === 'en' ? 'Terms' : 'الشروط'}
          </a>
          <a href="#" className="text-muted-foreground hover:text-primary text-sm mx-2">
            {language === 'en' ? 'Privacy' : 'الخصوصية'}
          </a>
          <a href="#" className="text-muted-foreground hover:text-primary text-sm mx-2">
            {language === 'en' ? 'Contact' : 'اتصل بنا'}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
