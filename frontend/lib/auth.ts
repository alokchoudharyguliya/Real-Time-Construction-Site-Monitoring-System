export interface User {
  id: string;
  email: string;
  name: string;
  role: 'contractor' | 'government';
  avatar?: string;
  phone?: string;
  organization?: string;
  licenseNumber?: string;
  permissions: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Mock authentication - replace with actual OAuth2 implementation
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'contractor@example.com',
    name: 'John Builder',
    role: 'contractor',
    avatar: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    phone: '+91 9876543210',
    organization: 'BuildCorp Industries',
    licenseNumber: 'CNT-2024-001',
    permissions: ['upload_images', 'view_own_projects', 'edit_progress']
  },
  {
    id: '2',
    email: 'govt@example.com',
    name: 'Sarah Inspector',
    role: 'government',
    avatar: 'https://images.pexels.com/photos/3586798/pexels-photo-3586798.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    phone: '+91 9876543211',
    organization: 'Municipal Development Authority',
    licenseNumber: 'GOV-2024-001',
    permissions: ['view_all_projects', 'approve_stages', 'generate_reports', 'audit_progress']
  }
];

export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const user = mockUsers.find(u => u.email === email);
  return user || null;
};

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem('construction_user');
  return stored ? JSON.parse(stored) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem('construction_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('construction_user');
  }
};