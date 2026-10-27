import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { LibraryPage } from './LibraryPage';
import { usePlayerStore, initialPlayerState } from '../player/usePlayerStore';

describe('LibraryPage - Tự kiểm tra Phần 1', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('khởi tạo hiển thị "Tìm thấy 10000 bài hát"', () => {
    render(<LibraryPage />);
    expect(screen.getByText('Tìm thấy 10000 bài hát')).toBeInTheDocument();
  });

  it('gõ "mưa": trong lúc gõ danh sách chưa đổi; 300ms sau hiển thị "Tìm thấy 1250 bài hát"', () => {
    render(<LibraryPage />);

    const searchInput = screen.getByLabelText('Tìm kiếm');
    fireEvent.change(searchInput, { target: { value: 'mưa' } });

    // Trong lúc gõ (chưa hết 300ms), danh sách chưa đổi
    expect(screen.getByText('Tìm thấy 10000 bài hát')).toBeInTheDocument();

    // 300ms sau
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByText('Tìm thấy 1250 bài hát')).toBeInTheDocument();
  });

  it('chọn thể loại Rock khi đang tìm "mưa" hiển thị "Tìm thấy 250 bài hát"', () => {
    render(<LibraryPage />);

    const searchInput = screen.getByLabelText('Tìm kiếm');
    fireEvent.change(searchInput, { target: { value: 'mưa' } });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.getByText('Tìm thấy 1250 bài hát')).toBeInTheDocument();

    const genreSelect = screen.getByLabelText('Thể loại');
    fireEvent.change(genreSelect, { target: { value: 'Rock' } });

    expect(screen.getByText('Tìm thấy 250 bài hát')).toBeInTheDocument();
  });

  it('xóa ô tìm kiếm, chọn Tất cả, gõ "thu hà" hiển thị "Tìm thấy 1000 bài hát"', () => {
    render(<LibraryPage />);

    const searchInput = screen.getByLabelText('Tìm kiếm');
    fireEvent.change(searchInput, { target: { value: 'thu hà' } });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByText('Tìm thấy 1000 bài hát')).toBeInTheDocument();
  });

  it('gõ "xyz" hiển thị "Không tìm thấy bài hát nào"', () => {
    render(<LibraryPage />);

    const searchInput = screen.getByLabelText('Tìm kiếm');
    fireEvent.change(searchInput, { target: { value: 'xyz' } });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByText('Không tìm thấy bài hát nào')).toBeInTheDocument();
  });

  it('sắp xếp Tên A–Z, dòng đầu tiên là "Biển bình yên 1"', () => {
    render(<LibraryPage />);

    const sortSelect = screen.getByLabelText('Sắp xếp');
    fireEvent.change(sortSelect, { target: { value: 'name-asc' } });

    // Dòng đầu tiên trong danh sách ảo hóa sẽ là Biển bình yên 1
    expect(screen.getByText('Biển bình yên 1')).toBeInTheDocument();
  });

  it('gõ "mưa", bấm Phát ở dòng đầu, bấm Sau: bài tiếp theo vẫn là một bài có chữ "Mưa"', () => {
    render(<LibraryPage />);

    const searchInput = screen.getByLabelText('Tìm kiếm');
    fireEvent.change(searchInput, { target: { value: 'mưa' } });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Bấm Phát ở dòng đầu tiên
    const playButtons = screen.getAllByRole('button', { name: 'Phát' });
    fireEvent.click(playButtons[0]);

    const playerStore = usePlayerStore.getState();
    expect(playerStore.isPlaying).toBe(true);
    expect(playerStore.queue.length).toBe(1250);
    expect(playerStore.queue[playerStore.currentIndex].title).toContain('Mưa');

    // Bấm Sau
    playerStore.next();
    const updatedStore = usePlayerStore.getState();
    expect(updatedStore.queue[updatedStore.currentIndex].title).toContain('Mưa');
  });

  it('bấm + Hàng đợi thêm bài vào hàng đợi', () => {
    usePlayerStore.setState(initialPlayerState);
    render(<LibraryPage />);

    const queueButtons = screen.getAllByRole('button', { name: '+ Hàng đợi' });
    fireEvent.click(queueButtons[0]);

    expect(usePlayerStore.getState().queue.length).toBe(1);
  });

  it('chọn playlist và bấm + Playlist thêm bài hát vào playlist', () => {
    const handleAddToPlaylist = vi.fn();
    const mockPlaylists = [{ id: 'pl-run', name: 'Chạy bộ' }];

    render(
      <LibraryPage
        playlists={mockPlaylists}
        selectedPlaylistId="pl-run"
        onAddToPlaylist={handleAddToPlaylist}
      />
    );

    const addPlaylistBtns = screen.getAllByRole('button', { name: '+ Playlist' });
    expect(addPlaylistBtns[0]).not.toBeDisabled();

    fireEvent.click(addPlaylistBtns[0]);
    expect(handleAddToPlaylist).toHaveBeenCalledTimes(1);
    expect(handleAddToPlaylist).toHaveBeenCalledWith(
      expect.objectContaining({ id: 's1' })
    );
  });
});

