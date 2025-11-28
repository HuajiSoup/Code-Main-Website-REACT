function debounce(
    callback: Function,
    wait: number = 250,
) {
    let timeoutID: number | null = null;

    return () => {
        if (timeoutID) clearTimeout(timeoutID);
        timeoutID = window.setTimeout(callback, wait);
    };
}

function throttle(
    callback: Function,
    wait: number = 250,
) {
    let timeoutID: number | null = null;
    const callbackT = () => {
        callback();
        timeoutID = null;
    }

    return () => {
        if (timeoutID) return;
        timeoutID = window.setTimeout(callbackT, wait);
    };
}

export { debounce, throttle };