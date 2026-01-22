import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {authApi} from '../../services/api/authApi';
import {AuthService} from '../../services/auth/authService';
import {User} from '../../types/api';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: {email: string; password: string}, {rejectWithValue}) => {
    try {
      const response = await authApi.endpoints.login.initiate(credentials);
      if ('data' in response) {
        const {user, accessToken, refreshToken} = response.data.data;
        await AuthService.saveTokens(accessToken, refreshToken);
        await AuthService.saveUserData(user);
        return {user, accessToken, refreshToken};
      }
      throw new Error('Login failed');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  },
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (
    userData: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      phone?: string;
    },
    {rejectWithValue},
  ) => {
    try {
      const response = await authApi.endpoints.register.initiate(userData);
      if ('data' in response) {
        const {user, accessToken, refreshToken} = response.data.data;
        await AuthService.saveTokens(accessToken, refreshToken);
        await AuthService.saveUserData(user);
        return {user, accessToken, refreshToken};
      }
      throw new Error('Registration failed');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  },
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await AuthService.clearTokens();
});

export const loadUserFromStorage = createAsyncThunk(
  'auth/loadUser',
  async () => {
    const [accessToken, refreshToken, userData] = await Promise.all([
      AuthService.getAccessToken(),
      AuthService.getRefreshToken(),
      AuthService.getUserData(),
    ]);

    if (accessToken && userData) {
      return {
        user: userData,
        accessToken,
        refreshToken,
      };
    }

    throw new Error('No stored user data');
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    setTokens: (
      state,
      action: PayloadAction<{accessToken: string; refreshToken: string}>,
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
  },
  extraReducers: builder => {
    // Login
    builder
      .addCase(loginUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Register
    builder
      .addCase(registerUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Logout
    builder.addCase(logoutUser.fulfilled, state => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
    });

    // Load user from storage
    builder
      .addCase(loadUserFromStorage.pending, state => {
        state.isLoading = true;
      })
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(loadUserFromStorage.rejected, state => {
        state.isLoading = false;
        state.isAuthenticated = false;
      });
  },
});

export const {clearError, setTokens} = authSlice.actions;
export default authSlice.reducer;
