
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

const Footer: React.FC = () => {
  const { language, t } = useLanguage();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-background border-t border-border py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="text-muted-foreground text-sm">
          &copy; {currentYear} {t('app.title')}. {t(language === 'en' ? 'footer.rights_reserved' : 'footer.rights_reserved_ar')}
        </div>
        <div className="flex mt-4 md:mt-0">
          <a href="#" className="text-muted-foreground hover:text-primary text-sm mx-2">
            {t(language === 'en' ? 'footer.terms' : 'footer.terms_ar')}
          </a>
          <a href="#" className="text-muted-foreground hover:text-primary text-sm mx-2">
            {t(language === 'en' ? 'footer.privacy' : 'footer.privacy_ar')}
          </a>
          <a href="#" className="text-muted-foreground hover:text-primary text-sm mx-2">
            {t(language === 'en' ? 'footer.contact' : 'footer.contact_ar')}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
