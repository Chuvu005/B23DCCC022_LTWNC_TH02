import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { LibraryPage } from './LibraryPage';

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
});

