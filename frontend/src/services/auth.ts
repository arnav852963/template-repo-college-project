import api from './api';
import { SignupData, LoginData, GoogleAuthData, User, ApiResponse } from '../types';

export const authService = {
  // Register user
  register: async (userData: SignupData): Promise<ApiResponse<User>> => {
    const formData = new FormData();
    
    // Append all text fields
    formData.append('fullName', userData.fullName);
    formData.append('username', userData.username);
    formData.append('password', userData.password);
    formData.append('email', userData.email);
    formData.append('department', userData.department);
    formData.append('isAdmin', userData.isAdmin.toString());
    formData.append('researchInterest', userData.researchInterest);
    formData.append('designation', userData.designation);
    
    // Append files
    formData.append('avatar', userData.avatar);
    formData.append('coverImage', userData.coverImage);

    const response = await api.post('/users/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Login user
  login: async (credentials: LoginData): Promise<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>> => {
    const response = await api.post('/users/login', credentials);
    
    // Store tokens in localStorage
    if (response.data.data.accessToken) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
    }
    
    return response.data;
  },

  // Google OAuth login
  googleLogin: async (googleData: GoogleAuthData): Promise<ApiResponse<User>> => {
    const response = await api.post('/users/googleLogin', googleData);
    
    // Store tokens in localStorage if available
    if (response.data.data.accessToken) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
    }
    
    return response.data;
  },

  // Complete profile (for Google OAuth users)
  completeProfile: async (profileData: {
    department: string;
    isAdmin: boolean;
    researchInterest: string;
    designation: string;
    coverImage: File;
  }): Promise<ApiResponse<User>> => {
    const formData = new FormData();
    formData.append('department', profileData.department);
    formData.append('isAdmin', profileData.isAdmin.toString());
    formData.append('researchInterest', profileData.researchInterest);
    formData.append('designation', profileData.designation);
    formData.append('coverImage', profileData.coverImage);

    const response = await api.post('/users/completeProfile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Set password (for Google OAuth users)
  setPassword: async (passwordData: {
    new_password: string;
    confirm_password: string;
  }): Promise<ApiResponse<{}>> => {
    const response = await api.post('/users/setPassword', passwordData);
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/users/getUser');
    return response.data;
  },

  // Logout
  logout: async (): Promise<ApiResponse<User>> => {
    const response = await api.post('/users/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return response.data;
  },

  // Change password
  changePassword: async (passwordData: {
    original_password: string;
    new_password: string;
    confirm_password: string;
  }): Promise<ApiResponse<{}>> => {
    const response = await api.patch('/users/changePassword', passwordData);
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData: {
    new_email: string;
    new_username: string;
  }): Promise<ApiResponse<User>> => {
    const response = await api.patch('/users/updateDetails', profileData);
    return response.data;
  },

  // Update avatar
  updateAvatar: async (avatar: File): Promise<ApiResponse<User>> => {
    const formData = new FormData();
    formData.append('avatar', avatar);

    const response = await api.patch('/users/updateAvatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update cover image
  updateCoverImage: async (coverImage: File): Promise<ApiResponse<User>> => {
    const formData = new FormData();
    formData.append('coverImage', coverImage);

    const response = await api.patch('/users/updateCoverImage', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete user account
  deleteAccount: async (): Promise<ApiResponse<{}>> => {
    const response = await api.delete('/users/delete');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return response.data;
  },
};
