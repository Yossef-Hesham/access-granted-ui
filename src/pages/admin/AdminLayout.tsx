
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Home, CalendarDays, Users, Globe, Moon, Sun } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { t, language, setLanguage } = useLanguage();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-6 flex-1 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="text-lg font-bold mb-6">{t('admin.panel')}</div>
          
          <nav className="space-y-1">
            <Button
              variant={isActive('/admin') ? 'default' : 'ghost'}
              className="w-full justify-start"
              asChild
            >
              <Link to="/admin">
                <Home className="h-4 w-4 mr-2" />
                {t('language') === 'en' ? 'Dashboard' : 'لوحة التحكم'}
              </Link>
            </Button>
            
            <Button
              variant={isActive('/admin/events') ? 'default' : 'ghost'}
              className="w-full justify-start"
              asChild
            >
              <Link to="/admin/events">
                <CalendarDays className="h-4 w-4 mr-2" />
                {t('language') === 'en' ? 'Events' : 'الفعاليات'}
              </Link>
            </Button>
            
            <Button
              variant={isActive('/admin/bookings') ? 'default' : 'ghost'}
              className="w-full justify-start"
              asChild
            >
              <Link to="/admin/bookings">
                <Users className="h-4 w-4 mr-2" />
                {t('language') === 'en' ? 'Bookings' : 'الحجوزات'}
              </Link>
            </Button>
          </nav>
          
          <div className="pt-4 border-t border-border">
            <div className="flex flex-col space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={toggleDarkMode}
              >
                {isDarkMode ? (
                  <>
                    <Sun className="h-4 w-4 mr-2" />
                    {t('app.light_mode')}
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4 mr-2" />
                    {t('app.dark_mode')}
                  </>
                )}
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              >
                <Globe className="h-4 w-4 mr-2" />
                {language === 'en' ? 'العربية' : 'English'}
              </Button>
            </div>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="bg-background rounded-lg p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
