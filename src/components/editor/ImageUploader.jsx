import { useRef, useState } from 'react';
import { ImagePlus } from 'lucide-react';
import { readFileAsImageData } from '../../utils/imageUtils';
import { isVideoFile, readFileAsVideoData } from '../../utils/videoUtils';
import { validateVideoFile } from '../../utils/validators';

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

  const processFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) return;

    const allFiles = Array.from(fileList);
    const validFiles = [];

    for (const file of allFiles) {
      const isImg = file.type && file.type.startsWith('image/');
      const isVid = isVideoFile(file);

      if (!isImg && !isVid) continue;

      if (isVid) {
        const sizeCheck = validateVideoFile(file, maxVideoSizeMB);
        if (!sizeCheck.valid) {
          alert(sizeCheck.message);
          continue;
        }
      }
      validFiles.push({ file, isVid });
    }

    if (validFiles.length === 0) {
      alert('이미지(PNG, JPG, WebP) 또는 동영상(MP4, MOV) 파일만 업로드할 수 있습니다.');
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
      alert(err.message || '미디어를 불러오는 중 오류가 발생했습니다.');
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
          : `여러 개 동시 선택 가능 · 동영상 개당 ${maxVideoSizeMB}MB 이하 권장 (남은 한도: ${remaining}개)`}
      </div>
    </div>
  );
}
