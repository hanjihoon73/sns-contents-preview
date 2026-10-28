/**
 * 이미지 처리 유틸리티
 */
export const createId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `img-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

/** 이미지 주소(src) → { id, src, name, width, height } */
export function loadImageFromUrl(src, name = '') {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () =>
      resolve({
        id: createId(),
        src,
        name: name || src.split('/').pop(),
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    img.onerror = () => reject(new Error(`이미지를 불러오지 못했어요: ${name || src}`));
    img.src = src;
  });
}

/** File 객체 → Data URL & 크기 정보 객체 */
export function readFileAsImageData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target.result;
      const img = new Image();
      img.onload = () => {
        resolve({
          id: createId(),
          src,
          name: file.name,
          width: img.naturalWidth,
          height: img.naturalHeight,
          size: file.size,
        });
      };
      img.onerror = () => reject(new Error(`이미지 로드에 실패했습니다: ${file.name}`));
      img.src = src;
    };
    reader.onerror = () => reject(new Error(`파일을 읽지 못했습니다: ${file.name}`));
    reader.readAsDataURL(file);
  });
}

/** 이미지 비율 계산 및 분석 (허용 오차 3% 고려) */
export function getAspectRatioInfo(width, height) {
  if (!width || !height) return { ratioStr: '알 수 없음', isSquare: false, isFourFive: false };
  const ratio = width / height;

  const isSquare = Math.abs(ratio - 1) < 0.04; // 1:1
  const isFourFive = Math.abs(ratio - 0.8) < 0.04; // 4:5 (0.8)

  let ratioStr = `${width}:${height}`;
  if (isSquare) ratioStr = '1:1';
  else if (isFourFive) ratioStr = '4:5';
  else if (Math.abs(ratio - 16 / 9) < 0.05) ratioStr = '16:9';
  else if (Math.abs(ratio - 9 / 16) < 0.05) ratioStr = '9:16';
  else {
    ratioStr = `${(ratio).toFixed(2)}:1`;
  }

  return {
    ratio,
    ratioStr,
    isSquare,
    isFourFive,
  };
}

/**
 * 프로필 이미지를 1:1 원형 규격에 맞게 자동으로 최적 크롭/맞춤 처리
 * - 가로형/세로형 로고인 경우: 원형 테두리 밖으로 글자가 잘리지 않도록 안전 여백을 포함하여 중앙 배치
 * - 일반 정사각 사진인 경우: 중앙 1:1 정사각형으로 크롭
 */
export function autoCropProfileImage(file, targetSize = 400) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = targetSize;
        canvas.height = targetSize;
        const ctx = canvas.getContext('2d');

        const nw = img.naturalWidth;
        const nh = img.naturalHeight;
        const ratio = nw / nh;

        // 투명 배경 지원 (배경은 깔끔하게 유지)
        ctx.clearRect(0, 0, targetSize, targetSize);

        // 직사각형(로고 등: 가로세로 차이가 15% 이상)인 경우
        // 원형 마스크 안에 로고 전체가 안전하게 들어가도록 패딩(지름 고려 80% 크기) 적용
        if (ratio > 1.15 || ratio < 0.85) {
          const safeZoneSize = targetSize * 0.78; // 원형 안 안전 영역
          let drawW, drawH;
          if (ratio >= 1) {
            drawW = safeZoneSize;
            drawH = safeZoneSize / ratio;
          } else {
            drawH = safeZoneSize;
            drawW = safeZoneSize * ratio;
          }
          const dx = (targetSize - drawW) / 2;
          const dy = (targetSize - drawH) / 2;
          ctx.drawImage(img, dx, dy, drawW, drawH);
        } else {
          // 정사각에 가까운 경우: 중앙 1:1 센터 크롭
          const minSide = Math.min(nw, nh);
          const sx = (nw - minSide) / 2;
          const sy = (nh - minSide) / 2;
          ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, targetSize, targetSize);
        }

        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => reject(new Error('이미지를 읽을 수 없습니다.'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('파일 읽기 실패'));
    reader.readAsDataURL(file);
  });
}
