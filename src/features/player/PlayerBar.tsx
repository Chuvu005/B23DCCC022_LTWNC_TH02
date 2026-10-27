import React, { useEffect } from 'react';
import { usePlayerStore } from './usePlayerStore';
import { ProgressBar } from './ProgressBar';

export const PlayerBar: React.FC = () => {
  // Lấy state qua selector riêng, không đọc position ở đây để chống re-render mỗi giây
  const currentSong = usePlayerStore((s) =>
    s.currentIndex >= 0 && s.currentIndex < s.queue.length
      ? s.queue[s.currentIndex]
      : null
  );
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const queueLength = usePlayerStore((s) => s.queue.length);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const next = usePlayerStore((s) => s.next);
  const prev = usePlayerStore((s) => s.prev);
  const tick = usePlayerStore((s) => s.tick);

  // Đồng hồ: một useEffect dùng setInterval 1000ms gọi tick(), chỉ chạy khi isPlaying; cleanup bằng clearInterval
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      tick();
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, tick]);

  return (
    <footer className="player-bar" data-testid="player-bar">
      <div className="player-song-info">
        <span className="player-song-text" data-testid="player-song-text">
          {currentSong
            ? `Đang phát: ${currentSong.title} – ${currentSong.artist}`
            : 'Chưa phát bài nào'}
        </span>
      </div>

      <div className="player-center-controls">
        <div className="player-buttons">
          <button
            type="button"
            className="player-btn btn-prev"
            onClick={prev}
            aria-label="Trước"
          >
            Trước
          </button>
          <button
            type="button"
            className="player-btn btn-play-pause"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Tạm dừng' : 'Phát'}
          >
            {isPlaying ? 'Tạm dừng' : 'Phát'}
          </button>
          <button
            type="button"
            className="player-btn btn-next"
            onClick={next}
            aria-label="Sau"
          >
            Sau
          </button>
        </div>

        <ProgressBar />
      </div>

      <div className="player-queue-info">
        <span className="queue-count" data-testid="player-queue-text">
          Hàng đợi: {queueLength} bài
        </span>
      </div>
    </footer>
  );
};

export default PlayerBar;

