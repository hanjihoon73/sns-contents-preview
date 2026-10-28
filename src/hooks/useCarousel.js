import { useCallback, useRef, useState } from 'react';

const SWIPE_THRESHOLD = 40; // 이 거리(px) 이상 밀어야 넘어감

/** 캐러셀 현재 위치와 화살표·스와이프 조작 */
export default function useCarousel(count) {
  const [rawIndex, setIndex] = useState(0);
  const touchX = useRef(null);

  // 이미지가 삭제되어 개수가 줄어도 범위를 벗어나지 않도록 보정
  const index = Math.min(rawIndex, Math.max(count - 1, 0));

  const go = useCallback((n) => setIndex(Math.max(0, Math.min(count - 1, n))), [count]);

  const touchHandlers = {
    onTouchStart: (e) => {
      touchX.current = e.touches[0].clientX;
    },
    onTouchEnd: (e) => {
      if (touchX.current === null) return;
      const dx = e.changedTouches[0].clientX - touchX.current;
      if (Math.abs(dx) > SWIPE_THRESHOLD) go(index + (dx < 0 ? 1 : -1));
      touchX.current = null;
    },
  };

  return {
    index,
    count,
    prev: () => go(index - 1),
    next: () => go(index + 1),
    touchHandlers,
  };
}
