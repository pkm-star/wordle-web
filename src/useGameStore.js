import { create } from 'zustand';
import { ANSWER_WORDS, ALL_VALID_WORDS } from './wordLists';

// ─── Daily Word System ───────────────────────────────────────────────────────
// Wordle epoch: June 19, 2021 (Day 0, word: "cigar")
const EPOCH = new Date(2021, 5, 19);

function getDayIndex() {
  const today = new Date();//이 순간 날짜와 시간 가져옴
  today.setHours(0, 0, 0, 0);//자정으로 초기화
  return Math.floor((today - EPOCH) / 86400000);
  //floor 소수점을 버린다. (오늘-기준일)/하루를 밀리초로 표현한 값 = 며칠째
}

function getDailyWord() {
  return ANSWER_WORDS[getDayIndex() % ANSWER_WORDS.length];
}
//날자%단어수를 해서 나머지1이 되면 처음부터 다시 반복
// ─── Guess Evaluation ────────────────────────────────────────────────────────
export function evaluateGuess(guess, answer) {
  const result = Array(5).fill('absent');
  const answerChars = answer.split('');
  const guessChars = guess.split('');
//5짜리 배열을 회색으로 채우고 알파벳 단위로 나눔
  for (let i = 0; i < 5; i++) {
    if (guessChars[i] === answerChars[i]) {
      result[i] = 'correct';
      answerChars[i] = null;
      guessChars[i] = null;
    }
  }
  /*자리가 맞는지 확인 이미 사용한 글자는 지운다.맞을 때 i를 null로 중복글자를
  잘못체크하는 것을 막기 위해 apple에서 aappl를 했을 때 a가 0번에서 정답인데 1번에서
  또 노란색으로 바꾸는 것을 막기 위해*/
  for (let i = 0; i < 5; i++) {
    if (guessChars[i] === null) continue;
    const idx = answerChars.indexOf(guessChars[i]);
    if (idx !== -1) {
      result[i] = 'present';
      answerChars[idx] = null;
    }
  }
  /* indexof()는 배열 안에서 찾는 값이 몇 번째 있는지 반환, 없으면 -1 */
  return result;
}

// ─── Hard Mode Validation ────────────────────────────────────────────────────
function checkHardMode(guess, guesses, answer) {
  const ORDINALS = ['1st', '2nd', '3rd', '4th', '5th'];
  const mustBeAt = {};
  const mustContain = [];
/*하드모드에는 이전에 힌트로 알게 된 글자를 반드시 써야하며 mustBeAt은 이 자리에 반드시
써야하는 글자 mustContain 반드시 포함해야 할 글자 */
  for (const prev of guesses) {
    const evl = evaluateGuess(prev, answer);
    //guesses 알파벳을 하나씩 꺼내서 평가
    for (let i = 0; i < 5; i++) {
      if (evl[i] === 'correct') mustBeAt[i] = prev[i];
    }
    for (let i = 0; i < 5; i++) {
      if (evl[i] === 'present' && !mustContain.includes(prev[i])) {
        mustContain.push(prev[i]);
      }
    }
  }
/*!mustContain.includes(prev[i])는 중복방지를 위한 것 추가되어 있지 않을때만 넣어라
 */
  for (const [pos, letter] of Object.entries(mustBeAt)) {
    if (guess[Number(pos)] !== letter) {
      return `${ORDINALS[pos]} letter must be ${letter.toUpperCase()}`;
    }
  }
  /*Object.entries()는 Javascript 내장 메서드로, 객체를 [key, value] 쌍의
  배열로 변환, key를 항상 문자열로 내보니기에 Number(pos) 숫자로 바꿔줌
  백틱+${}은 변수를 문자열 안에 끼워넣음*/
  for (const letter of mustContain) {
    if (!guess.includes(letter)) {
      return `Guess must contain ${letter.toUpperCase()}`;
    }
  }
  /*일력한 단어의 알파벳이 mustContain에 없다면 포함해야 한다고 알려줌*/
  return null;
}

// ─── Win Toast Messages ───────────────────────────────────────────────────────
const WIN_MESSAGES = ['Genius', 'Magnificent', 'Impressive', 'Splendid', 'Great', 'Phew!'];
//도전 횟수마다 출력값이 달라짐
// ─── Persistence Helpers ─────────────────────────────────────────────────────
function loadStats() {
  try {
    const s = localStorage.getItem('wordleStats');
    if (s) return JSON.parse(s);
  } catch {}
  return {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }, //몇번만에 맞춘 횟수
    lastPlayDay: null,
  };
}
/*브라우저에 localStorage에서 통계를 불러오는 함수로 F12를 눌러 브라우저 내부에서
실제로 사용된 입력값들을 사용하여 나타냄. 그래서 실행하고 꺼도 데이터가 남아있고, 막대 그래프는 css에서 작업
getItem(키)는 값을 불러오고 setItem(키,값)으로 저장. JSON.sringify({a:5, b:3})->'{"a":5,"b":3}'
객체에서 문자열로 변경 loca;Storage는 문자열만 저장할 수 있기에 변환. JSON.parse()는 문자열을 객체로 변환*/
function saveStats(stats) {
  try { localStorage.setItem('wordleStats', JSON.stringify(stats)); } catch {}
}
//게임을 하고 나서의 정보를 받아 localStorage에 전달해주는 것이다. const useGameStore에서의 stats를 가져옴
function loadSettings() {
  try {
    const s = localStorage.getItem('wordleSettings');
    if (s) return JSON.parse(s);
  } catch {}
  return { hardMode: false, colorBlind: false };
}

function saveSettings(settings) {
  try { localStorage.setItem('wordleSettings', JSON.stringify(settings)); } catch {}
}

function loadGameState(dayIndex) {
  try {
    const s = localStorage.getItem('wordleGameState');
    if (s) {
      const state = JSON.parse(s);
      if (state.dayIndex === dayIndex) return state;
    }
  } catch {}
  return null;
}

function saveGameState(state) {
  try { localStorage.setItem('wordleGameState', JSON.stringify(state)); } catch {}
}

function updateStats(stats, won, guessCount, dayIndex) {
  const next = {
    ...stats,
    guessDistribution: { ...stats.guessDistribution },
    gamesPlayed: stats.gamesPlayed + 1,
  };
/* 현재 통계에 이겼는지, 몇번째에 이겼는지, 오늘 날짜번호,  
 ...객체나 배열을 펼쳐서 복사, 예상치 못한 버그 예방*/
  if (won) {
    next.gamesWon = stats.gamesWon + 1;
    if (stats.lastPlayDay === dayIndex - 1 || stats.lastPlayDay == null) {
      next.currentStreak = (stats.currentStreak || 0) + 1;
    } else if (stats.lastPlayDay !== dayIndex) {
      next.currentStreak = 1;
    }
    next.maxStreak = Math.max(next.maxStreak || 0, next.currentStreak);
    next.guessDistribution[guessCount] = (next.guessDistribution[guessCount] || 0) + 1;
  } else {
    next.currentStreak = 0;
  }
/* === 동등연산자 타입과 값이 같아야함, */
  next.lastPlayDay = dayIndex;
  return next;
}

// ─── Initialization ───────────────────────────────────────────────────────────
const dayIndex = getDayIndex();
const dailyWord = getDailyWord();
const savedSettings = loadSettings();
const savedGame = loadGameState(dayIndex);

// Apply color blind mode immediately (before React renders)
if (savedSettings.colorBlind) {
  document.documentElement.setAttribute('data-color-blind', '1');
}
// css에 있음 .setAttribute(속성이름, 값) 속성을 추가하거나 수정하는 메서드
// Show help modal on first ever visit
const isFirstVisit = !localStorage.getItem('wordleSeenHelp');
if (isFirstVisit) {
  localStorage.setItem('wordleSeenHelp', '1');
}
// 첫 방문시 1을 추가해 다음 방문부터 첫 방문이 아님을 나타냄
// ─── Store ────────────────────────────────────────────────────────────────────
const useGameStore = create((set, get) => ({
  /*set은 데이터를 바꿀 때, get은 데이터를 읽을 때 */
  answer: dailyWord,
  dayIndex,
  guesses: savedGame?.guesses ?? [],
  currentGuess: '',
  gameStatus: savedGame?.gameStatus ?? 'playing',
  /* a?.b는 a가 있으면 b 출력 없으면 undefined 반환 . ??(널 병합 연산자)은 왼쪽이 null 또는 undefined일 때만
  오른쪽 값 사용*/
  isRevealing: false,
  bounceRow: false,
  shakeRow: false,
  toastMessage: '',

  // Settings
  hardMode: savedSettings.hardMode,
  colorBlind: savedSettings.colorBlind,

  // Stats
  stats: loadStats(),

  // Modal visibility
  showHelp: isFirstVisit,
  showStats: false,
  showSettings: false,

  setShowHelp: (v) => set({ showHelp: v }),
  setShowStats: (v) => set({ showStats: v }),
  setShowSettings: (v) => set({ showSettings: v }),

  toggleHardMode: () => {
    const { hardMode, guesses, gameStatus } = get();
    if (guesses.length > 0 && gameStatus === 'playing') {
      set({ toastMessage: 'Hard mode can only be enabled at the start of a round!' });
      return;
    }
    /*get() 현재 상태를 읽음 하드모드 유무, 제출단어, 게임 상태, 단어입력하고 게임중이면
    하드모드 실행 불가 메시지 */
    const next = !hardMode;
    saveSettings({ hardMode: next, colorBlind: get().colorBlind });
    set({ hardMode: next });
  },
/* 꺼져있다면 켜지고, 켜져있다면 꺼진다.  하드모드 값을 next로 바꾼다. 화면 자동 새로고침*/
  toggleColorBlind: () => {
    const { colorBlind, hardMode } = get();
    const next = !colorBlind;
    saveSettings({ hardMode, colorBlind: next });
    document.documentElement.setAttribute('data-color-blind', next ? '1' : '0');
    set({ colorBlind: next });
  },
/*색맹 모드가 꺼져있다면 colorBlind의 값을 next로 하고 next일 때 1로하여 색맹으로 변겨 */
  addLetter: (letter) => {
    const { currentGuess, gameStatus, isRevealing } = get();
    if (gameStatus !== 'playing' || isRevealing) return;
    if (currentGuess.length >= 5) return;
    set({ currentGuess: currentGuess + letter.toLowerCase() });
  },
/* 현재 입력중인 단어, 게임 상태, 뒤집히는 중인가. 내부적으로는 소문자로 게산하기 때문에 소문자로 변경(wordLists가 소문자)*/

  removeLetter: () => {
    const { currentGuess, gameStatus, isRevealing } = get();
    if (gameStatus !== 'playing' || isRevealing) return;
    set({ currentGuess: currentGuess.slice(0, -1) });
  },
//slice(0,-1) 0부터 시작, 끝에서 1개 제외. 마지막 글자 제거하는 법
  submitGuess: () => {
    const { currentGuess, guesses, answer, gameStatus, isRevealing, hardMode } = get();
    if (gameStatus !== 'playing' || isRevealing) return;

    if (currentGuess.length !== 5) {
      set({ shakeRow: true, toastMessage: 'Not enough letters' });
      return;
    }
/*현재 입력 단어, 이전 목록, 답, 게임 상태, 뒤집는 중인가, 하드모드인가.
단어 길이가 짧으면 메시지와 현재 줄 흔들고 데출 중단 */
    const g = currentGuess.toLowerCase();
    // 현재 줄 g에 소문자로 저장
    if (!ALL_VALID_WORDS.has(g)) {
      set({ shakeRow: true, toastMessage: 'Not in word list' });
      return;
    }
/*단어 집단 안에 g가 있는가 있다면 true, 없다면 false. 근데 !가 있기 때문에 없다면 true이다. 단어가 존재하지 않다면
흔들고 경고 메시지 출력  */
    if (hardMode && guesses.length > 0) {
      const err = checkHardMode(g, guesses, answer);
      if (err) {
        set({ shakeRow: true, toastMessage: err });
        return;
      }
    }
/* 하드모드이고 이전 추측이 하나 이상 있을 때만 검사. 내가 입력한 단어, 이전 추측들, 정답을 넘겨주고 
err에 오류 메시지가 담기면 흠들고 중단*/
    const newGuesses = [...guesses, g];
    const won = g === answer;
    const lost = !won && newGuesses.length >= 6;
    const newStatus = won ? 'won' : lost ? 'lost' : 'playing';
/*기존 추측 목록에 단어 추가, g와 답이 같으면 승, 승이 아니고, 길이가 6과 같거나 크다면 짐 승리면 승, 아니면 패, 패도
아니면 게임 중*/
    let stats = get().stats;
    if (won || lost) {
      stats = updateStats(stats, won, newGuesses.length, get().dayIndex);
      saveStats(stats);
    }
/*게임이 끝났을 때 이기거나 졌을 때만 통계 업데이트 횟수,승ㅇ리수,연속승리 ... */
    set({ guesses: newGuesses, currentGuess: '', gameStatus: newStatus, isRevealing: true, stats });
    saveGameState({ guesses: newGuesses, gameStatus: newStatus, dayIndex: get().dayIndex });
/*let과 const는 둘다 상수이지만 let은 재할당 할 수 있다는 차이가 있다. set을 활용하여 단어 목록, 입력창 비우기
게임 상태, 타일 뒤집기, 업데이트 통계를 대 할당.
saveGameState에 저장함으로써 브라우저를 닫았다 열어도 진행상황이 유지되도록 localStorage에 저장 */
    // Post-reveal: toast + stats modal
    if (won) {
      const msg = WIN_MESSAGES[newGuesses.length - 1] || 'Nice!';
      setTimeout(() => {
        set({ toastMessage: msg });
        setTimeout(() => set({ showStats: true }), 2000);
      }, 1600);
    } else if (lost) {
      setTimeout(() => {
        set({ toastMessage: answer.toUpperCase() });
        setTimeout(() => set({ showStats: true }), 2000);
      }, 1600);
    }
  },
/*승리시 msg에 맞추기 전 실행 횟수에 따라 출력값 변경. 1600은 1.6초로 타일이 다 뒤집힌 후에 실행되고 약 2초동안 실행
 패배시 토스트 창에 소문자로된 정답을 보여준다. 시간은 승리시와 똑같다.*/
  clearShake: () => set({ shakeRow: false }),
  clearToast: () => set({ toastMessage: '' }),
// 흔들기 애니메이션 끄기, 토스트창 지우기
  finishReveal: () => {
    const { gameStatus } = get();
    set({ isRevealing: false });
    if (gameStatus === 'won') {
      set({ bounceRow: true });
      setTimeout(() => set({ bounceRow: false }), 1500);
    }
  },
/*타일을 다 뒤집고, 이겼으면 타일 튀어오르기, 1.5초 후 튀어오르기 끝 */
  evaluateGuess: (guess) => evaluateGuess(guess, get().answer),
/*왼쪽 evaluateGuess 창고안에 함수이고 오른쪽 evaluateGuess는 밖에 정의된 함수 guess만 넘기면
guess.answer()를 자동으로 붙여 나옴 */
  getLetterStatuses: () => {
    const { guesses, answer } = get();
    const statuses = {};
    const priority = { correct: 3, present: 2, absent: 1 };
    for (const guess of guesses) {
      const evl = evaluateGuess(guess, answer);
      for (let i = 0; i < 5; i++) {
        const l = guess[i];
        const s = evl[i];
        if (!statuses[l] || priority[s] > priority[statuses[l]]) statuses[l] = s;
      }
    }
    return statuses;
  },
/*statuses에 각 알파벳의 현재 상태를 저장 statuses의 색이 없거나 priority[s]숫자가 priority[statuses[l]
 현재 statuses의 숫자보다 크다면 statuses에 평가색인(초록,노랑 적용) 틀리면 그냥 계속 회색*/
  getShareText: () => {
    const { guesses, answer, dayIndex, hardMode, colorBlind } = get();
    const won = guesses.length > 0 && guesses[guesses.length - 1] === answer;
    const score = won ? guesses.length : 'X';
    const hardStr = hardMode ? '*' : '';
    let text = `Wordle ${dayIndex} ${score}/6${hardStr}\n\n`;
    for (const guess of guesses) {
      const evl = evaluateGuess(guess, answer);
      for (const s of evl) {
        if (s === 'correct')  text += colorBlind ? '🟧' : '🟩';
        else if (s === 'present') text += colorBlind ? '🟦' : '🟨';
        else text += '⬛';
      }
      text += '\n';
    }
    return text.trim();
  },
}));
/*단어가 있고, 마지막 단어가 정답이라면 몇번만에 맞췄는지 틀리면 X 공유하기 버튼을 누르면 복사되는 것을 만듦
Wordle 1765 X/6

⬛⬛⬛⬛⬛
⬛🟨⬛🟨⬛
🟨🟨🟨⬛⬛
🟩🟩🟩⬛⬛
🟩🟩🟩⬛⬛
🟩🟩🟩⬛⬛*/

export default useGameStore;
//외부에 쓸 수 있도록 하는 것