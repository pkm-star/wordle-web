import { create } from 'zustand';
import { ANSWER_WORDS, ALL_VALID_WORDS } from './wordLists';

const WORDS = ANSWER_WORDS;

function evaluateGuess(guess, answer) {
  const result = Array(5).fill('absent');
  const answerChars = answer.split('');
  const guessChars = guess.split('');

  for (let i = 0; i < 5; i++) {
    if (guessChars[i] === answerChars[i]) {
      result[i] = 'correct';
      answerChars[i] = null;
      guessChars[i] = null;
    }
  }

  for (let i = 0; i < 5; i++) {
    if (guessChars[i] === null) continue;
    const idx = answerChars.indexOf(guessChars[i]);
    if (idx !== -1) {
      result[i] = 'present';
      answerChars[idx] = null;
    }
  }

  return result;
}

const VALID_WORDS = ALL_VALID_WORDS;

const useGameStore = create((set, get) => ({
  answer: WORDS[Math.floor(Math.random() * WORDS.length)],
  guesses: [],
  currentGuess: '',
  gameStatus: 'playing',
  isRevealing: false,
  shakeRow: false,
  toastMessage: '',

  addLetter: (letter) => {
    const { currentGuess, gameStatus, isRevealing } = get();
    if (gameStatus !== 'playing' || isRevealing) return;
    if (currentGuess.length >= 5) return;
    set({ currentGuess: currentGuess + letter.toLowerCase() });
  },

  removeLetter: () => {
    const { currentGuess, gameStatus, isRevealing } = get();
    if (gameStatus !== 'playing' || isRevealing) return;
    set({ currentGuess: currentGuess.slice(0, -1) });
  },

  submitGuess: () => {
    const { currentGuess, guesses, answer, gameStatus, isRevealing } = get();
    if (gameStatus !== 'playing' || isRevealing) return;
    if (currentGuess.length !== 5) return;

    const normalizedGuess = currentGuess.toLowerCase();
    if (!VALID_WORDS.has(normalizedGuess)) {
      set({ shakeRow: true, toastMessage: 'Not in word list' });
      return;
    }

    const newGuesses = [...guesses, normalizedGuess];
    const won = normalizedGuess === answer;
    const lost = !won && newGuesses.length >= 6;

    set({
      guesses: newGuesses,
      currentGuess: '',
      gameStatus: won ? 'won' : lost ? 'lost' : 'playing',
      isRevealing: true,
    });
  },

  clearShake: () => set({ shakeRow: false }),
  clearToast: () => set({ toastMessage: '' }),

  finishReveal: () => set({ isRevealing: false }),

  evaluateGuess: (guess) => evaluateGuess(guess, get().answer),

  getLetterStatuses: () => {
    const { guesses, answer } = get();
    const statuses = {};
    const priority = { correct: 3, present: 2, absent: 1 };

    for (const guess of guesses) {
      const evaluation = evaluateGuess(guess, answer);
      for (let i = 0; i < 5; i++) {
        const letter = guess[i];
        const status = evaluation[i];
        if (!statuses[letter] || priority[status] > priority[statuses[letter]]) {
          statuses[letter] = status;
        }
      }
    }

    return statuses;
  },

  resetGame: () => set({
    answer: WORDS[Math.floor(Math.random() * WORDS.length)],
    guesses: [],
    currentGuess: '',
    gameStatus: 'playing',
    isRevealing: false,
    shakeRow: false,
    toastMessage: '',
  }),
}));

export default useGameStore;
