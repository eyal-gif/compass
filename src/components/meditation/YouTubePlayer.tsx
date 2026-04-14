import React from 'react';

interface YouTubePlayerProps {
  youtubeId: string;
  title?: string;
  className?: string;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  youtubeId,
  title = 'Meditation video',
  className = '',
}) => {
  return (
    <div
      className={[
        'relative w-full overflow-hidden rounded-2xl bg-charcoal',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ aspectRatio: '16 / 9' }}
    >
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        sandbox="allow-scripts allow-same-origin allow-presentation"
        allowFullScreen
        loading="lazy"
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
};

export default YouTubePlayer;
