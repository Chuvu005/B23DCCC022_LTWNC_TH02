import { describe, it, expect } from 'vitest';
import { playlistReducer, Playlist } from './playlistReducer';

describe('playlistReducer', () => {
  const initialPlaylists: Playlist[] = [
    {
      id: 'pl-1',
      name: 'Nhạc nhẹ',
      songIds: ['s1', 's2'],
    },
  ];

  it('tạo playlist mới', () => {
    const action = {
      type: 'create' as const,
      payload: { id: 'pl-2', name: 'Chạy bộ' },
    };
    const newState = playlistReducer(initialPlaylists, action);

    expect(newState.length).toBe(2);
    expect(newState[1]).toEqual({
      id: 'pl-2',
      name: 'Chạy bộ',
      songIds: [],
    });
  });

  it('addSong không thêm trùng bài', () => {
    // Thêm s3 (chưa có)
    const addS3 = {
      type: 'addSong' as const,
      payload: { playlistId: 'pl-1', songId: 's3' },
    };
    const stateWithS3 = playlistReducer(initialPlaylists, addS3);
    expect(stateWithS3[0].songIds).toEqual(['s1', 's2', 's3']);

    // Thêm lại s1 (đã có trong danh sách)
    const addS1Again = {
      type: 'addSong' as const,
      payload: { playlistId: 'pl-1', songId: 's1' },
    };
    const stateDuplicate = playlistReducer(stateWithS3, addS1Again);
    expect(stateDuplicate[0].songIds).toEqual(['s1', 's2', 's3']);
  });

  it('removeSong xóa bài khỏi playlist', () => {
    const action = {
      type: 'removeSong' as const,
      payload: { playlistId: 'pl-1', songId: 's1' },
    };
    const newState = playlistReducer(initialPlaylists, action);
    expect(newState[0].songIds).toEqual(['s2']);
  });

  it('xóa playlist không tồn tại thì state giữ nguyên (toEqual)', () => {
    const action = {
      type: 'remove' as const,
      payload: { id: 'non-existent-id' },
    };
    const newState = playlistReducer(initialPlaylists, action);
    expect(newState).toEqual(initialPlaylists);
  });

  it('đổi tên playlist (rename)', () => {
    const action = {
      type: 'rename' as const,
      payload: { id: 'pl-1', name: 'Nhạc thư giãn' },
    };
    const newState = playlistReducer(initialPlaylists, action);
    expect(newState[0].name).toBe('Nhạc thư giãn');
  });

  it('cập nhật danh sách playlist (set)', () => {
    const action = {
      type: 'set' as const,
      payload: [],
    };
    const newState = playlistReducer(initialPlaylists, action);
    expect(newState).toEqual([]);
  });
});

