
import React, { memo, useState, useRef, useEffect } from 'react';
import { VideoMaterial } from '../types';

interface VideoCardProps {
  video: VideoMaterial;
  onClick: (video: VideoMaterial) => void;
}

const VideoCard: React.FC<VideoCardProps> = memo(({ video, onClick }) => {
  const [videoError, setVideoError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Debounce loading: only set isInView if it stays in view for 150ms
          loadTimeoutRef.current = setTimeout(() => {
            setIsInView(true);
          }, 150);
        } else {
          if (loadTimeoutRef.current) {
            clearTimeout(loadTimeoutRef.current);
          }
          setIsInView(false);
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '100px' 
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (videoRef.current && !videoError) {
      if (isHovered || isInView) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
        // Use a small offset to ensure the first frame is visible
        if (videoRef.current.readyState >= 2) {
          videoRef.current.currentTime = 0.1;
        }
      }
    }
  }, [isHovered, isInView, videoError]);

  return (
    <div 
      ref={containerRef}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-slate-100 flex flex-col h-full transform-gpu"
      onClick={() => onClick(video)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden group bg-slate-100">
        {!videoError ? (
          <video 
            ref={videoRef}
            src={isInView || isHovered ? `${video.videoUrl}#t=0.1` : undefined} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            preload={isInView || isHovered ? "metadata" : "none"}
            muted
            loop
            playsInline
            onError={() => setVideoError(true)}
          />
        ) : (
          <img 
            src={video.cover} 
            alt={video.id} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
          <div className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50">
            <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          <span className="bg-indigo-600/90 text-white text-[10px] px-2 py-0.5 rounded-full font-medium backdrop-blur-sm">
            {video.month}
          </span>
          <span className="bg-slate-800/90 text-white text-[10px] px-2 py-0.5 rounded-full font-medium backdrop-blur-sm">
            {video.category}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
          <p className="text-white text-xs font-medium truncate">{video.type}</p>
        </div>
      </div>
      <div className="p-4 flex-1">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {video.sellingPoints.slice(0, 3).map((point, idx) => (
            <span key={idx} className="bg-indigo-50 text-indigo-700 text-[11px] px-2 py-0.5 rounded border border-indigo-100">
              {point}
            </span>
          ))}
          {video.sellingPoints.length > 3 && (
            <span className="text-slate-400 text-[11px] self-center">...</span>
          )}
        </div>
        <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
          {video.hookAnalysis}
        </p>
      </div>
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
        <span className="text-slate-400 text-[10px] font-mono uppercase">{video.id}</span>
        <button className="text-indigo-600 text-xs font-semibold hover:text-indigo-800 flex items-center gap-1">
          查看详情
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
});

export default VideoCard;
