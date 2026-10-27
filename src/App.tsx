import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import LibraryPage from './features/library/LibraryPage';
import PlayerBar from './features/player/PlayerBar';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { PlaylistProvider } from './features/playlists/PlaylistContext';

// Lazy load theo route: 3 trang /favorites, /playlists, /playlists/:id dùng React.lazy
const FavoritesPage = lazy(() => import('./features/favorites/FavoritesPage'));
const PlaylistsPage = lazy(() => import('./features/playlists/PlaylistsPage'));
const PlaylistDetailPage = lazy(() => import('./features/playlists/PlaylistDetailPage'));

export const AppContent: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-brand">
          <span className="brand-icon">🎵</span>
          <h1>Music Stream</h1>
        </div>

        {/* Thanh menu gồm Thư viện, Yêu thích, Playlist (NavLink, mục đang xem được tô sáng) */}
        <nav className="app-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? 'nav-item active' : 'nav-item'
            }
          >
            Thư viện
          </NavLink>
          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              isActive ? 'nav-item active' : 'nav-item'
            }
          >
            Yêu thích
          </NavLink>
          <NavLink
            to="/playlists"
            className={({ isActive }) =>
              isActive ? 'nav-item active' : 'nav-item'
            }
          >
            Playlist
          </NavLink>

          {/* Nút Giao diện tối/Giao diện sáng trên thanh menu */}
          <button
            type="button"
            className="btn-theme-toggle"
            onClick={toggleTheme}
            aria-label="Đổi giao diện"
          >
            {theme === 'light' ? 'Giao diện tối' : 'Giao diện sáng'}
          </button>
        </nav>
      </header>

      <main className="app-main">
        <Suspense fallback={<p>Đang tải trang...</p>}>
          <Routes>
            <Route path="/" element={<LibraryPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/playlists" element={<PlaylistsPage />} />
            <Route path="/playlists/:id" element={<PlaylistDetailPage />} />
          </Routes>
        </Suspense>
      </main>

      {/* Thanh phát nhạc (PlayerBar) cố định ở đáy mọi trang */}
      <PlayerBar />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <PlaylistProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </PlaylistProvider>
    </ThemeProvider>
  );
};

export default App;
