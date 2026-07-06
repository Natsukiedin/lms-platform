import React, { useRef, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useCsvParser } from '../../../hooks/useCsvParser';
import { supabase } from '../../../lib/supabase';

export const TenantAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { parseCsv, isParsing, error, parsedData } = useCsvParser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [singleName, setSingleName] = useState('');
  const [singleEmail, setSingleEmail] = useState('');
  const [singlePassword, setSinglePassword] = useState('');

  // テスト環境用：初期状態として0をセット
  const analytics = {
    totalEmployees: 0,
    averageCompletionRate: 0, // %
    averageQuizScore: 0, // 点
    notStartedUsers: 0, // 人
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await parseCsv(file);
    }
  };

  const handleCreateUsers = async () => {
    if (!parsedData) return;
    
    try {
      // CSVの各ユーザーに対してAPIを呼び出す
      for (const u of parsedData) {
        if (!u.password) throw new Error('パスワードが設定されていないユーザーがいます');
        
        const { error } = await supabase.functions.invoke('create-user', {
          body: {
            email: u.email,
            password: u.password,
            name: u.name,
            tenantId: user?.tenantId,
            companyName: user?.companyName
          }
        });
        if (error) throw error;
      }
      
      alert(`${parsedData.length}名のアカウントを登録しました！`);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      console.error(err);
      alert('一部のユーザー登録に失敗しました: ' + err.message);
    }
  };

  const handleSingleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleName || !singleEmail || !singlePassword) return;
    
    try {
      const { error } = await supabase.functions.invoke('create-user', {
        body: {
          email: singleEmail,
          password: singlePassword,
          name: singleName,
          tenantId: user?.tenantId,
          companyName: user?.companyName
        }
      });
      if (error) throw error;
      
      alert(`${singleName} さんを登録しました！（初期パスワード: ${singlePassword}）`);
      setSingleName('');
      setSingleEmail('');
      setSinglePassword('');
    } catch (err: any) {
      console.error(err);
      alert('登録に失敗しました: ' + err.message);
    }
  };

  const handleExportCsv = () => {
    // 顧客企業管理者が自社社員の受講者データ等CSVでダウンロード
    const csvContent = "\uFEFF氏名,受講率(%),クイズ得点,感想\n山田太郎,100,90,大変勉強になりました。\n鈴木一郎,0,0,";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'employees_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">人事管理者ダッシュボード</h2>
        <p className="text-gray-600">{user?.companyName} の受講状況</p>
      </div>

      {/* アナリティクス */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-white p-6 rounded-lg shadow border-t-4 border-blue-500 text-center">
          <p className="text-sm text-gray-500 font-bold mb-1">対象社員数</p>
          <p className="text-3xl font-black text-gray-800">{analytics.totalEmployees}<span className="text-sm font-normal ml-1">名</span></p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-t-4 border-green-500 text-center">
          <p className="text-sm text-gray-500 font-bold mb-1">平均受講率</p>
          <p className="text-3xl font-black text-gray-800">{analytics.averageCompletionRate}<span className="text-sm font-normal ml-1">%</span></p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-t-4 border-yellow-500 text-center">
          <p className="text-sm text-gray-500 font-bold mb-1">クイズ平均点</p>
          <p className="text-3xl font-black text-gray-800">{analytics.averageQuizScore}<span className="text-sm font-normal ml-1">点</span></p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-t-4 border-red-500 text-center">
          <p className="text-sm text-gray-500 font-bold mb-1">未着手者数</p>
          <p className="text-3xl font-black text-red-600">{analytics.notStartedUsers}<span className="text-sm font-normal text-gray-800 ml-1">名</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CSVインポート */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4 border-b pb-2">受講者一括登録 (CSV)</h3>
          <p className="text-sm text-gray-600 mb-4">
            「氏名」「メールアドレス」「初期パスワード」の3列からなるCSVファイルをアップロードしてください。
          </p>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
            <input 
              type="file" 
              accept=".csv"
              onChange={handleFileUpload}
              ref={fileInputRef}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="pointer-events-none">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="text-blue-600 font-bold">ファイルを選択</span> またはドラッグ＆ドロップ
              <p className="text-xs text-gray-500 mt-2">最大容量: 5MB</p>
            </div>
          </div>

          {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded text-sm font-bold">{error}</div>}
          
          {parsedData && (
            <div className="mt-6">
              <p className="text-green-600 font-bold mb-2">解析成功: {parsedData.length}名のアカウントを登録できます</p>
              <button 
                onClick={handleCreateUsers}
                disabled={isParsing}
                className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                アカウントを一括作成する（招待メールなし）
              </button>
            </div>
          )}
        </div>

        {/* 単体インポート */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4 border-b pb-2">受講者個別登録</h3>
          <p className="text-sm text-gray-600 mb-4">1名ずつ手動でアカウントを登録します。（招待メールは送信されません）</p>
          
          <form onSubmit={handleSingleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">氏名</label>
              <input 
                type="text" 
                value={singleName}
                onChange={(e) => setSingleName(e.target.value)}
                placeholder="例: 山田 太郎"
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">メールアドレス</label>
              <input 
                type="email" 
                value={singleEmail}
                onChange={(e) => setSingleEmail(e.target.value)}
                placeholder="例: yamada@example.com"
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">初期パスワード</label>
              <input 
                type="password" 
                value={singlePassword}
                onChange={(e) => setSinglePassword(e.target.value)}
                placeholder="英数字8文字以上など"
                className="w-full border rounded p-2"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition-colors mt-4"
            >
              アカウントを作成する
            </button>
          </form>
        </div>

        {/* 期限設定とエクスポート */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4 border-b pb-2">受講期限設定</h3>
            <p className="text-sm text-gray-600 mb-4">設定された受講期限の「7日前」「3日前」に未完了の社員へリマインドメールが送信されます。</p>
            
            <div className="flex gap-2">
              <input type="date" className="border rounded p-2 flex-1" />
              <button className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">設定</button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4 border-b pb-2">データエクスポート</h3>
            <p className="text-sm text-gray-600 mb-4">自社社員の受講状況、クイズの得点、提出された感想文を一括ダウンロードします。文字化け防止のためBOM付きUTF-8で出力されます。</p>
            
            <button 
              onClick={handleExportCsv}
              className="w-full border-2 border-green-600 text-green-700 font-bold py-3 px-4 rounded hover:bg-green-50 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              CSVをエクスポート
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
