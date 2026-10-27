import React, { useMemo, useCallback } from 'react';
import { useFavoritesStore } from './useFavoritesStore';
import { usePlayerStore } from '../player/usePlayerStore';
import { initialSongs } from '../../data/songs';
import { SongRow } from '../library/SongRow';
import { Song } from '../../types';

export const FavoritesPage: React.FC = () => {
  const favoriteIds = useFavoritesStore((s) => s.ids);
  const toggleFavorite = useFavoritesStore((s) => s.toggle);
  const playQueue = usePlayerStore((s) => s.playQueue);
  const addToQueue = usePlayerStore((s) => s.addToQueue);

  // Lấy các bài hát tương ứng với favoriteIds
  const favoriteSongs = useMemo(() => {
    const idSet = new Set(favoriteIds);
    return initialSongs.filter((song) => idSet.has(song.id));
  }, [favoriteIds]);

  const handlePlayAll = useCallback(() => {
    if (favoriteSongs.length > 0) {
      playQueue(favoriteSongs, 0);
    }
  }, [favoriteSongs, playQueue]);

  const handlePlaySong = useCallback(
    (song: Song) => {
      const index = favoriteSongs.findIndex((s) => s.id === song.id);
      playQueue(favoriteSongs, index >= 0 ? index : 0);
    },
    [favoriteSongs, playQueue]
  );

  const handleToggleFavorite = useCallback(
    (id: string) => {
      toggleFavorite(id);
    },
    [toggleFavorite]
  );

  const handleAddToQueue = useCallback(
    (song: Song) => {
      addToQueue(song);
    },
    [addToQueue]
  );

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h1>Bài hát yêu thích</h1>
        {favoriteSongs.length > 0 && (
          <button
            type="button"
            className="btn-play-all"
            onClick={handlePlayAll}
          >
            Phát tất cả
          </button>
        )}
      </div>

      {favoriteSongs.length === 0 ? (
        <p className="empty-message">Bạn chưa có bài hát yêu thích.</p>
      ) : (
        <div className="favorite-songs-list" data-testid="favorite-songs-list">
          {favoriteSongs.map((song) => (
            <SongRow
              key={song.id}
              song={song}
              onPlay={handlePlaySong}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={true}
              onAddToQueue={handleAddToQueue}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
