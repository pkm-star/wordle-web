import { useState, useEffect } from 'react';
import useGameStore from '../useGameStore';
import { TIMING } from '../constants';

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message }) {
  const clearToast = useGameStore(s => s.clearToast);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const t = setTimeout(() => {
        setVisible(false);
        setTimeout(clearToast, TIMING.TOAST_FADE);
      }, TIMING.TOAST_DURATION);//한 번 보여줌
      return () => clearTimeout(t);// 취소,그만
    }
  }, [message, clearToast]);//의존성 배열로 message가 바뀔 때마다 useEffect가 실행됩니다.

  if (!message) return null;

  return (
    <div className="toast-container">
      <div className={`toast ${visible ? 'toast-show' : 'toast-hide'}`}>{message}</div>
    </div>
  );
}
/*모든 토스트가 보여지고 사라지는 것을 관리, setVisible로 토스트를 보여주고, 1.5초 후 숨김작동 0.2초 더 기다렸다
자연스럽게 사라짐, CSS에 0.2초 동안 투명해져 자연스럽게 사라지게 설정.*/

export default Toast;
