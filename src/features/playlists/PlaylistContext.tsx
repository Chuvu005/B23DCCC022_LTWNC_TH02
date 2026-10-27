import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Playlist, PlaylistAction, playlistReducer } from './playlistReducer';
import { withLogger } from './withLogger';

export const PlaylistStateContext = createContext<Playlist[] | undefined>(
  undefined
);
export const PlaylistDispatchContext = createContext<
  React.Dispatch<PlaylistAction> | undefined
>(undefined);

export function usePlaylists(): Playlist[] {
  const context = useContext(PlaylistStateContext);
  if (context === undefined) {
    throw new Error('usePlaylists phải được sử dụng bên trong PlaylistProvider');
  }
  return context;
}

export function usePlaylistDispatch(): React.Dispatch<PlaylistAction> {
  const context = useContext(PlaylistDispatchContext);
  if (context === undefined) {
    throw new Error(
      'usePlaylistDispatch phải được sử dụng bên trong PlaylistProvider'
    );
  }
  return context;
}

export const STORAGE_KEY = 'music-playlists';

function getInitialPlaylists(): Playlist[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Không thể tải playlists từ localStorage:', error);
  }
  return [];
}

export interface PlaylistProviderProps {
  children: React.ReactNode;
  initialPlaylists?: Playlist[];
}

export const PlaylistProvider: React.FC<PlaylistProviderProps> = ({
  children,
  initialPlaylists,
}) => {
  const [playlists, dispatch] = useReducer(
    withLogger(playlistReducer),
    initialPlaylists ?? getInitialPlaylists()
  );

  // Lưu vào localStorage key music-playlists mỗi khi thay đổi
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists));
    } catch (error) {
      console.error('Không thể lưu playlists vào localStorage:', error);
    }
  }, [playlists]);

  return (
    <PlaylistDispatchContext.Provider value={dispatch}>
      <PlaylistStateContext.Provider value={playlists}>
        {children}
      </PlaylistStateContext.Provider>
    </PlaylistDispatchContext.Provider>
  );
};

