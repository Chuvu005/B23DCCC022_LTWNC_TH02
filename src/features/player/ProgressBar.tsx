import React from 'react';
import { usePlayerStore } from './usePlayerStore';
import { formatDuration } from '../../utils/format';

export const ProgressBar: React.FC = React.memo(() => {
  // Chỉ component này đọc position để chống re-render các component khác mỗi giây
  const position = usePlayerStore((s) => s.position);
  const currentSong = usePlayerStore((s) =>
    s.currentIndex >= 0 && s.currentIndex < s.queue.length
      ? s.queue[s.currentIndex]
      : null
  );

  const duration = currentSong?.duration || 0;
  const percent = duration > 0 ? Math.min(100, (position / duration) * 100) : 0;

  return (
    <div className="player-progress-area">
      <span className="player-time" data-testid="player-time">
        {formatDuration(position)} / {formatDuration(duration)}
      </span>
      <div
        className="progress-bar-track"
        role="progressbar"
        aria-valuenow={position}
        aria-valuemin={0}
        aria-valuemax={duration}
      >
        <div
          className="progress-bar-fill"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
});

ProgressBar.displayName = 'ProgressBar';

