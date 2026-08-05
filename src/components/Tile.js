import { useState, useEffect } from 'react';
import { TIMING } from '../constants';

// ─── Tile ─────────────────────────────────────────────────────────────────────
function Tile({ letter, status, delay, isRevealing, isBouncing }) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (isRevealing) {
      setRevealed(false);
      const t = setTimeout(
        () => setRevealed(true),
        delay * TIMING.TILE_FLIP_STEP + TIMING.TILE_FLIP_OFFSET
      );
      return () => clearTimeout(t);
    }
  }, [isRevealing, delay]);
  /*뒤집는 동작, 몇초? 뒤집어지지 않았다면 뒤집고, 시간은 타일당 0.3초+0.25초 */

  const showColor = !isRevealing || revealed;
  const colorClass = showColor ? status : '';
  // 뒤집는 중이 아니다. 색 보임, 공개됨(색보임), showColor가 아직 뒤집히지 않았을 때 회색.

  let animClass = '';
  if (isRevealing) animClass = 'revealing';
  else if (isBouncing) animClass = 'bouncing';
  // 정답일 때 약간 통통 튐

  return (
    <div
      className={`tile ${colorClass || ''} ${letter ? 'filled' : ''} ${animClass}`}
      style={{
        ...(isRevealing ? { animationDelay: `${delay * TIMING.TILE_FLIP_STEP}ms` } : {}),
        ...(isBouncing   ? { animationDelay: `${delay * TIMING.BOUNCE_STEP}ms` } : {}),
      }}
    >
      {letter}
    </div>
  );
}
/*${colorClass || ''}는 위에서 선언된 변수로 correct, present, absent를 갖고 있다.
 */

export default Tile;
