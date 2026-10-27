import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('Khung ứng dụng và Routing', () => {
  it('hiển thị thanh menu gồm Thư viện, Yêu thích, Playlist với mục Thư viện mặc định được tô sáng', () => {
    render(<App />);

    const libLink = screen.getByRole('link', { name: 'Thư viện' });
    const favLink = screen.getByRole('link', { name: 'Yêu thích' });
    const playlistLink = screen.getByRole('link', { name: 'Playlist' });

    expect(libLink).toBeInTheDocument();
    expect(favLink).toBeInTheDocument();
    expect(playlistLink).toBeInTheDocument();

    // Mục đang xem được tô sáng (có class active)
    expect(libLink).toHaveClass('active');
    expect(favLink).not.toHaveClass('active');
    expect(playlistLink).not.toHaveClass('active');
  });

  it('chuyển hướng sang Yêu thích và tô sáng mục Yêu thích', async () => {
    const user = userEvent.setup();
    render(<App />);

    const favLink = screen.getByRole('link', { name: 'Yêu thích' });
    await user.click(favLink);

    expect(favLink).toHaveClass('active');
    expect(await screen.findByText('Bài hát yêu thích')).toBeInTheDocument();
  });

  it('chuyển hướng sang Playlist và tô sáng mục Playlist', async () => {
    const user = userEvent.setup();
    render(<App />);

    const playlistLink = screen.getByRole('link', { name: 'Playlist' });
    await user.click(playlistLink);

    expect(playlistLink).toHaveClass('active');
    expect(await screen.findByText('Danh sách Playlist')).toBeInTheDocument();
  });
});

