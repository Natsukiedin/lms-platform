import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { CertificateModal } from '../certificate/CertificateModal';
import { VideoPlayer } from '../training/VideoPlayer';
import { QuizForm } from '../training/QuizForm';
import { FeedbackForm } from '../training/FeedbackForm';

export const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [isQuizPassed, setIsQuizPassed] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  if (!user) return <div>読み込み中...</div>;

  // テスト環境用: データを空にする
  const mockCourses: any[] = [];

  const handleStartCourse = (courseId: string) => {
    setActiveCourseId(courseId);
    setIsVideoEnded(false);
    setIsQuizPassed(false);
  };

  const handleFeedbackSubmit = async (_feedback: string) => {
    // API送信モック
    // バックエンドへ感想を送信する処理
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('感想を送信し、受講が完了しました！');
    // 状態をリセットして一覧に戻る
    setActiveCourseId(null);
  };

  const activeCourse = mockCourses.find(c => c.id === activeCourseId);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-6 mb-8 flex justify-between items-center border-l-4 border-blue-500">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{user.name} 様のマイページ</h2>
          <p className="text-gray-600 mt-1">所属: {user.companyName}</p>
        </div>
        <div className="bg-blue-50 px-6 py-3 rounded-lg text-center">
          <p className="text-sm text-blue-600 font-bold mb-1">受講完了</p>
          <p className="text-3xl font-black text-blue-800">
            {mockCourses.filter(c => c.status === 'completed').length} <span className="text-lg font-normal text-blue-600">/ {mockCourses.length}</span>
          </p>
        </div>
      </div>

      {activeCourse ? (
        <div>
          <button 
            onClick={() => setActiveCourseId(null)}
            className="mb-4 text-blue-600 hover:underline flex items-center font-medium"
          >
            ← コース一覧に戻る
          </button>
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{activeCourse.title}</h1>
            <p className="text-gray-600">{activeCourse.description}</p>
          </div>

          <VideoPlayer 
            course={activeCourse} 
            tenantId={user.tenantId || ''} 
            onEnded={() => setIsVideoEnded(true)}
          />

          {isVideoEnded && !isQuizPassed && (
            <QuizForm 
              quiz={activeCourse.quiz} 
              onPass={() => setIsQuizPassed(true)}
              onFail={() => {
                alert('不合格です。動画をもう一度確認してください。');
                setIsVideoEnded(false);
              }}
            />
          )}

          {isQuizPassed && (
            <FeedbackForm onSubmit={handleFeedbackSubmit} />
          )}
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-bold mb-4 border-b pb-2 text-gray-800">割り当てられた研修</h3>
          {mockCourses.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md border border-gray-100 p-8 text-center">
              <p className="text-gray-500">現在、割り当てられている研修はありません。</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockCourses.map(course => (
                <div key={course.id} className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded font-bold">
                        {course.category}
                      </span>
                      {course.status === 'completed' && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold flex items-center">
                          受講済
                        </span>
                      )}
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{course.title}</h4>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2 min-h-[40px]">{course.description}</p>
                    
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${course.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'}`} 
                          style={{ width: `${course.progressPercent}%` }}
                        ></div>
                      </div>
                      <div className="text-right text-xs text-gray-500 mt-1">{course.progressPercent}% 完了</div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleStartCourse(course.id)}
                        className={`flex-1 font-bold py-2 px-4 rounded text-center transition-colors ${
                          course.status === 'completed' 
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {course.status === 'completed' ? '復習する' : '受講を開始'}
                      </button>
                      
                      {course.status === 'completed' && (
                        <button 
                          onClick={() => setShowCertificate(true)}
                          className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-4 py-2 rounded font-bold transition-colors"
                          title="修了証書を表示"
                        >
                          証書
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {user && (
        <CertificateModal
          isOpen={showCertificate}
          onClose={() => setShowCertificate(false)}
          companyName={user.companyName || ''}
          userName={user.name}
          courseName="情報セキュリティ基礎研修" // モック
          completionDate="2026年7月4日"
        />
      )}
    </div>
  );
};
