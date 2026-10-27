import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { PlayerBar } from './PlayerBar';
import { usePlayerStore, initialPlayerState } from './usePlayerStore';
import { Song } from '../../types';

describe('PlayerBar', () => {
  const mockSongs: Song[] = [
    {
      id: 's1',
      title: 'Mưa tháng Sáu 1',
      artist: 'Lê Minh',
      duration: 150, // 2:30
      genre: 'Pop',
    },
    {
      id: 's2',
      title: 'Nắng tháng Sáu 1',
      artist: 'Quang Huy',
      duration: 187, // 3:07
      genre: 'Ballad',
    },
  ];

  beforeEach(() => {
    vi.useFakeTimers();
    usePlayerStore.setState(initialPlayerState);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('khi chưa phát hiển thị "Chưa phát bài nào", "0:00 / 0:00", "Hàng đợi: 0 bài"', () => {
    render(<PlayerBar />);

    expect(screen.getByText('Chưa phát bài nào')).toBeInTheDocument();
    expect(screen.getByText('0:00 / 0:00')).toBeInTheDocument();
    expect(screen.getByText('Hàng đợi: 0 bài')).toBeInTheDocument();
  });

  it('Bấm Phát ở s1: Thanh dưới: “Đang phát: Mưa tháng Sáu 1 – Lê Minh”, “0:00 / 2:30”, sau 5 giây là “0:05 / 2:30”', () => {
    render(<PlayerBar />);

    act(() => {
      usePlayerStore.getState().playQueue(mockSongs, 0);
    });

    expect(
      screen.getByText('Đang phát: Mưa tháng Sáu 1 – Lê Minh')
    ).toBeInTheDocument();
    expect(screen.getByText('0:00 / 2:30')).toBeInTheDocument();
    expect(screen.getByText('Hàng đợi: 2 bài')).toBeInTheDocument();

    // Sau 5 giây
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByText('0:05 / 2:30')).toBeInTheDocument();
  });

  it('Bấm Tạm dừng, chờ 3 giây: Thời gian đứng yên; bấm Phát thì chạy tiếp', () => {
    render(<PlayerBar />);

    act(() => {
      usePlayerStore.getState().playQueue(mockSongs, 0);
    });

    // Chạy 2 giây
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByText('0:02 / 2:30')).toBeInTheDocument();

    // Bấm Tạm dừng
    const pauseBtn = screen.getByRole('button', { name: 'Tạm dừng' });
    fireEvent.click(pauseBtn);

    // Chờ 3 giây
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    // Thời gian vẫn đứng yên tại 0:02
    expect(screen.getByText('0:02 / 2:30')).toBeInTheDocument();

    // Bấm Phát lại
    const playBtn = screen.getByRole('button', { name: 'Phát' });
    fireEvent.click(playBtn);

    // Chờ thêm 2 giây
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByText('0:04 / 2:30')).toBeInTheDocument();
  });

  it('Bấm Sau: Chuyển sang “Nắng tháng Sáu 1 – Quang Huy”, thời gian về 0:00', () => {
    render(<PlayerBar />);

    act(() => {
      usePlayerStore.getState().playQueue(mockSongs, 0);
    });

    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(screen.getByText('0:04 / 2:30')).toBeInTheDocument();

    // Bấm Sau
    const nextBtn = screen.getByRole('button', { name: 'Sau' });
    fireEvent.click(nextBtn);

    expect(
      screen.getByText('Đang phát: Nắng tháng Sáu 1 – Quang Huy')
    ).toBeInTheDocument();
    expect(screen.getByText('0:00 / 3:07')).toBeInTheDocument();
  });
});

