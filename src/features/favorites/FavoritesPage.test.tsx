import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FavoritesPage } from './FavoritesPage';
import { useFavoritesStore } from './useFavoritesStore';
import { usePlayerStore, initialPlayerState } from '../player/usePlayerStore';

describe('FavoritesPage', () => {
  beforeEach(() => {
    localStorage.clear();
    useFavoritesStore.setState({ ids: [] });
    usePlayerStore.setState(initialPlayerState);
  });

  it('chưa có bài nào hiển thị "Bạn chưa có bài hát yêu thích."', () => {
    render(<FavoritesPage />);
    expect(screen.getByText('Bạn chưa có bài hát yêu thích.')).toBeInTheDocument();
    expect(screen.queryByText('Phát tất cả')).not.toBeInTheDocument();
  });

  it('liệt kê các bài đã thích và bấm "Phát tất cả"', async () => {
    const user = userEvent.setup();
    useFavoritesStore.setState({ ids: ['s1', 's3'] });

    render(<FavoritesPage />);

    // Kiểm tra hiển thị 2 bài s1 và s3
    expect(screen.getByText('Mưa tháng Sáu 1')).toBeInTheDocument();
    expect(screen.getByText('Biển bình yên 1')).toBeInTheDocument();

    const playAllBtn = screen.getByRole('button', { name: 'Phát tất cả' });
    expect(playAllBtn).toBeInTheDocument();

    await user.click(playAllBtn);

    const playerState = usePlayerStore.getState();
    expect(playerState.isPlaying).toBe(true);
    expect(playerState.currentIndex).toBe(0);
    expect(playerState.queue.length).toBe(2);
    expect(playerState.queue[0].id).toBe('s1');
  });

  it('bấm bỏ yêu thích thì bài hát biến mất khỏi danh sách', async () => {
    const user = userEvent.setup();
    useFavoritesStore.setState({ ids: ['s1'] });

    render(<FavoritesPage />);
    expect(screen.getByText('Mưa tháng Sáu 1')).toBeInTheDocument();

    const unfavoriteBtn = screen.getByRole('button', { name: 'Bỏ yêu thích' });
    await user.click(unfavoriteBtn);

    expect(screen.queryByText('Mưa tháng Sáu 1')).not.toBeInTheDocument();
    expect(screen.getByText('Bạn chưa có bài hát yêu thích.')).toBeInTheDocument();
  });
});

