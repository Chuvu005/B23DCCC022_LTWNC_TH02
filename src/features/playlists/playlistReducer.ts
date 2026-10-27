export interface Playlist {
  id: string;
  name: string;
  songIds: string[];
}

export type PlaylistAction =
  | { type: 'create'; payload: { id?: string; name: string } }
  | { type: 'rename'; payload: { id: string; name: string } }
  | { type: 'remove'; payload: { id: string } }
  | { type: 'addSong'; payload: { playlistId: string; songId: string } }
  | { type: 'removeSong'; payload: { playlistId: string; songId: string } }
  | { type: 'set'; payload: Playlist[] };

export function playlistReducer(
  state: Playlist[],
  action: PlaylistAction
): Playlist[] {
  switch (action.type) {
    case 'create': {
      const newPlaylist: Playlist = {
        id:
          action.payload.id ||
          `pl_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        name: action.payload.name,
        songIds: [],
      };
      return [...state, newPlaylist];
    }

    case 'rename': {
      return state.map((pl) =>
        pl.id === action.payload.id
          ? { ...pl, name: action.payload.name }
          : pl
      );
    }

    case 'remove': {
      const exists = state.some((pl) => pl.id === action.payload.id);
      if (!exists) {
        // xóa playlist không tồn tại thì state giữ nguyên
        return state;
      }
      return state.filter((pl) => pl.id !== action.payload.id);
    }

    case 'addSong': {
      return state.map((pl) => {
        if (pl.id !== action.payload.playlistId) return pl;
        // addSong không thêm trùng bài
        if (pl.songIds.includes(action.payload.songId)) {
          return pl;
        }
        return {
          ...pl,
          songIds: [...pl.songIds, action.payload.songId],
        };
      });
    }

    case 'removeSong': {
      return state.map((pl) => {
        if (pl.id !== action.payload.playlistId) return pl;
        return {
          ...pl,
          songIds: pl.songIds.filter((id) => id !== action.payload.songId),
        };
      });
    }

    case 'set': {
      return action.payload;
    }

    default:
      return state;
  }
}

