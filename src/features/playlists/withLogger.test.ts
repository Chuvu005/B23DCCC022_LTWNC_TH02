import { describe, it, expect, vi } from 'vitest';
import { withLogger } from './withLogger';
import { playlistReducer, Playlist } from './playlistReducer';

describe('withLogger middleware', () => {
  it('trả về đúng kết quả của reducer gốc và log thông tin action', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const loggedReducer = withLogger(playlistReducer);
    const initial: Playlist[] = [];
    const action = {
      type: 'create' as const,
      payload: { id: 'p1', name: 'Nhạc trẻ' },
    };

    const next = loggedReducer(initial, action);
    expect(next.length).toBe(1);
    expect(next[0].name).toBe('Nhạc trẻ');

    // Kiểm tra console.log đã được gọi trong môi trường test/dev
    expect(consoleSpy).toHaveBeenCalledWith(
      'Action: create',
      expect.objectContaining({
        previousState: initial,
        nextState: next,
      })
    );

    consoleSpy.mockRestore();
  });
});

