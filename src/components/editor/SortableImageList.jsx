import { X } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { checkImageRatio } from '../../utils/validators';
import { formatDuration } from '../../utils/videoUtils';
import { IconPlay } from '../common/Icons';

function SortableItem({ id, img, index, platform, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const isVideo = img.type === 'video';
  const ratioCheck = checkImageRatio(platform, img.width, img.height);

  return (
    <div ref={setNodeRef} style={style} className="sortable-item">
      <div className="sortable-item__thumb-wrap" {...attributes} {...listeners}>
        <img
          src={img.thumbnail || img.src}
          alt={img.name || `${index + 1}번째 미디어`}
          className="sortable-item__img"
        />
        <span className="sortable-item__badge">{index + 1}</span>

        {isVideo && (
          <span className="sortable-item__video-badge" title="동영상 재생 시간">
            <IconPlay size={10} />
            <span>{formatDuration(img.duration)}</span>
          </span>
        )}
      </div>

      <div className="sortable-item__meta">
        <span
          className={`sortable-item__ratio ${
            ratioCheck.isRecommended ? 'is-valid' : 'is-warn'
          }`}
          title={ratioCheck.message}
        >
          {ratioCheck.info.ratioStr}
        </span>
        <button
          type="button"
          className="sortable-item__remove"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(img.id);
          }}
          aria-label="미디어 삭제"
          title="삭제"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}

/**
 * 드래그 정렬 가능한 이미지 목록
 */
export default function SortableImageList({ platform, images, onReorder, onRemove }) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px 이상 드래그해야 이동 시작 (클릭과 구분)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((item) => item.id === active.id);
      const newIndex = images.findIndex((item) => item.id === over.id);
      onReorder(platform, oldIndex, newIndex);
    }
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={images.map((img) => img.id)} strategy={rectSortingStrategy}>
        <div className="sortable-image-list">
          {images.map((img, index) => (
            <SortableItem
              key={img.id}
              id={img.id}
              img={img}
              index={index}
              platform={platform}
              onRemove={(id) => onRemove(platform, id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
