import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('đổi giá trị, trước 300ms vẫn là giá trị cũ, sau vi.advanceTimersByTime(300) là giá trị mới', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) =>
        useDebounce(value, delay),
      {
        initialProps: { value: 'mưa', delay: 300 },
      }
    );

    expect(result.current).toBe('mưa');

    // Cập nhật giá trị mới
    rerender({ value: 'mưa tháng sáu', delay: 300 });

    // Trước 300ms (ví dụ 150ms) vẫn là giá trị cũ
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe('mưa');

    // Sau khi đủ 300ms (thêm 150ms nữa)
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe('mưa tháng sáu');
  });
});

