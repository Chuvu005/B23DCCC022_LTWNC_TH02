import { Genre, Song } from '../types';

export const BASE_TITLES = [
  'Mưa tháng Sáu',
  'Nắng tháng Sáu',
  'Biển bình yên',
  'Gió đầu mùa',
  'Hạ vương nắng',
  'Khúc ca xưa',
  'Phố xa lạ',
  'Vết sầu đông',
];

export const ARTISTS = [
  'Lê Minh',
  'Quang Huy',
  'Thu Hà',
  'Bảo Anh',
  'Đức Phúc',
  'Hồng Nhung',
  'Khắc Việt',
  'Mỹ Tâm',
  'Thanh Lam',
  'Tuấn Hưng',
];

export const GENRES: Genre[] = ['Pop', 'Ballad', 'Rock', 'Indie', 'Rap'];

export function generateSongs(count = 10000): Song[] {
  const songs: Song[] = new Array(count);
  for (let i = 0; i < count; i++) {
    const titleBase = BASE_TITLES[i % BASE_TITLES.length];
    const groupNum = Math.floor(i / BASE_TITLES.length) + 1;
    const duration = 150 + ((i * 37) % 151); // Between 150 and 300, i=0 is 150, i=1 is 187
    songs[i] = {
      id: `s${i + 1}`,
      title: `${titleBase} ${groupNum}`,
      artist: ARTISTS[i % ARTISTS.length],
      duration,
      genre: GENRES[i % GENRES.length],
    };
  }
  return songs;
}

export const initialSongs = generateSongs(10000);

