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


export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' ,
      'Authorization':'Bearer'
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  // Save JWT token to localStorage for session management
  if (data.token) {
    localStorage.setItem('jwt_token', data.token);
  }

  // Map backend user fields to frontend User interface
  if (data.user) {
    return {
      id: data.user._id || data.user.id,
      email: data.user.email,
      name: data.user.name,
      role: data.user.account_type || data.user.role, // adjust as per backend field
      avatar: data.user.imageUrl || data.user.avatar,
      phone: data.user.phone_number || data.user.phone,
      organization: data.user.organization,
      licenseNumber: data.user.licenseNumber,
      permissions: data.user.permissions || [],
    };
  }

  return null;
};

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem('construction_user');
  console.log(stored);
  return stored ? JSON.parse(stored) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem('construction_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('construction_user');
  }
};