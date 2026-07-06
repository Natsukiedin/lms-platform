import React, { useState } from 'react';
import { supabase } from '../../../lib/supabase';

export const SuperAdminDashboard: React.FC = () => {
  const [tenantName, setTenantName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantName || !adminName || !adminEmail || !adminPassword) return;
    setIsCreating(true);

    try {
      // 1. テナント（企業）を作成
      const { data: tenant, error: tenantError } = await supabase
        .from('tenants')
        .insert([{ name: tenantName, plan: 'Standard' }])
        .select()
        .single();
        
      if (tenantError) throw tenantError;

      // 2. Edge Function経由で人事管理者（TENANT_ADMIN）を作成
      const { error: userError } = await supabase.functions.invoke('create-user', {
        body: {
          email: adminEmail,
          password: adminPassword,
          name: adminName,
          tenantId: tenant.id,
          companyName: tenant.name,
          role: 'TENANT_ADMIN'
        }
      });
      if (userError) throw userError;

      alert(`顧客企業「${tenantName}」と管理者アカウントを作成しました！`);
      setTenantName('');
      setAdminName('');
      setAdminEmail('');
      setAdminPassword('');
    } catch (err: any) {
      console.error(err);
      alert('作成に失敗しました: ' + err.message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">運営管理者（プラットフォーム）ダッシュボード</h2>
          <p className="text-gray-600">SaaS全体の設定・企業管理・コンテンツマスター管理</p>
        </div>
        <div className="text-sm font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
          Super Admin
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左カラム：CMSと研修マスター */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-lg shadow border-t-4 border-purple-500">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold border-b pb-2 flex-1 mr-4">研修マスター管理 (CMS)</h3>
              <button className="bg-purple-600 text-white font-bold py-2 px-4 rounded hover:bg-purple-700 text-sm">
                + 新規動画を登録
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-sm border-b">
                    <th className="p-3">ID</th>
                    <th className="p-3">研修タイトル</th>
                    <th className="p-3">カテゴリ</th>
                    <th className="p-3">クイズ数</th>
                    <th className="p-3">操作</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">現在登録されている研修動画はありません。</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow border-t-4 border-blue-500">
            <h3 className="text-xl font-bold mb-4 border-b pb-2">プラットフォーム利用概況</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-gray-50 rounded">
                <p className="text-xs text-gray-500 font-bold">総契約テナント数</p>
                <p className="text-2xl font-black text-gray-800">0 <span className="text-xs font-normal">社</span></p>
              </div>
              <div className="p-4 bg-gray-50 rounded">
                <p className="text-xs text-gray-500 font-bold">総アクティブユーザー</p>
                <p className="text-2xl font-black text-gray-800">0 <span className="text-xs font-normal">人</span></p>
              </div>
              <div className="p-4 bg-gray-50 rounded">
                <p className="text-xs text-gray-500 font-bold">今月の完了数</p>
                <p className="text-2xl font-black text-gray-800">0 <span className="text-xs font-normal">件</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* 右カラム：テナント（顧客企業）管理 */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow border-t-4 border-green-500">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-xl font-bold">契約顧客企業一覧</h3>
              <button className="text-green-600 text-sm font-bold hover:underline">+ 新規登録</button>
            </div>
            
            <div className="space-y-4">
              <form onSubmit={handleCreateTenant} className="border border-gray-200 rounded p-6 bg-gray-50">
                <h4 className="font-bold text-gray-700 mb-4 border-b pb-2">新規テナント登録フォーム</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">企業名</label>
                    <input type="text" value={tenantName} onChange={e => setTenantName(e.target.value)} required className="w-full border rounded p-2 text-sm" placeholder="株式会社〇〇" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">人事管理者 氏名</label>
                    <input type="text" value={adminName} onChange={e => setAdminName(e.target.value)} required className="w-full border rounded p-2 text-sm" placeholder="担当者名" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">人事管理者 メールアドレス</label>
                    <input type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} required className="w-full border rounded p-2 text-sm" placeholder="admin@example.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">初期パスワード</label>
                    <input type="password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} required className="w-full border rounded p-2 text-sm" placeholder="8文字以上" />
                  </div>
                  <button type="submit" disabled={isCreating} className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 mt-2 text-sm disabled:opacity-50">
                    {isCreating ? '作成中...' : '企業と管理者を作成する'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
