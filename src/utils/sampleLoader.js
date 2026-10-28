/**
 * 샘플 문구·이미지를 편집 데이터 형태로 불러오기
 */
import {
  SAMPLE_PROFILE,
  SAMPLE_IG_TEXT,
  SAMPLE_YT_TEXT,
  SAMPLE_IG_IMAGES,
  SAMPLE_YT_IMAGES,
} from '../constants/sampleTexts';
import { loadImageFromUrl } from './imageUtils';

export async function loadSample() {
  const [igImages, ytImages] = await Promise.all([
    Promise.all(SAMPLE_IG_IMAGES.map((src) => loadImageFromUrl(src))),
    Promise.all(SAMPLE_YT_IMAGES.map((src) => loadImageFromUrl(src))),
  ]);

  return {
    profile: { ...SAMPLE_PROFILE },
    ig: { text: SAMPLE_IG_TEXT, images: igImages },
    yt: { text: SAMPLE_YT_TEXT, images: ytImages },
  };
}
