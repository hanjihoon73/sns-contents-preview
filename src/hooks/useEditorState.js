import { useState, useCallback, useEffect, useRef } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { loadSample } from '../utils/sampleLoader';
import { saveToStorage, loadFromStorage, clearStorage } from '../utils/storage';

const DEFAULT_STATE = {
  profile: {
    name: '',
    avatar: null,
  },
  ig: {
    text: '',
    images: [],
  },
  yt: {
    text: '',
    images: [],
  },
};

/**
 * 에디터 핵심 상태 관리 및 IndexedDB 자동 저장 훅
 */
export default function useEditorState() {
  const [data, setData] = useState(DEFAULT_STATE);
  const [isInitialized, setIsInitialized] = useState(false);
  const isFirstMount = useRef(true);

  // 1. 초기 데이터 복원 (IndexedDB 확인 -> 없으면 샘플 로드)
  const initData = useCallback(async () => {
    try {
      const saved = await loadFromStorage();
      if (saved && (saved.profile || saved.ig || saved.yt)) {
        setData(saved);
      } else {
        const sample = await loadSample();
        setData(sample);
      }
    } catch {
      const sample = await loadSample();
      setData(sample);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // 2. 데이터 변경 시 500ms 디바운스로 IndexedDB 자동 저장
  useEffect(() => {
    if (!isInitialized) return;
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      saveToStorage(data);
    }, 500);

    return () => clearTimeout(timer);
  }, [data, isInitialized]);

  // 프로필 업데이트
  const updateProfile = useCallback((fields) => {
    setData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        ...fields,
      },
    }));
  }, []);

  // 플랫폼별 텍스트 업데이트
  const updateText = useCallback((platform, text) => {
    setData((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        text,
      },
    }));
  }, []);

  // 인스타 캡션을 유튜브 본문으로 복사
  const copyIgToYt = useCallback(() => {
    setData((prev) => ({
      ...prev,
      yt: {
        ...prev.yt,
        text: prev.ig.text,
      },
    }));
  }, []);

  // 플랫폼별 이미지 추가 (다중)
  const addImages = useCallback((platform, newImages) => {
    setData((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        images: [...prev[platform].images, ...newImages],
      },
    }));
  }, []);

  // 플랫폼별 이미지 순서 드래그 정렬
  const reorderImages = useCallback((platform, oldIndex, newIndex) => {
    if (oldIndex === newIndex) return;
    setData((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        images: arrayMove(prev[platform].images, oldIndex, newIndex),
      },
    }));
  }, []);

  // 플랫폼별 이미지 삭제
  const removeImage = useCallback((platform, imageId) => {
    setData((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        images: prev[platform].images.filter((img) => img.id !== imageId),
      },
    }));
  }, []);

  // 전체 초기화 (IndexedDB도 함께 삭제)
  const resetAll = useCallback(async () => {
    const emptyState = {
      profile: { name: '', avatar: null },
      ig: { text: '', images: [] },
      yt: { text: '', images: [] },
    };
    setData(emptyState);
    await clearStorage();
  }, []);

  // 샘플 데이터 강제 불러오기
  const loadSampleData = useCallback(async () => {
    const sample = await loadSample();
    setData(sample);
    await saveToStorage(sample);
  }, []);

  return {
    data,
    setData,
    isInitialized,
    initData,
    updateProfile,
    updateText,
    copyIgToYt,
    addImages,
    reorderImages,
    removeImage,
    resetAll,
    loadSampleData,
  };
}
