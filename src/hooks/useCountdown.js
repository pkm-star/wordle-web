import { useState, useEffect } from 'react';

// 다음 자정까지 남은 시간을 HH:MM:SS 형식으로 반환하는 훅
function useCountdown() {
  const [time, setTime] = useState('');
  /*상태를 만든다. time이 값, setTime 바뀌는 함수*/

  useEffect(() => {
    /*useEffect(함수,[의존성배열]), 빈 배열은 컴포넌트가 처음 화면에 나타날 때 딱 한 번만 실행  */
    function tick() {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      //0시 0분 0초 0밀리초
      const diff = tomorrow - now;
      const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
      setTime(`${h}:${m}:${s}`);
    }
    /*padStart(2,'0') 숫자가 두자리 미만이면 앞에 0으로 채움 */
    tick();
    const id = setInterval(tick, 1000);
    /*setInterval(실행함수, 간격ms), tick 함수를 1초마다 실행 */
    return () => clearInterval(id);//취소
  }, []);

  return time;
}

export default useCountdown;
