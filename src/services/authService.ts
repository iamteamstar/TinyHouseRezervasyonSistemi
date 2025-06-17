import axios from 'axios';
import { LoginRequest, RegisterRequest, AuthUser } from '../types';

// Base API URL
const API_BASE_URL = 'https://localhost:7069/api';

// Axios instance oluştur
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Token'ı otomatik ekle
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
  
);

// Response interceptor - Token expire durumlarını handle et
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expire olmuş, temizle
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const loginUser = async (data: LoginRequest) => {
  try {
    const response = await apiClient.post('/Auth/login', data);
    
    console.log('API Login Response:', response.data);
    
    // Token'ı localStorage'a kaydet
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    const responseRole = await axios.get('https://localhost:7069/api/User/MyUser', {
      headers: {
        Authorization: `Bearer ${response.data.token}`
      }
    });
    const responseID = await axios.get('https://localhost:7069/api/User/MyUser', {
      headers: {
        Authorization: `Bearer ${response.data.token}`
      }
    });
    localStorage.setItem('userID',responseID.data.userId)
    // API response'undan user bilgisini al
    const userData: AuthUser = {
      id: responseID.data.userId || responseID.data.user?.userId,
      email: response.data.email || response.data.user?.email || data.email,
      fullName: response.data.fullName || response.data.user?.fullName || response.data.name,
      roleId: responseRole.data.roleId || responseRole.data.user?.roleId || 3, // Default tenant
      isActive: response.data.isActive !== false,
    };
    
    return {
      success: true,
      data: userData,
      message: 'Giriş başarılı!'
    };
  } catch (error: any) {
    console.error('Login API Error:', error);
    
    let errorMessage = 'Giriş yapılırken bir hata oluştu.';
    
    if (error.response?.status === 401) {
      errorMessage = 'E-posta veya şifre yanlış.';
    } else if (error.response?.status === 400) {
      errorMessage = 'Geçersiz giriş bilgileri.';
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      message: errorMessage
    };
  }
};

export const registerUser = async (data: RegisterRequest) => {
  try {
    const response = await apiClient.post('/Auth/register', data);
    
    console.log('API Register Response:', response.data);
    
    return {
      success: true,
      data: response.data,
      message: 'Kayıt başarılı! Giriş yapabilirsiniz.'
    };
  } catch (error: any) {
    console.error('Register API Error:', error);
    
    let errorMessage = 'Kayıt işlemi sırasında bir hata oluştu.';
    
    if (error.response?.status === 400) {
      errorMessage = 'Geçersiz kayıt bilgileri.';
    } else if (error.response?.status === 409) {
      errorMessage = 'Bu e-posta adresi zaten kullanılıyor.';
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      message: errorMessage
    };
  }
};

// Kullanıcı bilgilerini getir
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get('/Auth/me');
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Kullanıcı bilgileri alınamadı.'
    };
  }
};

// Şifre sıfırlama
export const forgotPassword = async (email: string) => {
  try {
    const response = await apiClient.post('/Auth/forgot-password', { email });
    return {
      success: true,
      message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.'
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Şifre sıfırlama işlemi başarısız.'
    };
  }
};

// Şifre sıfırlama (token ile)
export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const response = await apiClient.post('/Auth/reset-password', {
      token,
      newPassword
    });
    return {
      success: true,
      message: 'Şifreniz başarıyla güncellendi.'
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Şifre güncelleme işlemi başarısız.'
    };
  }
};

export default apiClient;