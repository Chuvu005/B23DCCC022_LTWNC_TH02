import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from './ThemeContext';

const TestThemeComponent: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <button onClick={toggleTheme}>
        {theme === 'light' ? 'Giao diện tối' : 'Giao diện sáng'}
      </button>
    </div>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('khởi tạo với theme light và chuyển sang dark khi bấm toggle', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <TestThemeComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    expect(screen.getByRole('button', { name: 'Giao diện tối' })).toBeInTheDocument();
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    // Bấm nút đổi theme
    await user.click(screen.getByRole('button', { name: 'Giao diện tối' }));

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    expect(screen.getByRole('button', { name: 'Giao diện sáng' })).toBeInTheDocument();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('music-app-theme')).toBe('dark');
  });

  it('báo lỗi khi useTheme được gọi ngoài ThemeProvider', () => {
    // Suppress console.error for expected thrown error
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<TestThemeComponent />)).toThrow(
      'useTheme phải được sử dụng bên trong ThemeProvider'
    );

    spy.mockRestore();
  });
});
