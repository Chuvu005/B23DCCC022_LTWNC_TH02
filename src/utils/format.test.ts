import { describe, it, expect } from 'vitest';
import { formatDuration, formatDurationVietnamese } from './format';

describe('formatDuration', () => {
  it('định dạng đúng các mốc thời gian 0, 65, 300 giây', () => {
    expect(formatDuration(0)).toBe('0:00');
    expect(formatDuration(65)).toBe('1:05');
    expect(formatDuration(300)).toBe('5:00');
  });

  it('định dạng tiếng Việt formatDurationVietnamese', () => {
    expect(formatDurationVietnamese(0)).toBe('0 phút 0 giây');
    expect(formatDurationVietnamese(65)).toBe('1 phút 5 giây');
    expect(formatDurationVietnamese(337)).toBe('5 phút 37 giây');
  });
});
