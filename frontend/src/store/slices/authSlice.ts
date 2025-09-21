import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState, SignupData, LoginData, GoogleAuthData } from '../../types';
import { authService } from '../../services/auth';
import toast from 'react-hot-toast';

// Async thunks
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: SignupData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      toast.success('Registration successful! Please login.');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginData, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      toast.success('Login successful!');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (googleData: GoogleAuthData, { rejectWithValue }) => {
    try {
      const response = await authService.googleLogin(googleData);
      toast.success('Google login successful!');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Google login failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to get user data';
      return rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      toast.success('Logged out successfully!');
      return null;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Logout failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const completeProfile = createAsyncThunk(
  'auth/completeProfile',
  async (profileData: {
    department: string;
    isAdmin: boolean;
    researchInterest: string;
    designation: string;
    coverImage: File;
  }, { rejectWithValue }) => {
    try {
      const response = await authService.completeProfile(profileData);
      toast.success('Profile completed successfully!');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Profile completion failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const setPassword = createAsyncThunk(
  'auth/setPassword',
  async (passwordData: {
    new_password: string;
    confirm_password: string;
  }, { rejectWithValue }) => {
    try {
      const response = await authService.setPassword(passwordData);
      toast.success('Password set successfully!');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Password setting failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Google Login
      .addCase(googleLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Complete Profile
      .addCase(completeProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(completeProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(completeProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Set Password
      .addCase(setPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(setPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(setPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
