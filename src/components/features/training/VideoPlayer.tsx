import React, { useRef, useEffect, useState } from 'react';
import type { Course } from '../../../types/training';
import { apiClient } from '../../../lib/apiClient';
import { Stream } from '@cloudflare/stream-react';

interface VideoPlayerProps {
  course: Course;
  tenantId: string;
  initialTime?: number;
  onEnded: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  course, 
  tenantId, 
  initialTime = 0,
  onEnded 
}) => {
  const streamRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (streamRef.current && initialTime > 0) {
      streamRef.current.currentTime = initialTime;
    }
  }, [initialTime]);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    if (isPlaying) {
      intervalId = setInterval(() => {
        if (streamRef.current) {
          const currentTime = streamRef.current.currentTime;
          const duration = streamRef.current.duration;
          if (!duration || duration === 0) return;
          
          const progressPercent = Math.min(Math.round((currentTime / duration) * 100), 100);
          
          apiClient.post(`/api/progress/${course.id}`, {
            progressPercent,
            currentTime,
          }).catch(() => {
            // Error handling
          });
        }
      }, 5000); // 5秒ごとに送信
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPlaying, course.id, tenantId]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  
  const handleEnded = () => {
    setIsPlaying(false);
    
    // 進捗100%を送信
    apiClient.post(`/api/progress/${course.id}`, {
      progressPercent: 100,
      currentTime: streamRef.current?.duration || 0,
    }).catch(() => {
      // Error handling
    });

    onEnded();
  };

  return (
    <div className="bg-black rounded-lg overflow-hidden shadow-lg">
      {error && <div className="bg-red-500 text-white p-2 text-center">{error}</div>}
      <Stream
        controls
        src={course.cloudflareVideoId}
        className="w-full aspect-video"
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onError={() => setError('動画の読み込みに失敗しました。')}
        streamRef={streamRef}
      />
    </div>
  );
};
