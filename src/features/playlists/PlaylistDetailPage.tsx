import React from 'react';
import { useParams } from 'react-router-dom';

export const PlaylistDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="playlist-detail-page">
      <h1>Chi tiết Playlist: {id}</h1>
    </div>
  );
};

export default PlaylistDetailPage;

