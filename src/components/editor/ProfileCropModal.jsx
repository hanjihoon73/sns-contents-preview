import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Button from '../common/Button';

const VIEWPORT_SIZE = 240; // 프리뷰 캔버스 지름/크기 (px)
const OUTPUT_SIZE = 400; // 최종 저장 고해상도 아바타 크기 (px)

/**
 * 프로필 사진 실시간 캔버스 크롭 모달
 * - 프리뷰 캔버스와 저장 캔버스가 100% 일치하도록 단일 렌더러 사용
 */
export default function ProfileCropModal({ isOpen, rawImageSrc, onConfirm, onCancel }) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const canvasRef = useRef(null);
  const loadedImgRef = useRef(null);

  // 이미지 캔버스에 그리기 함수 (실시간 프리뷰 & 출력 공용)
  const drawImageToCanvas = useCallback(
    (canvas, size, pos, z) => {
      const img = loadedImgRef.current;
      if (!canvas || !img) return;

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, size, size);

      const nw = img.naturalWidth;
      const nh = img.naturalHeight;
      const scaleToOutput = size / VIEWPORT_SIZE;

      // 이미지 전체가 뷰포트 안에 들어오는 기본 피팅 비율
      const baseFit = Math.min(VIEWPORT_SIZE / nw, VIEWPORT_SIZE / nh);

      const drawW = nw * baseFit * z * scaleToOutput;
      const drawH = nh * baseFit * z * scaleToOutput;

      const centerX = size / 2 + pos.x * scaleToOutput;
      const centerY = size / 2 + pos.y * scaleToOutput;

      ctx.drawImage(img, centerX - drawW / 2, centerY - drawH / 2, drawW, drawH);
    },
    []
  );

  // 원본 이미지 로드 및 초기 위치/배율 계산
  useEffect(() => {
    if (!isOpen || !rawImageSrc) return;
    const img = new Image();
    img.onload = () => {
      loadedImgRef.current = img;
      const nw = img.naturalWidth;
      const nh = img.naturalHeight;
      const ratio = nw / nh;

      // 직사각형 로고는 전체가 원형 안에 쏙 들어가도록 기본 0.8x 줌으로 설정
      const initialZoom = ratio > 1.2 || ratio < 0.8 ? 0.8 : 1;
      const initialPos = { x: 0, y: 0 };

      setZoom(initialZoom);
      setPosition(initialPos);

      if (canvasRef.current) {
        drawImageToCanvas(canvasRef.current, VIEWPORT_SIZE, initialPos, initialZoom);
      }
    };
    img.src = rawImageSrc;
  }, [isOpen, rawImageSrc, drawImageToCanvas]);

  // zoom 또는 position 변경 시 프리뷰 캔버스 즉각 갱신
  useEffect(() => {
    if (canvasRef.current && loadedImgRef.current) {
      drawImageToCanvas(canvasRef.current, VIEWPORT_SIZE, position, zoom);
    }
  }, [zoom, position, drawImageToCanvas]);

  if (!isOpen || !rawImageSrc) return null;

  /* ----- 마우스 드래그 이벤트 ----- */
  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  /* ----- 모바일 터치 이벤트 ----- */
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStart.current = {
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      };
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPosition({
      x: e.touches[0].clientX - dragStart.current.x,
      y: e.touches[0].clientY - dragStart.current.y,
    });
  };

  /* ----- 프리셋 버튼 ----- */
  const handleFitContain = () => {
    setZoom(0.8);
    setPosition({ x: 0, y: 0 });
  };

  const handleFitCover = () => {
    setZoom(1.3);
    setPosition({ x: 0, y: 0 });
  };

  /* ----- 최종 자르기 적용 (눈에 보이는 그대로 고해상도 추출) ----- */
  const handleApply = () => {
    if (!loadedImgRef.current) return;

    const outCanvas = document.createElement('canvas');
    outCanvas.width = OUTPUT_SIZE;
    outCanvas.height = OUTPUT_SIZE;

    // 프리뷰와 100% 동일한 수식으로 고해상도 렌더링
    drawImageToCanvas(outCanvas, OUTPUT_SIZE, position, zoom);

    const croppedDataUrl = outCanvas.toDataURL('image/png');
    onConfirm(croppedDataUrl);
  };

  return createPortal(
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="crop-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="crop-modal__title">프로필 이미지 위치 및 크기 조절</h3>
        <p className="crop-modal__desc">원 안에 표시될 영역을 마우스로 드래그하거나 확대/축소하세요.</p>

        {/* 실시간 캔버스 뷰포트 영역 */}
        <div
          className="crop-viewport"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          <canvas
            ref={canvasRef}
            width={VIEWPORT_SIZE}
            height={VIEWPORT_SIZE}
            className="crop-canvas"
          />

          {/* 원형 가이드라인 오버레이 */}
          <div className="crop-mask-circle" />
        </div>

        {/* 줌 조절 슬라이더 및 프리셋 */}
        <div className="crop-controls">
          <div className="crop-slider-row">
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>축소</span>
            <input
              type="range"
              min="0.3"
              max="2.5"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="crop-slider"
            />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>확대</span>
          </div>

          <div className="crop-presets">
            <Button onClick={handleFitContain} style={{ height: '30px', fontSize: '12px' }}>
              🔍 로고 전체 맞춤
            </Button>
            <Button onClick={handleFitCover} style={{ height: '30px', fontSize: '12px' }}>
              🎯 원형 꽉 채우기
            </Button>
          </div>
        </div>

        <div className="modal-card__actions" style={{ marginTop: '20px' }}>
          <Button onClick={onCancel}>취소</Button>
          <Button variant="primary" onClick={handleApply}>
            자르기 완료
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
