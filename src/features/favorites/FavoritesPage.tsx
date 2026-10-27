import React from 'react';

export const FavoritesPage: React.FC = () => {
  return (
    <div className="favorites-page">
      <h1>Bài hát yêu thích</h1>
      <p className="empty-message">Bạn chưa có bài hát yêu thích.</p>
    </div>
  );
};

export default FavoritesPage;

