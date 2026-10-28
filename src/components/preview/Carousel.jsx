import { useEffect, useRef, useState } from 'react';
import { IconPlay, IconVolumeMute, IconVolumeOn } from '../common/Icons';

/**
 * 개별 비디오 슬라이드
 * - 현재 활성 슬라이드일 때 자동 재생(무음 반복), 다른 슬라이드로 넘어가면 일시정지
 * - 화면 클릭 시 재생/일시정지 토글, 우측 하단 버튼으로 음소거 해제/적용
 */
function VideoSlide({ item, isActive, isMuted, onToggleMute }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [isActive, item.src]);

  const handleTogglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="pv-slide pv-slide--video" onClick={handleTogglePlay}>
      <video
        ref={videoRef}
        src={item.src}
        poster={item.thumbnail || undefined}
        muted={isMuted}
        loop
        playsInline
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {!isPlaying && (
        <span className="pv-video-play-btn" aria-hidden="true">
          <IconPlay size={26} />
        </span>
      )}

      <button
        type="button"
        className="pv-video-mute-btn"
        onClick={(e) => {
          e.stopPropagation();
          onToggleMute();
        }}
        aria-label={isMuted ? '소리 켜기' : '음소거'}
        title={isMuted ? '소리 켜기' : '음소거'}
      >
        {isMuted ? <IconVolumeMute size={15} /> : <IconVolumeOn size={15} />}
      </button>
    </div>
  );
}

/**
 * 미디어 캐러셀 (인스타·유튜브 공통)
 * - 위치 상태는 useCarousel 훅에서 받아옴 (카드에서 점 표시와 공유하기 위해)
 * - 전체 비율은 첫 번째 미디어 기준 (실제 인스타그램과 동일)
 */
export default function Carousel({ images, carousel, aspect, emptyLabel }) {
  const { index, count, prev, next, touchHandlers } = carousel;
  const [isMuted, setIsMuted] = useState(true);

  if (!count) {
    return (
      <div className="pv-carousel pv-carousel--empty" style={{ aspectRatio: aspect }}>
        <span>{emptyLabel}</span>
      </div>
    );
  }

  const first = images[0];
  const ratio = first.width && first.height ? first.width / first.height : aspect;

  return (
    <div className="pv-carousel" style={{ aspectRatio: ratio }} {...touchHandlers}>
      <div className="pv-track" style={{ transform: `translateX(-${index * 100}%)` }}>
        {images.map((item, i) =>
          item.type === 'video' ? (
            <VideoSlide
              key={item.id}
              item={item}
              isActive={i === index}
              isMuted={isMuted}
              onToggleMute={() => setIsMuted((prevMuted) => !prevMuted)}
            />
          ) : (
            <div key={item.id} className="pv-slide">
              <img
                src={item.src}
                alt={`${i + 1}번째 이미지`}
                draggable={false}
              />
            </div>
          )
        )}
      </div>

      {count > 1 && (
        <span className="pv-count">
          {index + 1}/{count}
        </span>
      )}
      {index > 0 && (
        <button type="button" className="pv-nav pv-nav--prev" onClick={prev} aria-label="이전 슬라이드">
          ‹
        </button>
      )}
      {index < count - 1 && (
        <button type="button" className="pv-nav pv-nav--next" onClick={next} aria-label="다음 슬라이드">
          ›
        </button>
      )}
    </div>
  );
}
