/**
 * 이미지 캐러셀 (인스타·유튜브 공통)
 * - 위치 상태는 useCarousel 훅에서 받아옴 (카드에서 점 표시와 공유하기 위해)
 * - 전체 비율은 첫 번째 이미지 기준 (실제 인스타그램과 동일)
 */
export default function Carousel({ images, carousel, aspect, emptyLabel }) {
  const { index, count, prev, next, touchHandlers } = carousel;

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
        {images.map((img, i) => (
          <img key={img.id} src={img.src} alt={`${i + 1}번째 이미지`} draggable={false} />
        ))}
      </div>

      {count > 1 && (
        <span className="pv-count">
          {index + 1}/{count}
        </span>
      )}
      {index > 0 && (
        <button type="button" className="pv-nav pv-nav--prev" onClick={prev} aria-label="이전 이미지">
          ‹
        </button>
      )}
      {index < count - 1 && (
        <button type="button" className="pv-nav pv-nav--next" onClick={next} aria-label="다음 이미지">
          ›
        </button>
      )}
    </div>
  );
}
