import { useState, useCallback } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { loadSample } from '../utils/sampleLoader';

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
 * 에디터 핵심 상태 관리 훅
 */
export default function useEditorState(initialData = null) {
  const [data, setData] = useState(initialData || DEFAULT_STATE);

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

  // 전체 초기화
  const resetAll = useCallback(() => {
    setData({
      profile: { name: '', avatar: null },
      ig: { text: '', images: [] },
      yt: { text: '', images: [] },
    });
  }, []);

  // 샘플 데이터 불러오기
  const loadSampleData = useCallback(async () => {
    const sample = await loadSample();
    setData(sample);
  }, []);

  return {
    data,
    setData,
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
