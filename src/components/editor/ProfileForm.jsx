import { useRef, useState } from 'react';
import Avatar from '../preview/Avatar';
import Button from '../common/Button';
import ProfileCropModal from './ProfileCropModal';
import { autoCropProfileImage } from '../../utils/imageUtils';

/**
 * 프로필 설정 폼 (계정 이름 + 프로필 사진 스마트 자동 크롭 / 위치 미세 조절 모달 지원)
 */
export default function ProfileForm({ profile, onUpdate }) {
  const fileInputRef = useRef(null);
  const [rawImageSrc, setRawImageSrc] = useState(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  const handleNameChange = (e) => {
    onUpdate({ name: e.target.value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 원본 Data URL 보관 (미세 조절 모달용)
    const reader = new FileReader();
    reader.onload = (event) => {
      setRawImageSrc(event.target.result);
    };
    reader.readAsDataURL(file);

    try {
      // 1. 자동으로 정사각 및 원형에 최적화된 스마트 크롭 적용 (로고 잘림 방지 안전 여백 포함)
      const croppedUrl = await autoCropProfileImage(file);
      onUpdate({ avatar: croppedUrl });
    } catch {
      // 실패 시 기본 Data URL 적용 fallback
      reader.onload = (event) => {
        onUpdate({ avatar: event.target.result });
      };
    }

    e.target.value = '';
  };

  const handleRemoveImage = () => {
    onUpdate({ avatar: null });
    setRawImageSrc(null);
  };

  const handleCropConfirm = (croppedDataUrl) => {
    onUpdate({ avatar: croppedDataUrl });
    setIsCropModalOpen(false);
  };

  return (
    <div className="profile-form">
      <div className="profile-form__avatar-row">
        <div className="profile-form__avatar-wrap">
          <Avatar name={profile.name || '깨봉'} image={profile.avatar} size={48} />
        </div>
        <div className="profile-form__avatar-actions" style={{ flexWrap: 'wrap' }}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <Button onClick={() => fileInputRef.current?.click()} style={{ height: '32px', fontSize: '12px' }}>
            {profile.avatar ? '사진 변경' : '프로필 사진 등록'}
          </Button>

          {profile.avatar && rawImageSrc && (
            <Button
              onClick={() => setIsCropModalOpen(true)}
              style={{ height: '32px', fontSize: '12px' }}
              title="원 안의 위치와 크기를 직접 미세 조절합니다"
            >
              ✂️ 위치/크기 조절
            </Button>
          )}

          {profile.avatar && (
            <Button onClick={handleRemoveImage} style={{ height: '32px', fontSize: '12px' }}>
              삭제
            </Button>
          )}
        </div>
      </div>

      <div className="form-group" style={{ marginTop: '12px' }}>
        <label className="form-label" htmlFor="profile-name">
          계정 / 채널 이름
        </label>
        <input
          id="profile-name"
          type="text"
          className="form-input"
          placeholder="예: 깨봉수학"
          value={profile.name}
          onChange={handleNameChange}
        />
      </div>

      {/* 인터랙티브 크롭 모달 */}
      <ProfileCropModal
        isOpen={isCropModalOpen}
        rawImageSrc={rawImageSrc}
        onConfirm={handleCropConfirm}
        onCancel={() => setIsCropModalOpen(false)}
      />
    </div>
  );
}
