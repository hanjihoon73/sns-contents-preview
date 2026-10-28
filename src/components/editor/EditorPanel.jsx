import { useState } from 'react';
import { PLATFORM_RULES } from '../../constants/platformRules';
import { getLimitStatus } from '../../utils/validators';
import ProfileForm from './ProfileForm';
import TextEditor from './TextEditor';
import ImageUploader from './ImageUploader';
import SortableImageList from './SortableImageList';
import LimitBadge from '../common/LimitBadge';

/**
 * 좌측 전체 편집 패널
 */
export default function EditorPanel({
  data,
  updateProfile,
  updateText,
  copyIgToYt,
  addImages,
  reorderImages,
  removeImage,
}) {
  const [activeTab, setActiveTab] = useState('ig'); // 'ig' | 'yt'

  const activeRules = PLATFORM_RULES[activeTab];
  const activePost = data[activeTab];
  const imageCount = activePost.images.length;
  const imageStatus = getLimitStatus(imageCount, activeRules.maxImages);

  return (
    <div className="editor-panel">
      {/* 1. 프로필 설정 */}
      <section className="editor-section">
        <h2 className="editor-section__title">계정 프로필</h2>
        <ProfileForm profile={data.profile} onUpdate={updateProfile} />
      </section>

      {/* 2. 플랫폼 선택 탭 */}
      <section className="editor-section">
        <div className="editor-tabs">
          <button
            type="button"
            className={`editor-tab ${activeTab === 'ig' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('ig')}
          >
            <span className="editor-tab__dot editor-tab__dot--ig" />
            인스타그램 피드
          </button>
          <button
            type="button"
            className={`editor-tab ${activeTab === 'yt' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('yt')}
          >
            <span className="editor-tab__dot editor-tab__dot--yt" />
            유튜브 커뮤니티
          </button>
        </div>

        {/* 3. 문구 에디터 */}
        <div className="editor-block">
          <TextEditor
            platform={activeTab}
            text={activePost.text}
            onChange={(text) => updateText(activeTab, text)}
            onCopyFromIg={copyIgToYt}
            canCopyFromIg={Boolean(data.ig.text)}
          />
        </div>

        {/* 4. 이미지 업로드 & 리스트 */}
        <div className="editor-block">
          <div className="editor-block__header">
            <span className="form-label">
              이미지 ({activeRules.ratios.join(', ')} 권장)
            </span>
            <LimitBadge
              label="등록 장수"
              current={imageCount}
              max={activeRules.maxImages}
              status={imageStatus}
            />
          </div>

          <ImageUploader
            onAddImages={(newImages) => addImages(activeTab, newImages)}
            maxCount={activeRules.maxImages}
            currentCount={imageCount}
          />

          <SortableImageList
            platform={activeTab}
            images={activePost.images}
            onReorder={reorderImages}
            onRemove={removeImage}
          />
        </div>
      </section>
    </div>
  );
}
