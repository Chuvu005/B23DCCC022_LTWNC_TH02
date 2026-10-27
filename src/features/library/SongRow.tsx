import React from 'react';
import { Song } from '../../types';
import { formatDuration } from '../../utils/format';

export interface SongRowProps {
  song: Song;
  style?: React.CSSProperties;
  onPlay?: (song: Song) => void;
  onToggleFavorite?: (songId: string) => void;
  isFavorite?: boolean;
  onAddToQueue?: (song: Song) => void;
  onAddToPlaylist?: (song: Song) => void;
  selectedPlaylistId?: string | null;
}

export const SongRow: React.FC<SongRowProps> = React.memo(
  ({
    song,
    style,
    onPlay,
    onToggleFavorite,
    isFavorite = false,
    onAddToQueue,
    onAddToPlaylist,
    selectedPlaylistId,
  }) => {
    return (
      <div
        className="song-row"
        style={style}
        data-testid={`song-row-${song.id}`}
      >
        <div className="song-main-info">
          <span className="song-title">{song.title}</span>
          <span className="song-artist">{song.artist}</span>
        </div>
        <div className="song-meta">
          <span className="song-genre">{song.genre}</span>
          <span className="song-duration">{formatDuration(song.duration)}</span>
        </div>
        <div className="song-actions">
          <button
            type="button"
            className="btn-action btn-play"
            onClick={() => onPlay?.(song)}
          >
            Phát
          </button>
          <button
            type="button"
            className="btn-action btn-favorite"
            aria-label={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
            onClick={() => onToggleFavorite?.(song.id)}
          >
            {isFavorite ? '♥' : '♡'}
          </button>
          <button
            type="button"
            className="btn-action btn-queue"
            onClick={() => onAddToQueue?.(song)}
          >
            + Hàng đợi
          </button>
          {onAddToPlaylist && (
            <button
              type="button"
              className="btn-action btn-playlist"
              disabled={!selectedPlaylistId}
              onClick={() => onAddToPlaylist(song)}
            >
              + Playlist
            </button>
          )}
        </div>
      </div>
    );
  }
);

SongRow.displayName = 'SongRow';

