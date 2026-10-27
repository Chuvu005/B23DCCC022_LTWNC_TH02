export type Genre = 'Pop' | 'Ballad' | 'Rock' | 'Indie' | 'Rap';

export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number; // in seconds
  genre: Genre;
}

export type SortOption = 'default' | 'name-asc' | 'duration-asc';

