import { PLATFORM_RULES } from '../../constants/platformRules';
import { countChars, countHashtags, getLimitStatus } from '../../utils/validators';
import LimitBadge from '../common/LimitBadge';
import Button from '../common/Button';

/**
 * 플랫폼별 문구 에디터 (글자수·해시태그 카운트 및 경고 배지)
 */
export default function TextEditor({ platform, text, onChange, onCopyFromIg, canCopyFromIg }) {
  const rules = PLATFORM_RULES[platform];
  const charCount = countChars(text);
  const charStatus = getLimitStatus(charCount, rules.maxChars);

  const hashtagCount = rules.maxHashtags ? countHashtags(text) : 0;
  const hashtagStatus = rules.maxHashtags ? getLimitStatus(hashtagCount, rules.maxHashtags) : 'ok';

  return (
    <div className="text-editor">
      <div className="text-editor__header">
        <label className="form-label" htmlFor={`text-${platform}`}>
          {platform === 'ig' ? '인스타그램 캡션' : '유튜브 본문 내용'}
        </label>
        {platform === 'yt' && canCopyFromIg && (
          <Button
            onClick={onCopyFromIg}
            style={{ height: '28px', fontSize: '11.5px', padding: '0 10px' }}
            title="인스타그램 캡션을 유튜브 본문으로 그대로 복사합니다"
          >
            📋 인스타 문구 복사
          </Button>
        )}
      </div>

      <textarea
        id={`text-${platform}`}
        className="form-textarea"
        rows={9}
        placeholder={
          platform === 'ig'
            ? '피드에 노출될 문구를 입력하세요. 첫 줄은 항상 노출되며 나머지는 "더 보기"로 접힙니다. #해시태그 사용 가능'
            : '커뮤니티 게시물에 노출될 본문을 입력하세요. 첫 줄 이후는 "자세히 보기"로 접힙니다. 링크(https://...) 지원'
        }
        value={text}
        onChange={(e) => onChange(e.target.value)}
      />

      <div className="text-editor__badges">
        <LimitBadge
          label="글자 수"
          current={charCount}
          max={rules.maxChars}
          status={charStatus}
        />
        {rules.maxHashtags && (
          <LimitBadge
            label="해시태그"
            current={hashtagCount}
            max={rules.maxHashtags}
            status={hashtagStatus}
          />
        )}
      </div>
    </div>
  );
}
