// 승리 메시지 - 시도 횟수(1~6)에 따라 다른 메시지
export const WIN_MESSAGES = ['Genius', 'Magnificent', 'Impressive', 'Splendid', 'Great', 'Phew!'];
//도전 횟수마다 출력값이 달라짐

// ─── 추측 평가 ────────────────────────────────────────────────────────────────
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

// ─── 하드모드 검증 ────────────────────────────────────────────────────────────
export function checkHardMode(guess, guesses, answer) {
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
  배열로 변환, key를 항상 문자열로 내보내기에 Number(pos) 숫자로 바꿔줌
  백틱+${}은 변수를 문자열 안에 끼워넣음*/

  for (const letter of mustContain) {
    if (!guess.includes(letter)) {
      return `Guess must contain ${letter.toUpperCase()}`;
    }
  }
  /*입력한 단어의 알파벳이 mustContain에 없다면 포함해야 한다고 알려줌*/

  return null;
}
