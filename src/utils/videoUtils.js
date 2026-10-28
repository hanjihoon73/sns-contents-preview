/**
 * 동영상(MP4/MOV) 메타데이터 추출 및 썸네일 캡처 유틸리티
 */
import { createId } from './imageUtils';

/** 초 단위 재생시간을 '분:초' (예: 0:15) 포맷으로 변환 */
export function formatDuration(seconds = 0) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const totalSec = Math.round(seconds);
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

/** 파일이 지원하는 비디오 형식인지 확인 */
export function isVideoFile(file) {
  if (!file) return false;
  if (file.type && file.type.startsWith('video/')) return true;
  return /\.(mp4|mov|m4v|webm)$/i.test(file.name || '');
}

/**
 * 브라우저 인메모리 <video>와 <canvas>를 이용해
 * 비디오 가로/세로/재생시간 및 첫 프레임(0.1초) JPEG 썸네일을 추출합니다.
 */
export function extractVideoMetadataAndThumbnail(file, maxThumbSize = 600) {
  return new Promise((resolve, reject) => {
    const blobUrl = URL.createObjectURL(file);
    const video = document.createElement('video');
    let settled = false;

    const cleanup = () => {
      video.removeAttribute('src');
      video.load();
      URL.revokeObjectURL(blobUrl);
    };

    const finish = (result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutId);
      cleanup();
      resolve(result);
    };

    const fail = (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutId);
      cleanup();
      reject(err);
    };

    // 코덱 이슈 등으로 seeked 이벤트가 지연될 경우 대비 안전 타이머
    const timeoutId = setTimeout(() => {
      finish({
        width: video.videoWidth || 1080,
        height: video.videoHeight || 1350,
        duration: Number.isFinite(video.duration) ? video.duration : 0,
        thumbnail: '',
      });
    }, 4000);

    video.preload = 'auto';
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = 'anonymous';

    const captureFrame = () => {
      try {
        const vw = video.videoWidth || 1080;
        const vh = video.videoHeight || 1350;
        const scale = Math.min(1, maxThumbSize / Math.max(vw, vh));
        const cw = Math.max(1, Math.round(vw * scale));
        const ch = Math.max(1, Math.round(vh * scale));

        const canvas = document.createElement('canvas');
        canvas.width = cw;
        canvas.height = ch;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, cw, ch);
        const thumbnail = canvas.toDataURL('image/jpeg', 0.85);

        finish({
          width: vw,
          height: vh,
          duration: Number.isFinite(video.duration) ? video.duration : 0,
          thumbnail,
        });
      } catch {
        finish({
          width: video.videoWidth || 1080,
          height: video.videoHeight || 1350,
          duration: Number.isFinite(video.duration) ? video.duration : 0,
          thumbnail: '',
        });
      }
    };

    video.onloadedmetadata = () => {
      const targetTime =
        Number.isFinite(video.duration) && video.duration > 0.2 ? 0.1 : 0;
      if (targetTime > 0) {
        video.currentTime = targetTime;
      }
    };

    video.onloadeddata = () => {
      if (video.currentTime === 0) {
        captureFrame();
      }
    };

    video.onseeked = () => {
      captureFrame();
    };

    video.onerror = () => {
      fail(new Error(`동영상 메타데이터를 읽을 수 없습니다: ${file.name}`));
    };

    video.src = blobUrl;
  });
}

/**
 * 비디오 File 객체 → 표준 미디어 아이템 객체
 * - 대용량 비디오를 Base64 문자열 대신 원본 Blob(File)과 ObjectURL로 관리하여
 *   메모리 사용량을 최소화하고 IndexedDB에 바이너리(Blob)로 고속 저장합니다.
 */
export async function readFileAsVideoData(file) {
  const meta = await extractVideoMetadataAndThumbnail(file);
  const blobObj = new Blob([file], { type: file.type || 'video/mp4' });
  const src = URL.createObjectURL(blobObj);

  return {
    id: createId(),
    src,
    blob: blobObj,
    type: 'video',
    name: file.name,
    width: meta.width,
    height: meta.height,
    duration: meta.duration,
    thumbnail: meta.thumbnail,
    size: file.size,
  };
}

