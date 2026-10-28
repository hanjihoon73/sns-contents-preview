import { useRef, useState } from 'react';
import { ImagePlus } from 'lucide-react';
import { readFileAsImageData } from '../../utils/imageUtils';
import { isVideoFile, readFileAsVideoData } from '../../utils/videoUtils';
import { validateVideoFile } from '../../utils/validators';
import ConfirmDialog from '../common/ConfirmDialog';

/**
 * 미디어(이미지·동영상) 업로드 컴포넌트 (클릭 또는 파일 드래그 앤 드롭)
 */
export default function ImageUploader({
  onAddImages,
  maxCount,
  currentCount,
  allowVideo = true,
  maxVideoSizeMB = 50,
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalNotice, setModalNotice] = useState({ isOpen: false, title: '', message: '' });

  const showNoticeModal = (title, message) => {
    setModalNotice({ isOpen: true, title, message });
  };

  const closeNoticeModal = () => {
    setModalNotice({ isOpen: false, title: '', message: '' });
  };

  const processFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) return;

    const allFiles = Array.from(fileList);
    const hasVideo = allFiles.some((file) => isVideoFile(file));

    // 유튜브 커뮤니티 등 비디오 미지원 플랫폼에서 동영상을 선택한 경우 모달 안내 후 차단
    if (hasVideo && !allowVideo) {
      showNoticeModal(
        '동영상 추가 불가',
        '유튜브 커뮤니티 프리뷰는 동영상을 추가할 수 없습니다.'
      );
      const imageOnlyFiles = allFiles.filter((f) => f.type && f.type.startsWith('image/'));
      if (imageOnlyFiles.length === 0) return;

      setIsLoading(true);
      try {
        const loadedImages = await Promise.all(
          imageOnlyFiles.map((file) => readFileAsImageData(file))
        );
        onAddImages(loadedImages);
      } catch (err) {
        showNoticeModal('업로드 오류', err.message || '이미지를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    const validFiles = [];

    for (const file of allFiles) {
      const isImg = file.type && file.type.startsWith('image/');
      const isVid = isVideoFile(file);

      if (!isImg && !isVid) continue;

      if (isVid) {
        const sizeCheck = validateVideoFile(file, maxVideoSizeMB);
        if (!sizeCheck.valid) {
          showNoticeModal('용량 초과 안내', sizeCheck.message);
          continue;
        }
      }
      validFiles.push({ file, isVid });
    }

    if (validFiles.length === 0) {
      showNoticeModal(
        '지원하지 않는 파일',
        allowVideo
          ? '이미지(PNG, JPG, WebP) 또는 동영상(MP4, MOV) 파일만 업로드할 수 있습니다.'
          : '이미지 파일(PNG, JPG, WebP 등)만 업로드할 수 있습니다.'
      );
      return;
    }

    setIsLoading(true);
    try {
      const readPromises = validFiles.map(({ file, isVid }) =>
        isVid ? readFileAsVideoData(file) : readFileAsImageData(file)
      );
      const loadedMedia = await Promise.all(readPromises);
      onAddImages(loadedMedia);
    } catch (err) {
      showNoticeModal('업로드 오류', err.message || '미디어를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
    e.target.value = '';
  };

  const remaining = Math.max(0, maxCount - currentCount);

  return (
    <>
      <div
        className={`image-uploader ${isDragging ? 'is-dragging' : ''} ${isLoading ? 'is-loading' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*,video/mp4,video/quicktime"
          multiple
          style={{ display: 'none' }}
        />
        <div className="image-uploader__icon">
          <ImagePlus size={32} style={{ color: 'var(--accent)' }} />
        </div>
        <div className="image-uploader__text">
          <strong>클릭</strong>하여 {allowVideo ? '이미지·동영상(MP4)을' : '이미지를'} 추가하거나{' '}
          <strong>여기로 드래그</strong>하세요
        </div>
        <div className="image-uploader__sub">
          {isLoading
            ? '미디어 및 썸네일 처리 중...'
            : allowVideo
            ? `여러 개 동시 선택 가능 · 동영상 개당 ${maxVideoSizeMB}MB 이하 권장 (남은 한도: ${remaining}개)`
            : `여러 장 동시 선택 가능 · 이미지 전용 (남은 한도: ${remaining}장)`}
        </div>
      </div>

      <ConfirmDialog
        isOpen={modalNotice.isOpen}
        title={modalNotice.title}
        message={modalNotice.message}
        onConfirm={closeNoticeModal}
        hideCancel
      />
    </>
  );
}
