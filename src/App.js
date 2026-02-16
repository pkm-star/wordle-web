import { useEffect, useCallback, useState } from 'react';
import useGameStore from './useGameStore';
import './App.css';

function Tile({ letter, status, delay, isRevealing }) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (isRevealing) {
      setRevealed(false);
      const timer = setTimeout(() => setRevealed(true), delay * 300 + 250);
      return () => clearTimeout(timer);
    }
  }, [isRevealing, delay]);

  // For already-revealed rows (previous guesses), show color immediately
  const showColor = !isRevealing || revealed;
  const colorClass = showColor ? status : '';

  return (
    <div
      className={`tile ${colorClass || ''} ${letter ? 'filled' : ''} ${isRevealing ? 'revealing' : ''}`}
      style={isRevealing ? { animationDelay: `${delay * 300}ms` } : undefined}
    >
      {letter}
    </div>
  );
}

function Toast({ message }) {
  const clearToast = useGameStore((s) => s.clearToast);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => clearToast(), 1500);
      return () => clearTimeout(timer);
    }
  }, [message, clearToast]);

  if (!message) return null;

  return (
    <div className="toast-container">
      <div className="toast">{message}</div>
    </div>
  );
}

function Board() {
  const guesses = useGameStore((s) => s.guesses);
  const currentGuess = useGameStore((s) => s.currentGuess);
  const gameStatus = useGameStore((s) => s.gameStatus);
  const isRevealing = useGameStore((s) => s.isRevealing);
  const evaluateGuess = useGameStore((s) => s.evaluateGuess);
  const finishReveal = useGameStore((s) => s.finishReveal);
  const shakeRow = useGameStore((s) => s.shakeRow);
  const clearShake = useGameStore((s) => s.clearShake);

  const currentRow = guesses.length;

  useEffect(() => {
    if (isRevealing) {
      // Wait for all 5 tiles to finish flipping: 4*300 + 500 = 1700ms
      const timer = setTimeout(() => finishReveal(), 1700);
      return () => clearTimeout(timer);
    }
  }, [isRevealing, finishReveal]);

  useEffect(() => {
    if (shakeRow) {
      const timer = setTimeout(() => clearShake(), 600);
      return () => clearTimeout(timer);
    }
  }, [shakeRow, clearShake]);

  const rows = [];
  for (let i = 0; i < 6; i++) {
    const tiles = [];
    if (i < guesses.length) {
      const guess = guesses[i];
      const evaluation = evaluateGuess(guess);
      const isLastGuess = i === guesses.length - 1 && isRevealing;
      for (let j = 0; j < 5; j++) {
        tiles.push(
          <Tile
            key={j}
            letter={guess[j]}
            status={evaluation[j]}
            delay={j}
            isRevealing={isLastGuess}
          />
        );
      }
    } else if (i === currentRow && gameStatus === 'playing') {
      for (let j = 0; j < 5; j++) {
        tiles.push(
          <Tile key={j} letter={currentGuess[j] || ''} />
        );
      }
    } else {
      for (let j = 0; j < 5; j++) {
        tiles.push(<Tile key={j} letter="" />);
      }
    }

    const isCurrentRow = i === currentRow && gameStatus === 'playing';
    rows.push(
      <div key={i} className={`row ${isCurrentRow && shakeRow ? 'shake' : ''}`}>
        {tiles}
      </div>
    );
  }

  return <div className="board">{rows}</div>;
}

const KEYBOARD_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '⌫'],
];

function Keyboard() {
  const addLetter = useGameStore((s) => s.addLetter);
  const removeLetter = useGameStore((s) => s.removeLetter);
  const submitGuess = useGameStore((s) => s.submitGuess);
  const guesses = useGameStore((s) => s.guesses);
  const isRevealing = useGameStore((s) => s.isRevealing);
  const getLetterStatuses = useGameStore((s) => s.getLetterStatuses);

  // Only show statuses for fully revealed guesses
  // During reveal, exclude the latest guess from keyboard coloring
  const revealedCount = isRevealing ? guesses.length - 1 : guesses.length;
  const [keyStatuses, setKeyStatuses] = useState({});

  useEffect(() => {
    if (!isRevealing) {
      setKeyStatuses(getLetterStatuses());
    }
  }, [isRevealing, revealedCount, getLetterStatuses]);

  const handleClick = useCallback((key) => {
    if (key === 'Enter') submitGuess();
    else if (key === '⌫') removeLetter();
    else addLetter(key);
  }, [addLetter, removeLetter, submitGuess]);

  return (
    <div className="keyboard">
      {KEYBOARD_ROWS.map((row, i) => (
        <div key={i} className="keyboard-row">
          {row.map((key) => (
            <button
              key={key}
              className={`key ${keyStatuses[key] || ''} ${key.length > 1 || key === '⌫' ? 'wide' : ''}`}
              onClick={() => handleClick(key)}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

function App() {
  const addLetter = useGameStore((s) => s.addLetter);
  const removeLetter = useGameStore((s) => s.removeLetter);
  const submitGuess = useGameStore((s) => s.submitGuess);
  const gameStatus = useGameStore((s) => s.gameStatus);
  const answer = useGameStore((s) => s.answer);
  const resetGame = useGameStore((s) => s.resetGame);
  const isRevealing = useGameStore((s) => s.isRevealing);
  const toastMessage = useGameStore((s) => s.toastMessage);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'Enter') submitGuess();
      else if (e.key === 'Backspace') removeLetter();
      else if (/^[a-zA-Z]$/.test(e.key)) addLetter(e.key);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [addLetter, removeLetter, submitGuess]);

  return (
    <div className="app">
      <header className="header">
        <h1>Wordle</h1>
      </header>
      <Toast message={toastMessage} />
      <Board />
      {gameStatus !== 'playing' && !isRevealing && (
        <div className="game-over">
          <p>
            {gameStatus === 'won'
              ? '축하합니다! 🎉'
              : `정답은 "${answer.toUpperCase()}" 이었습니다.`}
          </p>
          <button className="new-game-btn" onClick={resetGame}>
            새 게임
          </button>
        </div>
      )}
      <Keyboard />
    </div>
  );
}

export default App;
