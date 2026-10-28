import { get, set, del } from 'idb-keyval';

const STORAGE_KEY = 'sns-contents-preview-data';

/**
 * DataURL(data:video/...) 문자열을 바이너리 Blob으로 변환 (이전 세션 호환용)
 */
async function dataUrlToBlob(dataUrl) {
  const res = await fetch(dataUrl);
  return res.blob();
}

/**
 * 미디어 배열을 IndexedDB 저장용으로 정규화 (비디오는 바이너리 Blob으로 안전하게 보관)
 */
async function normalizeMediaListForSave(items = []) {
  return Promise.all(
    items.map(async (item) => {
      if (item.type === 'video') {
        let blob = item.blob instanceof Blob ? item.blob : null;
        if (!blob && typeof item.src === 'string' && item.src.startsWith('data:')) {
          try {
            blob = await dataUrlToBlob(item.src);
          } catch {
            blob = null;
          }
        }
        return {
          ...item,
          blob,
          // ObjectURL은 새로고침 시 만료되므로 로드 시점에 blob으로부터 재생성
          src: blob ? '' : item.src,
        };
      }
      return item;
    })
  );
}

/**
 * IndexedDB에서 불러온 미디어 배열 복원 (비디오 Blob → 새 ObjectURL 발급)
 */
function hydrateMediaListFromStorage(items = []) {
  return items.map((item) => {
    if (item.type === 'video' && item.blob instanceof Blob) {
      return {
        ...item,
        src: URL.createObjectURL(item.blob),
      };
    }
    return item;
  });
}

/**
 * 에디터 작업 상태를 브라우저 IndexedDB에 비동기 저장
 */
export async function saveToStorage(data) {
  try {
    const payload = {
      ...data,
      ig: data.ig
        ? {
            ...data.ig,
            images: await normalizeMediaListForSave(data.ig.images),
          }
        : { text: '', images: [] },
      yt: data.yt
        ? {
            ...data.yt,
            images: await normalizeMediaListForSave(data.yt.images),
          }
        : { text: '', images: [] },
    };
    await set(STORAGE_KEY, payload);
    return true;
  } catch (err) {
    console.error('IndexedDB 저장 실패:', err);
    return false;
  }
}

/**
 * 브라우저 IndexedDB에 저장된 이전 작업 상태 불러오기
 */
export async function loadFromStorage() {
  try {
    const data = await get(STORAGE_KEY);
    if (!data) return null;

    return {
      ...data,
      ig: data.ig
        ? {
            ...data.ig,
            images: hydrateMediaListFromStorage(data.ig.images),
          }
        : { text: '', images: [] },
      yt: data.yt
        ? {
            ...data.yt,
            images: hydrateMediaListFromStorage(data.yt.images),
          }
        : { text: '', images: [] },
    };
  } catch (err) {
    console.error('IndexedDB 로드 실패:', err);
    return null;
  }
}

/**
 * 브라우저 IndexedDB에 저장된 작업 상태 삭제 (전체 초기화 시 호출)
 */
export async function clearStorage() {
  try {
    await del(STORAGE_KEY);
    return true;
  } catch (err) {
    console.error('IndexedDB 삭제 실패:', err);
    return false;
  }
}
