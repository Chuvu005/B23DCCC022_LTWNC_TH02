import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SongRow } from './SongRow';
import { Song } from '../../types';

describe('SongRow', () => {
  const mockSong: Song = {
    id: 's1',
    title: 'Mưa tháng Sáu 1',
    artist: 'Lê Minh',
    duration: 150, // 2:30
    genre: 'Pop',
  };

  it('hiển thị tên bài và “2:30”; bấm nút Phát (tìm bằng getByRole) thì hàm mock vi.fn() được gọi với đúng bài hát', async () => {
    const handlePlay = vi.fn();
    const user = userEvent.setup();

    render(<SongRow song={mockSong} onPlay={handlePlay} />);

    expect(screen.getByText('Mưa tháng Sáu 1')).toBeInTheDocument();
    expect(screen.getByText('2:30')).toBeInTheDocument();

    const playButton = screen.getByRole('button', { name: 'Phát' });
    expect(playButton).toBeInTheDocument();

    await user.click(playButton);

    expect(handlePlay).toHaveBeenCalledTimes(1);
    expect(handlePlay).toHaveBeenCalledWith(mockSong);
  });
});

