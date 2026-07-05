import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { SuperAdminDashboard } from './components/features/admin/SuperAdminDashboard';
import { TenantAdminDashboard } from './components/features/admin/TenantAdminDashboard';
import { UserDashboard } from './components/features/dashboard/UserDashboard';

const App: React.FC = () => {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">SaaS LMS Platform V2</h1>
            {isAuthenticated && user && (
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <span className="font-bold text-gray-700">{user.name}</span>
                  <span className="text-gray-500 ml-2">({user.role})</span>
                </div>
                <button 
                  onClick={logout}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  ログアウト
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-4">
          <Routes>
            <Route path="/login" element={
              !isAuthenticated ? (
                <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
                  <h2 className="text-2xl font-bold mb-6 text-center">ログイン</h2>
                  <div className="space-y-4">
                    <button 
                      onClick={() => login('dummy-token-1', { id: 'u1', name: '一般社員', email: 'user@example.com', role: 'USER', tenantId: 't1', companyName: '株式会社A' })}
                      className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700"
                    >
                      一般受講者としてログイン
                    </button>
                    <button 
                      onClick={() => login('dummy-token-2', { id: 'a1', name: '人事管理者', email: 'admin@example.com', role: 'TENANT_ADMIN', tenantId: 't1', companyName: '株式会社A' })}
                      className="w-full bg-green-600 text-white p-3 rounded font-bold hover:bg-green-700"
                    >
                      顧客企業管理者としてログイン
                    </button>
                    <button 
                      onClick={() => login('dummy-token-3', { id: 'sa1', name: 'プラットフォーム運営者', email: 'super@example.com', role: 'SUPER_ADMIN', tenantId: null, companyName: '株式会社NAGAHAMA屋' })}
                      className="w-full bg-purple-600 text-white p-3 rounded font-bold hover:bg-purple-700"
                    >
                      運営管理者としてログイン
                    </button>
                  </div>
                </div>
              ) : (
                <Navigate to="/" replace />
              )
            } />
            
            <Route path="/" element={
              !isAuthenticated ? <Navigate to="/login" replace /> :
              user?.role === 'SUPER_ADMIN' ? <SuperAdminDashboard /> :
              user?.role === 'TENANT_ADMIN' ? <TenantAdminDashboard /> :
              <UserDashboard />
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
