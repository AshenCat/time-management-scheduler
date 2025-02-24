import { useEffect, useState } from "react";

function useCountdown(num: number) {
    const [countdown, setCountdown] = useState(num);
    useEffect(() => {
        const timer = setInterval(() => {
            if (countdown > 1) {
                setCountdown(countdown - 1);
            } else {
                clearInterval(timer);
            }
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, [countdown]);
    return countdown;
}

export default useCountdown;
