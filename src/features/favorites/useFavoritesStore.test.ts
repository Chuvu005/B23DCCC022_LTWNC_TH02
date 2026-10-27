import { describe, it, expect, beforeEach } from 'vitest';
import { useFavoritesStore } from './useFavoritesStore';

describe('useFavoritesStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useFavoritesStore.setState({ ids: [] });
  });

  it('toggle thêm và xóa id khỏi danh sách yêu thích', () => {
    expect(useFavoritesStore.getState().ids).toEqual([]);

    useFavoritesStore.getState().toggle('s1');
    expect(useFavoritesStore.getState().ids).toEqual(['s1']);

    useFavoritesStore.getState().toggle('s3');
    expect(useFavoritesStore.getState().ids).toEqual(['s1', 's3']);

    useFavoritesStore.getState().toggle('s1');
    expect(useFavoritesStore.getState().ids).toEqual(['s3']);
  });

  it('lưu vào localStorage với key music-favorites', () => {
    useFavoritesStore.getState().toggle('s1');
    useFavoritesStore.getState().toggle('s3');

    const stored = localStorage.getItem('music-favorites');
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed.state.ids).toEqual(['s1', 's3']);
  });
});

