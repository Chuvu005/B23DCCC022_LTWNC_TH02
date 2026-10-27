import { describe, it, expect } from 'vitest';
import { generateSongs } from './songs';

describe('generateSongs', () => {
  it('generateSongs(10000) có 10000 phần tử, id không trùng, mọi thời lượng trong khoảng 150–300', () => {
    const songs = generateSongs(10000);
    expect(songs.length).toBe(10000);

    const idSet = new Set(songs.map((s) => s.id));
    expect(idSet.size).toBe(10000);

    for (const song of songs) {
      expect(song.duration).toBeGreaterThanOrEqual(150);
      expect(song.duration).toBeLessThanOrEqual(300);
    }
  });

  it('bài s1 và s2 khớp thông tin mẫu', () => {
    const songs = generateSongs(10000);
    expect(songs[0]).toEqual({
      id: 's1',
      title: 'Mưa tháng Sáu 1',
      artist: 'Lê Minh',
      duration: 150,
      genre: 'Pop',
    });
    expect(songs[1]).toEqual({
      id: 's2',
      title: 'Nắng tháng Sáu 1',
      artist: 'Quang Huy',
      duration: 187,
      genre: 'Ballad',
    });
  });
});

