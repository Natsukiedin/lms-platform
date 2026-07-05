import React, { useState } from 'react';

interface FeedbackFormProps {
  onSubmit: (feedback: string) => Promise<void>;
  isLoading?: boolean;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSubmit, isLoading = false }) => {
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState<string | null>(null);

  const charCount = feedback.replace(/\s+/g, '').length; // 空白を除外した文字数カウント (指示に基づくバリデーション用)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedFeedback = feedback.trim();
    if (trimmedFeedback.length === 0) {
      setError('感想を入力してください。');
      return;
    }

    if (charCount < 100) {
      setError(`感想は100文字以上で入力してください。(現在 ${charCount}文字)`);
      return;
    }

    if (charCount > 500) {
      setError(`感想は500文字以内で入力してください。(現在 ${charCount}文字)`);
      return;
    }

    try {
      await onSubmit(trimmedFeedback);
    } catch {
      setError('感想の送信に失敗しました。時間をおいて再度お試しください。');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h3 className="text-xl font-bold mb-2">研修の感想をご入力ください</h3>
      <p className="text-gray-600 mb-4 text-sm">研修を受講して学んだことや、今後の業務にどう活かせるかについて、100文字以上500文字以内で記述してください。</p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            className={`w-full border rounded p-3 h-40 focus:ring focus:ring-blue-200 outline-none ${error ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="ここに感想を入力してください..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            disabled={isLoading}
          />
          <div className="flex justify-between mt-1 text-sm">
            <span className={error ? 'text-red-500' : 'text-gray-500'}>
              {error && <span>{error}</span>}
            </span>
            <span className={`${charCount < 100 || charCount > 500 ? 'text-red-500' : 'text-green-600'} font-medium`}>
              文字数: {charCount} / 500
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || charCount < 100 || charCount > 500}
          className={`w-full font-bold py-3 px-4 rounded transition-colors ${
            isLoading || charCount < 100 || charCount > 500
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isLoading ? '送信中...' : '感想を送信して完了する'}
        </button>
      </form>
    </div>
  );
};
