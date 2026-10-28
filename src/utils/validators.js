/**
 * 글자수·해시태그·이미지 장수 및 비율 검사 도구
 */
import { getAspectRatioInfo } from './imageUtils.js';

/** 글자 수 (이모지도 1자로 계산) */
export const countChars = (text = '') => [...text].length;

/** 해시태그 개수 */
export const countHashtags = (text = '') => (text.match(/#[^\s#]+/g) || []).length;

/** 값과 한도를 비교해 상태 반환: 'ok' | 'warn' (90% 이상) | 'over' */
export const getLimitStatus = (value, max) => {
  if (max == null) return 'ok';
  if (value > max) return 'over';
  if (value >= max * 0.9) return 'warn';
  return 'ok';
};

/** 플랫폼별 이미지 비율 적합성 검사 */
export function checkImageRatio(platform, width, height) {
  const info = getAspectRatioInfo(width, height);
  if (!width || !height) return { valid: true, info };

  if (platform === 'ig') {
    // 인스타: 4:5 권장, 1:1도 허용
    const isRecommended = info.isFourFive;
    const isAcceptable = info.isSquare || info.isFourFive;
    return {
      valid: isAcceptable,
      isRecommended,
      message: isRecommended
        ? '권장 비율 (4:5)'
        : info.isSquare
        ? '허용 비율 (1:1)'
        : `권장 4:5 아님 (${info.ratioStr})`,
      info,
    };
  }

  if (platform === 'yt') {
    // 유튜브: 1:1 권장
    const isRecommended = info.isSquare;
    return {
      valid: isRecommended,
      isRecommended,
      message: isRecommended ? '권장 비율 (1:1)' : `권장 1:1 아님 (${info.ratioStr})`,
      info,
    };
  }

  return { valid: true, isRecommended: true, message: '', info };
}

/** 비디오 파일 용량 검증 (기본 50MB 제한) */
export function validateVideoFile(file, maxSizeMB = 50) {
  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      message: `'${file.name}' 파일(${fileSizeMB}MB)이 권장 용량(${maxSizeMB}MB)을 초과했습니다.`,
    };
  }
  return { valid: true, message: '' };
}
