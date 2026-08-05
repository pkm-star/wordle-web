import { useState, useEffect, useCallback } from 'react';
import useGameStore from '../useGameStore';
import { KEYBOARD_ROWS } from '../constants';

// ─── Keyboard ─────────────────────────────────────────────────────────────────
function Keyboard() {
  const addLetter         = useGameStore(s => s.addLetter);
  const removeLetter      = useGameStore(s => s.removeLetter);
  const submitGuess       = useGameStore(s => s.submitGuess);
  const guesses           = useGameStore(s => s.guesses);
  const isRevealing       = useGameStore(s => s.isRevealing);
  const getLetterStatuses = useGameStore(s => s.getLetterStatuses);

  const [keyStatuses, setKeyStatuses] = useState({});

  useEffect(() => {
    if (!isRevealing) setKeyStatuses(getLetterStatuses());
  }, [isRevealing, guesses.length, getLetterStatuses]);
  /*타일 뒤집기가 끝난 후 키보드 색을 업데이트 한다.  */

  const handleClick = useCallback(key => {
    if (key === 'Enter') submitGuess();
    else if (key === '⌫') removeLetter();
    else addLetter(key);
  }, [addLetter, removeLetter, submitGuess]);
  /*useCallback은 함수를 캐싱(저장)한다. 매번 새 함수를 만들지 않고 같은 함수를 재사용. 불필요한 리렌더링 방지용
  (함수, [의존성]) 의존성이 바뀌면 실행. */

  return (
    <div className="keyboard">
      {KEYBOARD_ROWS.map((row, i) => (
        <div key={i} className="keyboard-row">
          {/* 2번째 줄 좌우에 0.5 spacer — 원본 Wordle과 동일한 중앙 정렬 */}
          {i === 1 && <div className="key-spacer" />}
          {row.map(key => (
            <button
              key={key}
              className={`key ${keyStatuses[key] || ''} ${key.length > 1 || key === '⌫' ? 'wide' : ''}`}
              onClick={() => handleClick(key)}
            >
            {/* 키 색상, 엔터와 백스페이스 크기 넓힘 클릭시 동작 */}
              {key === '⌫'
                ? <svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 0 24 24" width="27" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8.25,4.5 L21.75,4.5 Q22.75,4.5 22.75,5.5 L22.75,18.5 Q22.75,19.5 21.75,19.5 L8.25,19.5 L2.25,12 Z"/>
                    <line x1="11.25" y1="8.75" x2="17.75" y2="15.25"/>
                    <line x1="17.75" y1="8.75" x2="11.25" y2="15.25"/>
                  </svg>
                : key
              }
            </button>
          ))}
          {i === 1 && <div className="key-spacer" /> }
        </div>
      ))}
    </div>
  );
}
/* 두번 째 줄에 센터배치하여 대칭을 맞춤 */

export default Keyboard;
