import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
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
    // 初回ロード時に現在のセッションを取得
    const fetchSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session?.user) {
          await fetchUserProfile(session.user.id, session.user.email || '');
        } else {
          setAuthState({ user: null, isAuthenticated: false, isLoading: false });
        }
      } catch (err) {
        console.error('Session error:', err);
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      }
    };

    fetchSession();

    // 認証状態の変更を監視
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await fetchUserProfile(session.user.id, session.user.email || '');
      } else if (event === 'SIGNED_OUT') {
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (authId: string, email: string) => {
    try {
      // カスタムテーブル（users等）から付帯情報（roleやテナント等）を取得
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authId)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 は「レコードが見つからない」エラー。その場合はデフォルト値で続行（Super Admin作成用など）
        console.error('Profile fetch error:', error);
      }

      // プロフィールが存在しない場合（初期登録直後など）は、最低限の情報で作成
      const appUser: User = {
        id: authId,
        name: profile?.name || email.split('@')[0],
        email: email,
        role: (profile?.role as Role) || 'USER',
        tenantId: profile?.tenant_id || null,
        companyName: profile?.company_name || '',
      };

      setAuthState({
        user: appUser,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      console.error('User profile fetch failed:', err);
      setAuthState({ user: null, isAuthenticated: false, isLoading: false });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      if (data.session?.user) {
        await fetchUserProfile(data.session.user.id, data.session.user.email || '');
      }
    } catch (err) {
      console.error('Login error:', err);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw err;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return {
    ...authState,
    login,
    logout,
  };
};
