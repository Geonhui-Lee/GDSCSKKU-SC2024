import { useState, useEffect } from 'react';

export function useLongPress(callback = () => {}, ms = 300) {
    const [startLongPress, setStartLongPress] = useState(false);

    useEffect(() => {
        let timerId: NodeJS.Timeout | undefined;
        if (startLongPress) {
            timerId = setTimeout(callback, ms);
        } else {
            if (timerId) {
                clearTimeout(timerId);
            }
        }

        return () => {
            if (timerId) {
                clearTimeout(timerId);
            }
        };
    }, [callback, ms, startLongPress]);
  
    return {
        onMouseDown: () => setStartLongPress(true),
        onMouseUp: () => setStartLongPress(false),
        onMouseLeave: () => setStartLongPress(false),
        onTouchStart: () => setStartLongPress(true),
        onTouchEnd: () => setStartLongPress(false),
    };
}