import { AUTH_ENDPOINTS } from 'constants/endpoints';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirmation?: string;
}

export interface AuthResponse {
  user: {
    id: number;
    username: string;
    email: string;
    phone?: string;
    created_at: string;
    updated_at: string;
  };
  token: string;
  message?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export const authAPI = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    return response.json();
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(AUTH_ENDPOINTS.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    return response.json();
  },

  async logout(): Promise<{ message: string }> {
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(AUTH_ENDPOINTS.LOGOUT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      throw new Error(errorData.message || 'Logout failed');
    }

    return response.json();
  },

  async getCurrentUser(): Promise<AuthResponse['user']> {
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(AUTH_ENDPOINTS.USER, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      throw new Error(errorData.message || 'Failed to get user data');
    }

    return response.json();
  },

  async updateProfile(data: { phone?: string; first_name?: string; last_name?: string; email?: string }): Promise<{ message: string; user: AuthResponse['user'] }> {
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(AUTH_ENDPOINTS.PROFILE, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      if (errorData.errors && errorData.errors.phone) {
        throw new Error(errorData.errors.phone[0]);
      }
      throw new Error(errorData.message || 'Failed to update profile');
    }

    return response.json();
  },
};
