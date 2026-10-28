import { createPortal } from 'react-dom';
import Button from './Button';

/**
 * 전체 초기화 등 주요 동작 확인 모달
 */
export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-card__title">{title}</h3>
        <p className="modal-card__desc">{message}</p>
        <div className="modal-card__actions">
          <Button onClick={onCancel}>취소</Button>
          <Button variant="primary" onClick={onConfirm}>
            확인
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
