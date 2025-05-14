
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/sonner';

const RegisterPage: React.FC = () => {
  const { registerUser, registerAdmin } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  // Form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('user');

  const validateForm = () => {
    // Basic validation
    if (!username || !email || !password || !confirmPassword) {
      toast.error(language === 'en' ? 'Please fill in all fields' : 'يرجى ملء جميع الحقول');
      return false;
    }

    if (password !== confirmPassword) {
      toast.error(language === 'en' ? 'Passwords do not match' : 'كلمات المرور غير متطابقة');
      return false;
    }

    if (password.length < 6) {
      toast.error(
        language === 'en' 
          ? 'Password must be at least 6 characters' 
          : 'يجب أن تكون كلمة المرور 6 أحرف على الأقل'
      );
      return false;
    }

    if (activeTab === 'admin' && !secretKey) {
      toast.error(
        language === 'en' 
          ? 'Admin secret key is required' 
          : 'المفتاح السري للمسؤول مطلوب'
      );
      return false;
    }

    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (activeTab === 'admin') {
        await registerAdmin(username, email, password, secretKey);
      } else {
        await registerUser(username, email, password);
      }
      
      // Redirect to homepage after successful registration
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      // Error already handled by auth service
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex justify-center items-center min-h-[80vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">{t('auth.register')}</CardTitle>
            <CardDescription className="text-center">
              {t('auth.already_have_account')}{' '}
              <Link to="/login" className="text-primary hover:underline">
                {t('auth.login')}
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="mb-4"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="user">{t('auth.register_as_user')}</TabsTrigger>
                <TabsTrigger value="admin">{t('auth.register_as_admin')}</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">{t('auth.username')}</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={language === 'en' ? 'Enter your username' : 'أدخل اسم المستخدم'}
                  disabled={isLoading}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={language === 'en' ? 'Enter your email' : 'أدخل بريدك الإلكتروني'}
                  disabled={isLoading}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={language === 'en' ? '••••••••' : '••••••••'}
                  disabled={isLoading}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('auth.confirm_password')}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={language === 'en' ? '••••••••' : '••••••••'}
                  disabled={isLoading}
                  required
                />
              </div>
              
              {activeTab === 'admin' && (
                <div className="space-y-2">
                  <Label htmlFor="secretKey">{t('auth.secret_key')}</Label>
                  <Input
                    id="secretKey"
                    type="password"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    placeholder={language === 'en' ? 'Enter admin secret key' : 'أدخل المفتاح السري للمسؤول'}
                    disabled={isLoading}
                    required={activeTab === 'admin'}
                  />
                </div>
              )}
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading 
                  ? (language === 'en' ? 'Registering...' : 'جاري التسجيل...') 
                  : t('auth.register')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default RegisterPage;
