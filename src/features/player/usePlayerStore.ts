import { create } from 'zustand';
import { Song } from '../../types';

export interface PlayerState {
  queue: Song[];
  currentIndex: number;
  isPlaying: boolean;
  position: number; // in seconds

  playQueue: (songs: Song[], startIndex: number) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  addToQueue: (song: Song) => void;
  tick: () => void;
}

export const initialPlayerState = {
  queue: [] as Song[],
  currentIndex: -1,
  isPlaying: false,
  position: 0,
};

export const usePlayerStore = create<PlayerState>()((set, get) => ({
  ...initialPlayerState,

  playQueue: (songs: Song[], startIndex: number) => {
    if (songs.length === 0) return;
    const validIndex = Math.max(0, Math.min(startIndex, songs.length - 1));
    set({
      queue: songs,
      currentIndex: validIndex,
      isPlaying: true,
      position: 0,
    });
  },

  togglePlay: () => {
    const { queue, currentIndex, isPlaying } = get();
    if (queue.length === 0 || currentIndex === -1) return;
    set({ isPlaying: !isPlaying });
  },

  next: () => {
    const { queue, currentIndex } = get();
    if (currentIndex >= queue.length - 1) {
      // next() ở bài cuối thì dừng phát
      set({ isPlaying: false, position: 0 });
    } else {
      set({
        currentIndex: currentIndex + 1,
        position: 0,
        isPlaying: true,
      });
    }
  },

  prev: () => {
    const { currentIndex, position } = get();
    // prev() khi đã phát quá 3 giây thì chỉ tua về 0:00, ngược lại lùi về bài trước (bài đầu thì tua về 0:00)
    if (position > 3) {
      set({ position: 0 });
    } else if (currentIndex > 0) {
      set({
        currentIndex: currentIndex - 1,
        position: 0,
        isPlaying: true,
      });
    } else {
      set({ position: 0 });
    }
  },

  addToQueue: (song: Song) => {
    const { queue } = get();
    // bài đã có trong hàng đợi thì bỏ qua
    if (queue.some((item) => item.id === song.id)) {
      return;
    }
    set({ queue: [...queue, song] });
  },

  tick: () => {
    const { isPlaying, currentIndex, queue, position } = get();
    if (!isPlaying || currentIndex === -1 || !queue[currentIndex]) {
      return;
    }

    const currentSong = queue[currentIndex];
    // hết bài thì tự gọi next()
    if (position + 1 >= currentSong.duration) {
      get().next();
    } else {
      set({ position: position + 1 });
    }
  },
}));

