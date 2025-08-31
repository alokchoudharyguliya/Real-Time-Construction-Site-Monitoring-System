export type Language = 'en' | 'hi';

export interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

export const translations: Translations = {
  // Navigation
  dashboard: { en: 'Dashboard', hi: 'डैशबोर्ड' },
  reports: { en: 'Reports', hi: 'रिपोर्ट्स' },
  '3d_view': { en: '3D View', hi: '3D दृश्य' },
  profile: { en: 'Profile', hi: 'प्रोफाइल' },
  logout: { en: 'Logout', hi: 'लॉगआउट' },
  
  // Dashboard
  welcome: { en: 'Welcome back', hi: 'वापसी पर स्वागत है' },
  active_projects: { en: 'Active Projects', hi: 'सक्रिय परियोजनाएं' },
  total_sites: { en: 'Total Sites', hi: 'कुल साइटें' },
  completion_rate: { en: 'Completion Rate', hi: 'पूर्णता दर' },
  pending_approvals: { en: 'Pending Approvals', hi: 'लंबित अनुमोदन' },
  
  // Image Upload
  upload_images: { en: 'Upload Images', hi: 'छवियां अपलोड करें' },
  select_stage: { en: 'Select Construction Stage', hi: 'निर्माण चरण चुनें' },
  foundation: { en: 'Foundation', hi: 'नींव' },
  superstructure: { en: 'Superstructure', hi: 'अधिरचना' },
  interiors: { en: 'Interiors', hi: 'आंतरिक' },
  finishing: { en: 'Finishing', hi: 'फिनिशिंग' },
  
  // Authentication
  login: { en: 'Login', hi: 'लॉगिन' },
  email: { en: 'Email', hi: 'ईमेल' },
  password: { en: 'Password', hi: 'पासवर्ड' },
  contractor: { en: 'Contractor', hi: 'ठेकेदार' },
  government: { en: 'Government Official', hi: 'सरकारी अधिकारी' },
  
  // Common
  save: { en: 'Save', hi: 'सेव करें' },
  cancel: { en: 'Cancel', hi: 'रद्द करें' },
  edit: { en: 'Edit', hi: 'संपादित करें' },
  view: { en: 'View', hi: 'देखें' },
  loading: { en: 'Loading...', hi: 'लोड हो रहा है...' },
  error: { en: 'Error', hi: 'त्रुटि' },
  success: { en: 'Success', hi: 'सफलता' },
};

export const useTranslation = (language: Language) => {
  return (key: string): string => {
    return translations[key]?.[language] || key;
  };
};