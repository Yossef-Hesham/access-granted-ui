
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Globe, LogOut } from 'lucide-react';

const Header: React.FC = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary">
          {t('app.title')}
        </Link>

        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleLanguage}
            className="rounded-full"
            aria-label="Toggle language"
          >
            <Globe className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleDarkMode}
            className="rounded-full"
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          
          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Button variant="outline" asChild>
                    <Link to="/admin">{t('admin.panel')}</Link>
                  </Button>
                )}
                <Button variant="outline" asChild>
                  <Link to="/bookings">{t('booking.my_bookings')}</Link>
                </Button>
                <Button variant="ghost" onClick={handleLogout}>
                  <LogOut className="h-5 w-5 mr-2" />
                  {t('auth.logout')}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link to="/login">{t('auth.login')}</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">{t('auth.register')}</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
