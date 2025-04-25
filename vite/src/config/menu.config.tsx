import { type TMenuConfig } from '@/components/menu';

export const MENU_SIDEBAR: TMenuConfig = [
  {
    title: 'Staj Yönetimi',
    icon: 'document',
    children: [
      {
        title: 'Staj Başvurusu',
        path: '/dashboard/internship/application',
        icon: 'add-document'
      },
      {
        title: 'Staj Süreçlerim',
        path: '/dashboard/internship/processes',
        icon: 'chart-line'
      },
      {
        title: 'Staj Defteri',
        path: '/dashboard/internship/notebook',
        icon: 'book-open'
      }
    ]
  },
  {
    title: 'Belgeler',
    icon: 'files',
    children: [
      {
        title: 'Yüklenen Belgeler',
        path: '/dashboard/documents/uploaded',
        icon: 'upload'
      },
      {
        title: 'Gerekli Belgeler',
        path: '/dashboard/documents/required',
        icon: 'checklist'
      }
    ]
  },
  {
    title: 'Destek',
    icon: 'support',
    children: [
      {
        title: 'Staj Chatbot',
        path: '/dashboard/support/chatbot',
        icon: 'message-text'
      },
      {
        title: 'Sıkça Sorulan Sorular',
        path: '/dashboard/support/faq',
        icon: 'question'
      },
      {
        title: 'İletişim',
        path: '/dashboard/support/contact',
        icon: 'phone'
      }
    ]
  },
  {
    title: 'Hesap Ayarları',
    icon: 'setting-2',
    children: [
      {
        title: 'Profil Bilgileri',
        path: '/dashboard/account/profile',
        icon: 'profile-circle'
      },
      {
        title: 'Güvenlik',
        path: '/dashboard/account/security',
        icon: 'security-user'
      }
    ]
  }
];

export const MENU_MEGA: TMenuConfig = [];  // Gerekirse sonra düzenlenecek

export const MENU_ROOT: TMenuConfig = [
  {
    title: 'Staj Yönetimi',
    icon: 'document',
    rootPath: '/dashboard/internship/',
    path: '/dashboard/internship/processes',
    childrenIndex: 1
  }
];