import React, { useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePlaylists, usePlaylistDispatch } from './PlaylistContext';
import { usePlayerStore } from '../player/usePlayerStore';
import { initialSongs } from '../../data/songs';
import { formatDuration } from '../../utils/format';
import { Song } from '../../types';

export const PlaylistDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const playlists = usePlaylists();
  const dispatch = usePlaylistDispatch();
  const playQueue = usePlayerStore((s) => s.playQueue);

  const playlist = useMemo(
    () => playlists.find((p) => p.id === id),
    [playlists, id]
  );

  // Danh sách bài hát trong playlist
  const songs = useMemo(() => {
    if (!playlist) return [];
    return playlist.songIds
      .map((sid) => initialSongs.find((s) => s.id === sid))
      .filter((s): s is Song => Boolean(s));
  }, [playlist]);

  // Dùng reduce tính tổng thời lượng theo yêu cầu: Tổng thời lượng: X phút Y giây
  const totalSeconds = useMemo(() => {
    return songs.reduce((acc, song) => acc + song.duration, 0);
  }, [songs]);

  const totalMinutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  const handlePlayAll = useCallback(() => {
    if (songs.length > 0) {
      playQueue(songs, 0);
    }
  }, [songs, playQueue]);

  const handleRemoveSong = useCallback(
    (songId: string) => {
      if (playlist) {
        dispatch({
          type: 'removeSong',
          payload: { playlistId: playlist.id, songId },
        });
      }
    },
    [dispatch, playlist]
  );

  if (!playlist) {
    return (
      <div className="playlist-detail-page">
        <Link to="/playlists" className="btn-back">
          ← Quay lại danh sách playlist
        </Link>
        <p className="not-found" role="alert">
          Không tìm thấy playlist
        </p>
      </div>
    );
  }

  return (
    <div className="playlist-detail-page">
      <div className="detail-header">
        <Link to="/playlists" className="btn-back">
          ← Quay lại
        </Link>
        <h1>{playlist.name}</h1>
        <div className="detail-meta">
          <p className="total-duration">
            Tổng thời lượng: {totalMinutes} phút {remainingSeconds} giây
          </p>
          {songs.length > 0 && (
            <button
              type="button"
              className="btn-play-all"
              onClick={handlePlayAll}
            >
              Phát tất cả
            </button>
          )}
        </div>
      </div>

      <div className="playlist-songs-list">
        {songs.length === 0 ? (
          <p className="empty-message">Playlist này chưa có bài hát nào.</p>
        ) : (
          songs.map((song) => (
            <div
              key={song.id}
              className="song-row playlist-song-row"
              data-testid={`playlist-song-${song.id}`}
            >
              <div className="song-main-info">
                <span className="song-title">{song.title}</span>
                <span className="song-artist">{song.artist}</span>
              </div>
              <div className="song-meta">
                <span className="song-genre">{song.genre}</span>
                <span className="song-duration">
                  {formatDuration(song.duration)}
                </span>
              </div>
              <div className="song-actions">
                <button
                  type="button"
                  className="btn-action btn-remove-song"
                  onClick={() => handleRemoveSong(song.id)}
                >
                  Bỏ
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PlaylistDetailPage;
