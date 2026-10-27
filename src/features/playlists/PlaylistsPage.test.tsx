import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { PlaylistsPage } from './PlaylistsPage';
import { PlaylistProvider } from './PlaylistContext';
import { Playlist } from './playlistReducer';

// Viết hàm renderWithProviders bọc Provider và MemoryRouter theo yêu cầu
function renderWithProviders(
  ui: React.ReactElement,
  initialPlaylists: Playlist[] = []
) {
  return render(
    <PlaylistProvider initialPlaylists={initialPlaylists}>
      <MemoryRouter>{ui}</MemoryRouter>
    </PlaylistProvider>
  );
}

describe('PlaylistsPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('bấm Tạo khi ô trống thì thấy “Tên playlist không được để trống”', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PlaylistsPage />);

    const createBtn = screen.getByRole('button', { name: 'Tạo' });
    await user.click(createBtn);

    expect(
      screen.getByText('Tên playlist không được để trống')
    ).toBeInTheDocument();
  });

  it('nhập tên rồi bấm Tạo thì tên xuất hiện trong danh sách', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PlaylistsPage />);

    const input = screen.getByLabelText('Tên playlist');
    const createBtn = screen.getByRole('button', { name: 'Tạo' });

    await user.type(input, 'Nhạc Acoustic');
    await user.click(createBtn);

    expect(screen.getByText('Nhạc Acoustic')).toBeInTheDocument();
    expect(screen.getByText('0 bài')).toBeInTheDocument();
  });

  it('tạo playlist “Chạy bộ”, rồi tạo tiếp “chạy bộ” báo “Tên playlist đã tồn tại”', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PlaylistsPage />);

    const input = screen.getByLabelText('Tên playlist');
    const createBtn = screen.getByRole('button', { name: 'Tạo' });

    // Tạo lần 1: Chạy bộ
    await user.type(input, 'Chạy bộ');
    await user.click(createBtn);
    expect(screen.getByText('Chạy bộ')).toBeInTheDocument();

    // Tạo lần 2: chạy bộ (chữ thường)
    await user.type(input, 'chạy bộ');
    await user.click(createBtn);

    expect(screen.getByText('Tên playlist đã tồn tại')).toBeInTheDocument();
  });
});

