import { useState, useEffect } from 'react';
import type { User, Role } from '../types/training';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // モック：本来はバックエンドから `/api/me` 等で取得する
    // ここではデモンストレーション用にローカルストレージから情報を復元、またはダミーデータをセット
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setAuthState({ user: null, isAuthenticated: false, isLoading: false });
          return;
        }

        // Dummy user payload
        const dummyUser: User = {
          id: 'user-123',
          name: '山田 太郎',
          email: 'yamada@example.com',
          role: (localStorage.getItem('dummy_role') as Role) || 'USER',
          tenantId: localStorage.getItem('tenant_id') || 'tenant-A',
          companyName: localStorage.getItem('company_name') || '株式会社A',
        };

        setAuthState({
          user: dummyUser,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      }
    };

    fetchUser();
  }, []);

  const login = async (token: string, user: User) => {
    localStorage.setItem('auth_token', token);
    if (user.tenantId) {
      localStorage.setItem('tenant_id', user.tenantId);
    }
    if (user.companyName) {
      localStorage.setItem('company_name', user.companyName);
    }
    localStorage.setItem('dummy_role', user.role);

    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('tenant_id');
    localStorage.removeItem('company_name');
    localStorage.removeItem('dummy_role');
    setAuthState({ user: null, isAuthenticated: false, isLoading: false });
    window.location.href = '/login';
  };

  return {
    ...authState,
    login,
    logout,
  };
};
