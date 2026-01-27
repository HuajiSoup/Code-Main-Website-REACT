/**
 * Get a modified function as a replacement of `callback`,
 * execute once `callback` only when
 * this function was not called during `wait`ms.
 * @param callback The callback function to execute
 * @param wait interval time (ms)
 * @returns a debounced function
 */
export function debounce<F extends (...args: unknown[]) => unknown>(
    callback: F,
    wait: number = 250,
) {
    let timeoutID: number | null = null;

    return () => {
        if (timeoutID) clearTimeout(timeoutID);
        timeoutID = window.setTimeout(callback, wait);
    };
}

/**
 * Get a modified function as a replacement of `callback`,
 * execute `callback` only every `throttle`ms.
 * @param callback The callback function to execute
 * @param wait interval time (ms)
 * @returns a throttle function
 */
export function throttle<F extends (...args: unknown[]) => unknown>(
    callback: F,
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