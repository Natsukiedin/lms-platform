import React, { useState } from 'react';
import type { Quiz } from '../../../types/training';

interface QuizFormProps {
  quiz: Quiz;
  onPass: (score: number) => void;
  onFail: (score: number) => void;
}

export const QuizForm: React.FC<QuizFormProps> = ({ quiz, onPass, onFail }) => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleSelect = (questionId: string, index: number) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: index }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(answers).length < quiz.questions.length) {
      alert('すべての問題に回答してください。');
      return;
    }

    let correctCount = 0;
    quiz.questions.forEach(q => {
      if (answers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / quiz.questions.length) * 100);
    setScore(calculatedScore);
    setIsSubmitted(true);

    if (calculatedScore >= quiz.passingScore) {
      onPass(calculatedScore);
    } else {
      onFail(calculatedScore);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h3 className="text-xl font-bold mb-4">理解度チェックテスト</h3>
      {isSubmitted && score !== null && (
        <div className={`mb-6 p-4 rounded ${score >= quiz.passingScore ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <p className="font-bold text-lg">
            あなたのスコア: {score}点 / {quiz.passingScore}点 (合格ライン)
          </p>
          <p>{score >= quiz.passingScore ? '合格です！おめでとうございます。' : '不合格です。解説を確認し、再度動画を視聴してください。'}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {quiz.questions.map((q, idx) => (
          <div key={q.id} className="mb-6 pb-6 border-b border-gray-100 last:border-0">
            <p className="font-semibold mb-3">Q{idx + 1}. {q.text}</p>
            <div className="space-y-2">
              {q.options.map((opt, optIdx) => (
                <label 
                  key={optIdx} 
                  className={`block p-3 border rounded cursor-pointer transition-colors ${
                    answers[q.id] === optIdx ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'
                  } ${isSubmitted ? 'cursor-default' : ''}`}
                >
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    className="mr-2"
                    checked={answers[q.id] === optIdx}
                    onChange={() => handleSelect(q.id, optIdx)}
                    disabled={isSubmitted}
                  />
                  {opt}
                </label>
              ))}
            </div>
            {isSubmitted && (
              <div className="mt-3 p-3 bg-gray-50 rounded text-sm text-gray-700">
                <p><strong>正解:</strong> {q.options[q.correctIndex]}</p>
                <p className="mt-1"><strong>解説:</strong> {q.explanation}</p>
              </div>
            )}
          </div>
        ))}
        
        {!isSubmitted && (
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            回答を送信する
          </button>
        )}
      </form>
    </div>
  );
};
