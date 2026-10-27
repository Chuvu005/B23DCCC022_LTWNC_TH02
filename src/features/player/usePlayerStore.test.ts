import { describe, it, expect, beforeEach } from 'vitest';
import { usePlayerStore, initialPlayerState } from './usePlayerStore';
import { Song } from '../../types';

describe('usePlayerStore', () => {
  const mockSongs: Song[] = [
    {
      id: 's1',
      title: 'Mưa tháng Sáu 1',
      artist: 'Lê Minh',
      duration: 150,
      genre: 'Pop',
    },
    {
      id: 's2',
      title: 'Nắng tháng Sáu 1',
      artist: 'Quang Huy',
      duration: 187,
      genre: 'Ballad',
    },
    {
      id: 's3',
      title: 'Biển bình yên 1',
      artist: 'Thu Hà',
      duration: 200,
      genre: 'Rock',
    },
  ];

  beforeEach(() => {
    // Đặt lại store trước mỗi test bằng usePlayerStore.setState(...) trong beforeEach
    usePlayerStore.setState(initialPlayerState);
  });

  it('playQueue đặt đúng bài', () => {
    usePlayerStore.getState().playQueue(mockSongs, 1);

    const state = usePlayerStore.getState();
    expect(state.queue).toEqual(mockSongs);
    expect(state.currentIndex).toBe(1);
    expect(state.isPlaying).toBe(true);
    expect(state.position).toBe(0);
    expect(state.queue[state.currentIndex].title).toBe('Nắng tháng Sáu 1');
  });

  it('tick ở giây cuối tự sang bài sau', () => {
    usePlayerStore.getState().playQueue(mockSongs, 0);

    // Giả lập đang ở giây cuối (duration = 150, giây cuối là 149)
    usePlayerStore.setState({ position: 149 });

    usePlayerStore.getState().tick();

    const state = usePlayerStore.getState();
    expect(state.currentIndex).toBe(1);
    expect(state.position).toBe(0);
    expect(state.isPlaying).toBe(true);
  });

  it('next ở bài cuối thì isPlaying là false', () => {
    usePlayerStore.getState().playQueue(mockSongs, 2); // bài cuối (index 2)

    usePlayerStore.getState().next();

    const state = usePlayerStore.getState();
    expect(state.isPlaying).toBe(false);
    expect(state.position).toBe(0);
  });

  it('prev khi đã phát quá 3 giây thì chỉ tua về 0:00', () => {
    usePlayerStore.getState().playQueue(mockSongs, 1);
    usePlayerStore.setState({ position: 5 });

    usePlayerStore.getState().prev();

    const state = usePlayerStore.getState();
    expect(state.currentIndex).toBe(1);
    expect(state.position).toBe(0);
  });

  it('prev khi chưa quá 3 giây lùi về bài trước; ở bài đầu tua về 0:00', () => {
    usePlayerStore.getState().playQueue(mockSongs, 1);
    usePlayerStore.setState({ position: 2 });

    usePlayerStore.getState().prev();

    let state = usePlayerStore.getState();
    expect(state.currentIndex).toBe(0);
    expect(state.position).toBe(0);

    // Ở bài đầu
    usePlayerStore.setState({ position: 1 });
    usePlayerStore.getState().prev();
    state = usePlayerStore.getState();
    expect(state.currentIndex).toBe(0);
    expect(state.position).toBe(0);
  });

  it('addToQueue thêm vào cuối hàng đợi và bỏ qua bài đã tồn tại', () => {
    usePlayerStore.getState().playQueue([mockSongs[0]], 0);

    // Thêm bài s2
    usePlayerStore.getState().addToQueue(mockSongs[1]);
    expect(usePlayerStore.getState().queue.length).toBe(2);

    // Thêm lại bài s1 (đã có trong hàng đợi)
    usePlayerStore.getState().addToQueue(mockSongs[0]);
    expect(usePlayerStore.getState().queue.length).toBe(2);
  });

  it('thử thách thêm: bật shuffle chuyển bài ngẫu nhiên và repeat lặp lại', () => {
    usePlayerStore.getState().playQueue(mockSongs, 0);

    // Toggle shuffle
    usePlayerStore.getState().toggleShuffle();
    expect(usePlayerStore.getState().isShuffle).toBe(true);

    // Toggle repeat: off -> all -> one -> off
    expect(usePlayerStore.getState().repeatMode).toBe('off');
    usePlayerStore.getState().toggleRepeat();
    expect(usePlayerStore.getState().repeatMode).toBe('all');
    usePlayerStore.getState().toggleRepeat();
    expect(usePlayerStore.getState().repeatMode).toBe('one');

    // Ở chế độ repeat 'one', next() sẽ tua lại về 0 của bài hiện tại
    usePlayerStore.setState({ position: 20 });
    usePlayerStore.getState().next();
    expect(usePlayerStore.getState().currentIndex).toBe(0);
    expect(usePlayerStore.getState().position).toBe(0);
  });
});

