import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePlaylists, usePlaylistDispatch } from './PlaylistContext';
import { Playlist } from './playlistReducer';

interface PlaylistCreateFormProps {
  existingPlaylists: Playlist[];
}

export const PlaylistCreateForm: React.FC<PlaylistCreateFormProps> = ({
  existingPlaylists,
}) => {
  // Dùng usePlaylistDispatch để dispatch action tạo playlist
  const dispatch = usePlaylistDispatch();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();

    if (!trimmed) {
      setError('Tên playlist không được để trống');
      return;
    }

    const isDuplicate = existingPlaylists.some(
      (p) => p.name.trim().toLowerCase() === trimmed.toLowerCase()
    );

    if (isDuplicate) {
      setError('Tên playlist đã tồn tại');
      return;
    }

    dispatch({ type: 'create', payload: { name: trimmed } });
    setName('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="playlist-form">
      <div className="form-input-group">
        <label htmlFor="playlist-name-input">Tên playlist</label>
        <input
          id="playlist-name-input"
          type="text"
          placeholder="Nhập tên playlist..."
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError('');
          }}
        />
      </div>
      <button type="submit" className="btn-create">
        Tạo
      </button>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
};

export const PlaylistsPage: React.FC = () => {
  const playlists = usePlaylists();
  const dispatch = usePlaylistDispatch();

  return (
    <div className="playlists-page">
      <h1>Danh sách Playlist</h1>

      {/* Form tạo playlist */}
      <PlaylistCreateForm existingPlaylists={playlists} />

      {/* Danh sách playlist */}
      <div className="playlists-list-container">
        {playlists.length === 0 ? (
          <p className="empty-message">Chưa có playlist nào.</p>
        ) : (
          <div className="playlists-list" data-testid="playlists-list">
            {playlists.map((pl) => (
              <div
                key={pl.id}
                className="playlist-card"
                data-testid={`playlist-item-${pl.id}`}
              >
                <div className="playlist-meta">
                  <h3 className="playlist-title">{pl.name}</h3>
                  <span className="playlist-song-count">
                    {pl.songIds.length} bài
                  </span>
                </div>
                <div className="playlist-card-actions">
                  <Link
                    to={`/playlists/${pl.id}`}
                    className="btn-link-detail"
                  >
                    Chi tiết
                  </Link>
                  <button
                    type="button"
                    className="btn-delete"
                    onClick={() =>
                      dispatch({ type: 'remove', payload: { id: pl.id } })
                    }
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistsPage;
