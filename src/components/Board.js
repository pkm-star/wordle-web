import { useEffect } from 'react';
import useGameStore from '../useGameStore';
import Tile from './Tile';
import { TIMING } from '../constants';

// ─── Board ────────────────────────────────────────────────────────────────────
function Board() {
  const guesses      = useGameStore(s => s.guesses);
  const currentGuess = useGameStore(s => s.currentGuess);
  const gameStatus   = useGameStore(s => s.gameStatus);
  const isRevealing  = useGameStore(s => s.isRevealing);
  const bounceRow    = useGameStore(s => s.bounceRow);
  const evalGuess    = useGameStore(s => s.evaluateGuess);
  const finishReveal = useGameStore(s => s.finishReveal);
  const shakeRow     = useGameStore(s => s.shakeRow);
  const clearShake   = useGameStore(s => s.clearShake);

  const currentRow = guesses.length;
  //현재 입력 줄

  useEffect(() => {
    if (isRevealing) {
      const t = setTimeout(() => finishReveal(), TIMING.BOARD_REVEAL);
      return () => clearTimeout(t);
    }
  }, [isRevealing, finishReveal]);
  /*뒤집는 중일 때 걸리는 시간 다 뒤집고 finishReveal로 종료*/

  useEffect(() => {
    if (shakeRow) {
      const t = setTimeout(() => clearShake(), TIMING.SHAKE_DURATION);
      return () => clearTimeout(t);
    }
  }, [shakeRow, clearShake]);
  /*잘못 입력시 흔들리는 시간 다 흔들면 종료 */

  const rows = [];
  for (let i = 0; i < 6; i++) {
    const tiles = [];
    const isLastGuess   = i === guesses.length - 1; // 마지막 제출한 줄
    const isFlipping    = isLastGuess && isRevealing;// 마지막 뒤집히는 줄
    const isBounceRow   = isLastGuess && bounceRow && gameStatus === 'won';//튀는 줄
    const isCurrentRow  = i === currentRow && gameStatus === 'playing';//지금 입력 중인 줄

    if (i < guesses.length) {
      const guess = guesses[i];
      const evl   = evalGuess(guess);
      for (let j = 0; j < 5; j++) {
        tiles.push(
          <Tile
            key={j}
            letter={guess[j]}
            status={evl[j]}
            delay={j}
            isRevealing={isFlipping}
            isBouncing={isBounceRow}
          />
        );
      }
    } else if (isCurrentRow) {
      for (let j = 0; j < 5; j++) {
        tiles.push(<Tile key={j} letter={currentGuess[j] || ''} />);
      }
    } else {
      for (let j = 0; j < 5; j++) {
        tiles.push(<Tile key={j} letter="" />);
      }
    }

    rows.push(
      <div
        key={i}
        className={`row ${isCurrentRow && shakeRow ? 'shake' : ''}`}
      >
        {tiles}
      </div>
    );
  }

  return <div className="board">{rows}</div>;
}
/* tile에 지금까지 했던 활동들을 저장하여 새로고침을 하였을 때 데이터가 날아가지 않게 한다. 새로고침하면 타일을 계속
새로 만들고 guesses를 통해 단어를 받아 채우는 것. localStorage로 컴퓨터에만 저장된다. */

export default Board;
