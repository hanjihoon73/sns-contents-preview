import { useRef, useState } from 'react';
import { ImagePlus } from 'lucide-react';
import { readFileAsImageData } from '../../utils/imageUtils';
import Button from '../common/Button';

/**
 * 이미지 업로드 컴포넌트 (클릭 또는 파일 드래그 앤 드롭)
 */
export default function ImageUploader({ onAddImages, maxCount, currentCount }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const processFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    const imageFiles = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      alert('이미지 파일(PNG, JPG, WebP 등)만 업로드할 수 있습니다.');
      return;
    }

    setIsLoading(true);
    try {
      const readPromises = imageFiles.map((file) => readFileAsImageData(file));
      const loadedImages = await Promise.all(readPromises);
      onAddImages(loadedImages);
    } catch (err) {
      alert(err.message || '이미지를 불러오는 중 오류가 발생했습니다.');
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
        accept="image/*"
        multiple
        style={{ display: 'none' }}
      />
      <div className="image-uploader__icon">
        <ImagePlus size={32} style={{ color: 'var(--accent)' }} />
      </div>
      <div className="image-uploader__text">
        <strong>클릭</strong>하여 이미지를 추가하거나 <strong>여기로 드래그</strong>하세요
      </div>
      <div className="image-uploader__sub">
        {isLoading ? '이미지 처리 중...' : `여러 장 동시 선택 가능 (남은 한도: ${remaining}장)`}
      </div>
    </div>
  );
}
