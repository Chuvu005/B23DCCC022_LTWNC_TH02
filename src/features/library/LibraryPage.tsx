import React, { useState, useMemo, useCallback } from 'react';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import { Song, SortOption } from '../../types';
import { initialSongs, GENRES } from '../../data/songs';
import { useDebounce } from '../../hooks/useDebounce';
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
  selectedPlaylistId,
  onSelectPlaylist,
  playlists = [],
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [sortOption, setSortOption] = useState<SortOption>('default');

  const debouncedSearch = useDebounce(searchTerm, 300);

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

  const handlePlay = useCallback(
    (song: Song) => {
      onPlaySong?.(song, filteredAndSortedSongs);
    },
    [onPlaySong, filteredAndSortedSongs]
  );

  const handleToggleFavorite = useCallback(
    (songId: string) => {
      onToggleFavorite?.(songId);
    },
    [onToggleFavorite]
  );

  const handleAddToQueue = useCallback(
    (song: Song) => {
      onAddToQueue?.(song);
    },
    [onAddToQueue]
  );

  const handleAddToPlaylist = useCallback(
    (song: Song) => {
      onAddToPlaylist?.(song);
    },
    [onAddToPlaylist]
  );

  const checkIsFavorite = useCallback(
    (songId: string) => {
      return isFavorite ? isFavorite(songId) : false;
    },
    [isFavorite]
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
      selectedPlaylistId,
    }),
    [
      filteredAndSortedSongs,
      handlePlay,
      handleToggleFavorite,
      checkIsFavorite,
      handleAddToQueue,
      handleAddToPlaylist,
      selectedPlaylistId,
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

        {playlists.length > 0 && onSelectPlaylist && (
          <div className="control-group">
            <label htmlFor="playlist-select">Playlist đang chọn</label>
            <select
              id="playlist-select"
              value={selectedPlaylistId || ''}
              onChange={(e) => onSelectPlaylist(e.target.value)}
            >
              <option value="">-- Chọn playlist --</option>
              {playlists.map((pl) => (
                <option key={pl.id} value={pl.id}>
                  {pl.name}
                </option>
              ))}
            </select>
          </div>
        )}
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
