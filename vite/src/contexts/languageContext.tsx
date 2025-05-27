// src/contexts/LanguageContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type Language = 'tr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: Record<string, Record<string, string>>;
  t: (key: string) => string;
}

// Tüm uygulamanın metinlerini içeren çeviri verileri
const translations: Record<Language, Record<string, string>> = {
  tr: {
    // Login ve şifre sıfırlama sayfaları
    'email': 'E-posta',
    'password': 'Şifre',
    'forgotPassword': 'Şifrenizi mi unuttun?',
    'login': 'Giriş Yap',
    'register': 'Kayıt Ol',
    'enterPassword': 'Şifrenizi girin',
    'rememberMe': 'Beni hatırla',
    'resetPassword': 'Şifrenizi Sıfırlayın',
    'enterEmail': 'E-Mail Adresinizi Giriniz',
    'checkEmail': 'Mail adresinizi kontrol edin',
    'passwordChanged': 'Şifreniz Değiştirildi',
    'continueButton': 'Devam Et',
    'pleaseWait': 'Lütfen bekleyin...',
    // Header
    'homepage': 'ERÜ Anasayfa',
    'computerEngineering': 'BİLGİSAYAR MÜHENDİSLİĞİ',
    'internshipSystem': 'STAJ BİLGİ SİSTEMİ',
    // Footer
    'footer.address': 'Yenidoğan Mahallesi Turhan Baytop Sokak No:1 38280 TALAS / KAYSERİ',
    'footer.eru': 'Erciyes Üniversitesi',
    'footer.announcements': 'Duyurular',
    'footer.engineering': 'Mühendislik Fakültesi',
    'footer.calendar': 'Akademik Takvim',
    'footer.faq': 'Sıkça Sorulan Sorular (SSS)',
    'footer.obisis': 'Obisis',
    'footer.rights': '2015 - 2025 © ERÜ Web İçerik Yönetim Sistemi | Erciyes Üniversitesi Bilgi İşlem Daire Başkanlığı',
    'footer.contactResponsible': 'Web sitesi içerik sorumlusu: Osman Buğra KAHRAMAN - obkahraman@erciyes.edu.tr',
    //Dashboard
    'dashboard': 'Dashboard',
    'myInternships': 'Stajlarım',
    'myDocuments': 'Belgelerim',
    'notifications': 'Bildirimler',
    'chatAssistant': 'Sohbet Asistanı',
    'newInternship': 'Yeni Staj',
  },
  en: {
    // Login ve şifre sıfırlama sayfaları
    'email': 'Email',
    'password': 'Password',
    'forgotPassword': 'Forgot your password?',
    'login': 'Log In',
    'enterPassword':'Enter Password',
    'register': 'Register',
    'rememberMe': 'Remember me',
    'resetPassword': 'Reset Your Password',
    'enterEmail': 'Enter Your Email Address',
    'checkEmail': 'Check your email',
    'passwordChanged': 'Password Changed',
    'continueButton': 'Continue',
    'pleaseWait': 'Please wait...',
    // Header
    'homepage': 'ERU Homepage',
    'computerEngineering': 'COMPUTER ENGINEERING',
    'internshipSystem': 'INTERNSHIP INFORMATION SYSTEM',
    // Footer
    'footer.address': 'Erciyes University, Faculty of Engineering, Department of Computer Engineering, 38039 Talas / KAYSERİ',
    'footer.eru': 'Erciyes University',
    'footer.announcements': 'Announcements',
    'footer.engineering': 'Faculty of Engineering',
    'footer.calendar': 'Academic Calendar',
    'footer.faq': 'Frequently Asked Questions (FAQ)',
    'footer.obisis': 'Obisis',
    'footer.rights': '2015 - 2025 © ERU Web Content Management System | Erciyes University IT Department',
    'footer.contactResponsible': 'Website content responsible: Osman Buğra KAHRAMAN - obkahraman@erciyes.edu.tr',
    //Dashboard
    'dashboard': 'Dashboard',
    'myInternships': 'My Internships',
    'myDocuments': 'My Documents',
    'notifications': 'Notifications',
    'chatAssistant': 'Chat Assistant',
    'newInternship': 'New Internship',
  }
  
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  // URL veya localStorage'dan dili al, yoksa tr kullan
  const getInitialLanguage = (): Language => {
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    
    if (langParam === 'en' || langParam === 'tr') {
      return langParam;
    }
    
    const storedLang = localStorage.getItem('preferredLanguage');
    return (storedLang === 'en' || storedLang === 'tr') ? storedLang : 'tr';
  };

  const [language, setLanguage] = useState<Language>(getInitialLanguage());

  // Dil değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('preferredLanguage', language);
  }, [language]);

  // Çeviri fonksiyonu
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook olarak kullanım için
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};