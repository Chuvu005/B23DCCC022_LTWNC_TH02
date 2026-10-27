import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { PlaylistDetailPage } from './PlaylistDetailPage';
import { PlaylistProvider } from './PlaylistContext';
import { Playlist } from './playlistReducer';
import { usePlayerStore, initialPlayerState } from '../player/usePlayerStore';

describe('PlaylistDetailPage', () => {
  const mockPlaylists: Playlist[] = [
    {
      id: 'pl-run',
      name: 'Chạy bộ',
      songIds: ['s1', 's2'], // s1 duration 150s, s2 duration 187s -> 337s = 5 phút 37 giây
    },
  ];

  beforeEach(() => {
    localStorage.clear();
    usePlayerStore.setState(initialPlayerState);
  });

  function renderDetail(initialEntry: string, playlists = mockPlaylists) {
    return render(
      <PlaylistProvider initialPlaylists={playlists}>
        <MemoryRouter initialEntries={[initialEntry]}>
          <Routes>
            <Route path="/playlists/:id" element={<PlaylistDetailPage />} />
          </Routes>
        </MemoryRouter>
      </PlaylistProvider>
    );
  }

  it('hiển thị “Tổng thời lượng: 5 phút 37 giây” với playlist s1 và s2', () => {
    renderDetail('/playlists/pl-run');

    expect(screen.getByText('Chạy bộ')).toBeInTheDocument();
    expect(
      screen.getByText('Tổng thời lượng: 5 phút 37 giây')
    ).toBeInTheDocument();
    expect(screen.getByText('Mưa tháng Sáu 1')).toBeInTheDocument();
    expect(screen.getByText('Nắng tháng Sáu 1')).toBeInTheDocument();
  });

  it('bấm Phát tất cả phát từ bài đầu và hàng đợi có 2 bài', async () => {
    const user = userEvent.setup();
    renderDetail('/playlists/pl-run');

    const playAllBtn = screen.getByRole('button', { name: 'Phát tất cả' });
    await user.click(playAllBtn);

    const playerState = usePlayerStore.getState();
    expect(playerState.isPlaying).toBe(true);
    expect(playerState.queue.length).toBe(2);
    expect(playerState.queue[0].title).toBe('Mưa tháng Sáu 1');
  });

  it('bấm Bỏ để xóa bài hát khỏi playlist', async () => {
    const user = userEvent.setup();
    renderDetail('/playlists/pl-run');

    const removeButtons = screen.getAllByRole('button', { name: 'Bỏ' });
    await user.click(removeButtons[0]);

    // Sau khi bỏ s1 (150s), còn lại s2 (187s = 3 phút 7 giây)
    expect(screen.queryByText('Mưa tháng Sáu 1')).not.toBeInTheDocument();
    expect(
      screen.getByText('Tổng thời lượng: 3 phút 7 giây')
    ).toBeInTheDocument();
  });

  it('không tìm thấy playlist thì hiển thị “Không tìm thấy playlist”', () => {
    renderDetail('/playlists/unknown-id');
    expect(screen.getByText('Không tìm thấy playlist')).toBeInTheDocument();
  });
});

