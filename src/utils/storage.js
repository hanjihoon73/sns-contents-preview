import { get, set, del } from 'idb-keyval';

const STORAGE_KEY = 'sns-contents-preview-data';

/**
 * 에디터 작업 상태를 브라우저 IndexedDB에 비동기 저장
 */
export async function saveToStorage(data) {
  try {
    await set(STORAGE_KEY, data);
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
    return data || null;
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
