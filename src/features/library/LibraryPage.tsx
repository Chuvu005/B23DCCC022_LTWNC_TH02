import React, { useState, useMemo, useCallback, useContext } from 'react';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import { Song, SortOption } from '../../types';
import { initialSongs, GENRES } from '../../data/songs';
import { useDebounce } from '../../hooks/useDebounce';
import { usePlayerStore } from '../player/usePlayerStore';
import { useFavoritesStore } from '../favorites/useFavoritesStore';
import {
  PlaylistStateContext,
  PlaylistDispatchContext,
} from '../playlists/PlaylistContext';
import { SongRow } from './SongRow';

export interface LibraryPageProps {
  songs?: Song[];
  onPlaySong?: (song: Song, currentList: Song[]) => void;
  onToggleFavorite?: (songId: string) => void;
  isFavorite?: (songId: string) => boolean;
  onAddToQueue?: (song: Song) => void;
  onAddToPlaylist?: (song: Song) => void;
  selectedPlaylistId?: string | null;
  onSelectPlaylist?: (playlistId: string) => void;
  playlists?: Array<{ id: string; name: string }>;
}

interface ItemData {
  songs: Song[];
  onPlay: (song: Song) => void;
  onToggleFavorite: (songId: string) => void;
  isFavorite: (songId: string) => boolean;
  onAddToQueue: (song: Song) => void;
  onAddToPlaylist?: (song: Song) => void;
  selectedPlaylistId?: string | null;
}

const Row = React.memo(({ index, style, data }: ListChildComponentProps<ItemData>) => {
  const song = data.songs[index];
  if (!song) return null;
  return (
    <SongRow
      song={song}
      style={style}
      onPlay={data.onPlay}
      onToggleFavorite={data.onToggleFavorite}
      isFavorite={data.isFavorite(song.id)}
      onAddToQueue={data.onAddToQueue}
      onAddToPlaylist={data.onAddToPlaylist}
      selectedPlaylistId={data.selectedPlaylistId}
    />
  );
});

Row.displayName = 'VirtualRow';

export const LibraryPage: React.FC<LibraryPageProps> = ({
  songs = initialSongs,
  onPlaySong,
  onToggleFavorite,
  isFavorite,
  onAddToQueue,
  onAddToPlaylist,
  selectedPlaylistId: propSelectedPlaylistId,
  onSelectPlaylist,
  playlists: propPlaylists,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [localSelectedPlaylistId, setLocalSelectedPlaylistId] = useState<string>('');

  const debouncedSearch = useDebounce(searchTerm, 300);

  // Zustand hooks qua selector riêng
  const storePlayQueue = usePlayerStore((s) => s.playQueue);
  const storeAddToQueue = usePlayerStore((s) => s.addToQueue);
  const favoriteIds = useFavoritesStore((s) => s.ids);
  const storeToggleFavorite = useFavoritesStore((s) => s.toggle);

  // Playlists Context (tùy chọn khi chạy độc lập hoặc qua Provider)
  const contextPlaylists = useContext(PlaylistStateContext);
  const contextDispatch = useContext(PlaylistDispatchContext);

  const availablePlaylists = propPlaylists ?? contextPlaylists ?? [];
  const currentSelectedPlaylistId =
    propSelectedPlaylistId !== undefined
      ? propSelectedPlaylistId
      : localSelectedPlaylistId;

  // Tối ưu render: kết quả lọc + sắp xếp tính bằng useMemo (sắp xếp trên bản sao mảng, tên dùng localeCompare(b, "vi"))
  const filteredAndSortedSongs = useMemo(() => {
    let result = songs;

    const query = debouncedSearch.trim().toLowerCase();
    if (query) {
      result = result.filter(
        (song) =>
          song.title.toLowerCase().includes(query) ||
          song.artist.toLowerCase().includes(query)
      );
    }

    if (selectedGenre !== 'all') {
      result = result.filter((song) => song.genre === selectedGenre);
    }

    if (sortOption === 'name-asc') {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title, 'vi'));
    } else if (sortOption === 'duration-asc') {
      result = [...result].sort((a, b) => a.duration - b.duration);
    }

    return result;
  }, [songs, debouncedSearch, selectedGenre, sortOption]);

  // Bấm Phát ở một dòng → hàng đợi là danh sách đang hiển thị (đã lọc, đã sắp xếp), bắt đầu từ bài đó
  const handlePlay = useCallback(
    (song: Song) => {
      if (onPlaySong) {
        onPlaySong(song, filteredAndSortedSongs);
      } else {
        const startIndex = filteredAndSortedSongs.findIndex((s) => s.id === song.id);
        storePlayQueue(filteredAndSortedSongs, startIndex >= 0 ? startIndex : 0);
      }
    },
    [onPlaySong, filteredAndSortedSongs, storePlayQueue]
  );

  const handleToggleFavorite = useCallback(
    (songId: string) => {
      if (onToggleFavorite) {
        onToggleFavorite(songId);
      } else {
        storeToggleFavorite(songId);
      }
    },
    [onToggleFavorite, storeToggleFavorite]
  );

  // Bấm + Hàng đợi → thêm bài vào cuối hàng đợi
  const handleAddToQueue = useCallback(
    (song: Song) => {
      if (onAddToQueue) {
        onAddToQueue(song);
      } else {
        storeAddToQueue(song);
      }
    },
    [onAddToQueue, storeAddToQueue]
  );

  // Thêm bài vào playlist: mỗi dòng có nút + Playlist thêm bài vào playlist đang chọn (chưa có playlist nào thì nút bị khóa)
  const handleAddToPlaylist = useCallback(
    (song: Song) => {
      if (onAddToPlaylist) {
        onAddToPlaylist(song);
      } else if (currentSelectedPlaylistId && contextDispatch) {
        contextDispatch({
          type: 'addSong',
          payload: {
            playlistId: currentSelectedPlaylistId,
            songId: song.id,
          },
        });
      }
    },
    [onAddToPlaylist, currentSelectedPlaylistId, contextDispatch]
  );

  const handleSelectPlaylistChange = (playlistId: string) => {
    if (onSelectPlaylist) {
      onSelectPlaylist(playlistId);
    } else {
      setLocalSelectedPlaylistId(playlistId);
    }
  };

  const checkIsFavorite = useCallback(
    (songId: string) => {
      if (isFavorite) {
        return isFavorite(songId);
      }
      return favoriteIds.includes(songId);
    },
    [isFavorite, favoriteIds]
  );

  const itemKey = useCallback((index: number, data: ItemData) => {
    return data.songs[index].id;
  }, []);

  const itemData = useMemo<ItemData>(
    () => ({
      songs: filteredAndSortedSongs,
      onPlay: handlePlay,
      onToggleFavorite: handleToggleFavorite,
      isFavorite: checkIsFavorite,
      onAddToQueue: handleAddToQueue,
      onAddToPlaylist: handleAddToPlaylist,
      selectedPlaylistId: currentSelectedPlaylistId,
    }),
    [
      filteredAndSortedSongs,
      handlePlay,
      handleToggleFavorite,
      checkIsFavorite,
      handleAddToQueue,
      handleAddToPlaylist,
      currentSelectedPlaylistId,
    ]
  );

  return (
    <div className="library-page">
      <h1>Thư viện bài hát</h1>

      <div className="controls-bar">
        <div className="control-group">
          <label htmlFor="search-input">Tìm kiếm</label>
          <input
            id="search-input"
            type="text"
            placeholder="Tìm theo tên bài hoặc ca sĩ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="control-group">
          <label htmlFor="genre-select">Thể loại</label>
          <select
            id="genre-select"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="all">Tất cả</option>
            {GENRES.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="sort-select">Sắp xếp</label>
          <select
            id="sort-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
          >
            <option value="default">Mặc định</option>
            <option value="name-asc">Tên A–Z</option>
            <option value="duration-asc">Thời lượng tăng dần</option>
          </select>
        </div>

        {/* Ô chọn Playlist đang chọn */}
        <div className="control-group">
          <label htmlFor="playlist-select">Playlist đang chọn</label>
          <select
            id="playlist-select"
            value={currentSelectedPlaylistId || ''}
            onChange={(e) => handleSelectPlaylistChange(e.target.value)}
          >
            <option value="">-- Chọn playlist --</option>
            {availablePlaylists.map((pl) => (
              <option key={pl.id} value={pl.id}>
                {pl.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="results-info">
        {filteredAndSortedSongs.length === 0 ? (
          <p className="no-results">Không tìm thấy bài hát nào</p>
        ) : (
          <p className="result-count">
            Tìm thấy {filteredAndSortedSongs.length} bài hát
          </p>
        )}
      </div>

      {filteredAndSortedSongs.length > 0 && (
        <div className="song-list-container" data-testid="song-list-container">
          <List
            height={550}
            itemCount={filteredAndSortedSongs.length}
            itemSize={56}
            width="100%"
            itemKey={itemKey}
            itemData={itemData}
          >
            {Row}
          </List>
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
