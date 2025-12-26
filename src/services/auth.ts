import { API_BASE_URL } from '../config/api';

// FORCE CORRECT API URL - HARDCODED OVERRIDE
// This prevents any possibility of using wrong domain
const BACKEND_URL = 'https://esse-aqui-midia-backend.vercel.app/api';

// Validate we're not using the wrong domain
const validateUrl = (url: string) => {
  if (url.includes('esse-aqui-midia.vercel.app') && !url.includes('backend')) {
    console.error('❌ CRITICAL: Using WRONG API URL!');
    console.error('Got:', url);
    console.error('Using fallback:', BACKEND_URL);
    return BACKEND_URL;
  }
  if (!url.includes('backend')) {
    console.warn('⚠️ Warning: API_BASE_URL might be incorrect');
    return BACKEND_URL;
  }
  return url;
};

const FINAL_API_URL = validateUrl(API_BASE_URL);

console.log('═'.repeat(70));
console.log('🔌 Auth Service Initialized');
console.log('📍 API URL:', FINAL_API_URL);
console.log('═'.repeat(70));

export const authService = {
  async login(email: string, password: string) {
    const url = `${FINAL_API_URL}/auth/login`;
    console.log('🔑 Login POST to:', url);
    console.log('📤 Request payload:', { email, password });
    
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      
      console.log('📬 Response status:', res.status);
      console.log('📬 Response headers:', {
        'content-type': res.headers.get('content-type'),
        'authorization': res.headers.get('authorization'),
      });
      
      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Login failed' }));
        console.error('❌ Login response error:', error);
        throw new Error(error.message || 'Login failed');
      }
      
      const data = await res.json();
      console.log('📥 Login response data:', data);
      console.log('✅ Login successful');
      console.log('🔐 Token received:', data?.access_token ? 'YES ✅' : 'NO ❌');
      console.log('👤 User data received:', data?.user ? 'YES ✅' : 'NO ❌');
      
      // Armazenar token
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        console.log('💾 Token saved to localStorage');
      } else {
        console.error('❌ CRITICAL: No access_token in response!');
        console.error('Response was:', JSON.stringify(data, null, 2));
      }
      
      return data;
    } catch (error: any) {
      console.error('❌ Login error:', error);
      console.error('Error stack:', error.stack);
      throw error;
    }
  },

  async register(email: string, password: string, name: string) {
    const url = `${FINAL_API_URL}/auth/register`;
    console.log('🔑 Register POST to:', url);
    console.log('📤 Request payload:', { email, password, name });
    
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password, name })
      });
      
      console.log('📬 Response status:', res.status);
      
      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Registration failed' }));
        console.error('❌ Register response error:', error);
        throw new Error(error.message || 'Registration failed');
      }
      
      const data = await res.json();
      console.log('📥 Register response data:', data);
      console.log('✅ Register successful');
      console.log('🔐 Token received:', data?.access_token ? 'YES ✅' : 'NO ❌');
      
      // Armazenar token
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        console.log('💾 Token saved to localStorage');
      } else {
        console.error('❌ CRITICAL: No access_token in response!');
      }
      
      return data;
    } catch (error: any) {
      console.error('❌ Register error:', error);
      console.error('Error stack:', error.stack);
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('access_token');
    console.log('🚪 Logout - Token removed from localStorage');
  },

  getToken() {
    const token = localStorage.getItem('access_token');
    if (token) {
      console.log('🔐 Token found in localStorage');
    } else {
      console.warn('⚠️ No token found in localStorage');
    }
    return token;
  }
};
