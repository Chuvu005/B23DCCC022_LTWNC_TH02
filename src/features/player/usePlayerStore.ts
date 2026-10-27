import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Song } from '../../types';

export type RepeatMode = 'off' | 'all' | 'one';

export interface PlayerState {
  queue: Song[];
  currentIndex: number;
  isPlaying: boolean;
  position: number; // in seconds
  isShuffle: boolean;
  repeatMode: RepeatMode;

  playQueue: (songs: Song[], startIndex: number) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  addToQueue: (song: Song) => void;
  tick: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
}

export const initialPlayerState = {
  queue: [] as Song[],
  currentIndex: -1,
  isPlaying: false,
  position: 0,
  isShuffle: false,
  repeatMode: 'off' as RepeatMode,
};

export const usePlayerStore = create<PlayerState>()(
  devtools(
    (set, get) => ({
      ...initialPlayerState,

      playQueue: (songs: Song[], startIndex: number) => {
        if (songs.length === 0) return;
        const validIndex = Math.max(0, Math.min(startIndex, songs.length - 1));
        set(
          {
            queue: songs,
            currentIndex: validIndex,
            isPlaying: true,
            position: 0,
          },
          false,
          'player/playQueue'
        );
      },

      togglePlay: () => {
        const { queue, currentIndex, isPlaying } = get();
        if (queue.length === 0 || currentIndex === -1) return;
        set({ isPlaying: !isPlaying }, false, 'player/togglePlay');
      },

      next: () => {
        const { queue, currentIndex, repeatMode, isShuffle } = get();
        if (queue.length === 0 || currentIndex === -1) return;

        // Lặp lại 1 bài
        if (repeatMode === 'one') {
          set({ position: 0, isPlaying: true }, false, 'player/next-repeatOne');
          return;
        }

        // Phát ngẫu nhiên
        if (isShuffle && queue.length > 1) {
          let nextIndex = currentIndex;
          while (nextIndex === currentIndex) {
            nextIndex = Math.floor(Math.random() * queue.length);
          }
          set(
            { currentIndex: nextIndex, position: 0, isPlaying: true },
            false,
            'player/next-shuffle'
          );
          return;
        }

        // Phát tuần tự
        if (currentIndex >= queue.length - 1) {
          if (repeatMode === 'all') {
            // Lặp lại toàn bộ hàng đợi
            set(
              { currentIndex: 0, position: 0, isPlaying: true },
              false,
              'player/next-repeatAll'
            );
          } else {
            // next() ở bài cuối thì dừng phát
            set({ isPlaying: false, position: 0 }, false, 'player/next-stop');
          }
        } else {
          set(
            {
              currentIndex: currentIndex + 1,
              position: 0,
              isPlaying: true,
            },
            false,
            'player/next'
          );
        }
      },

      prev: () => {
        const { currentIndex, position, repeatMode, queue } = get();
        // prev() khi đã phát quá 3 giây thì chỉ tua về 0:00, ngược lại lùi về bài trước (bài đầu thì tua về 0:00)
        if (position > 3) {
          set({ position: 0 }, false, 'player/prev-rewind');
        } else if (currentIndex > 0) {
          set(
            {
              currentIndex: currentIndex - 1,
              position: 0,
              isPlaying: true,
            },
            false,
            'player/prev'
          );
        } else if (repeatMode === 'all' && queue.length > 0) {
          set(
            {
              currentIndex: queue.length - 1,
              position: 0,
              isPlaying: true,
            },
            false,
            'player/prev-wrap'
          );
        } else {
          set({ position: 0 }, false, 'player/prev-start');
        }
      },

      addToQueue: (song: Song) => {
        const { queue } = get();
        // bài đã có trong hàng đợi thì bỏ qua
        if (queue.some((item) => item.id === song.id)) {
          return;
        }
        set({ queue: [...queue, song] }, false, 'player/addToQueue');
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
          set({ position: position + 1 }, false, 'player/tick');
        }
      },

      toggleShuffle: () => {
        set(
          (state) => ({ isShuffle: !state.isShuffle }),
          false,
          'player/toggleShuffle'
        );
      },

      toggleRepeat: () => {
        set(
          (state) => {
            const nextMode: RepeatMode =
              state.repeatMode === 'off'
                ? 'all'
                : state.repeatMode === 'all'
                  ? 'one'
                  : 'off';
            return { repeatMode: nextMode };
          },
          false,
          'player/toggleRepeat'
        );
      },
    }),
    { name: 'MusicPlayerStore' }
  )
);
