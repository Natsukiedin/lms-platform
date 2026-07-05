import React from 'react';

export const SuperAdminDashboard: React.FC = () => {

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
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3 text-gray-500">TR-001</td>
                    <td className="p-3 font-bold">情報セキュリティ基礎研修</td>
                    <td className="p-3">セキュリティ</td>
                    <td className="p-3">5問</td>
                    <td className="p-3">
                      <button className="text-blue-600 hover:underline mr-2">編集</button>
                      <button className="text-red-600 hover:underline">削除</button>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3 text-gray-500">TR-002</td>
                    <td className="p-3 font-bold">コンプライアンス研修 2026</td>
                    <td className="p-3">コンプライアンス</td>
                    <td className="p-3">10問</td>
                    <td className="p-3">
                      <button className="text-blue-600 hover:underline mr-2">編集</button>
                      <button className="text-red-600 hover:underline">削除</button>
                    </td>
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
                <p className="text-2xl font-black text-gray-800">45 <span className="text-xs font-normal">社</span></p>
              </div>
              <div className="p-4 bg-gray-50 rounded">
                <p className="text-xs text-gray-500 font-bold">総アクティブユーザー</p>
                <p className="text-2xl font-black text-gray-800">12,450 <span className="text-xs font-normal">人</span></p>
              </div>
              <div className="p-4 bg-gray-50 rounded">
                <p className="text-xs text-gray-500 font-bold">今月の完了数</p>
                <p className="text-2xl font-black text-gray-800">8,203 <span className="text-xs font-normal">件</span></p>
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
              <div className="border border-gray-200 rounded p-4 hover:border-green-300 transition-colors cursor-pointer">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-gray-800">株式会社A</h4>
                  <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-800 rounded">アクティブ</span>
                </div>
                <p className="text-xs text-gray-600 mb-1">契約プラン: スタンダード</p>
                <p className="text-xs text-gray-600">ライセンス割当: TR-001, TR-002</p>
              </div>

              <div className="border border-gray-200 rounded p-4 hover:border-green-300 transition-colors cursor-pointer">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-gray-800">B商事株式会社</h4>
                  <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-800 rounded">アクティブ</span>
                </div>
                <p className="text-xs text-gray-600 mb-1">契約プラン: プレミアム</p>
                <p className="text-xs text-gray-600">ライセンス割当: 全ての研修</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
