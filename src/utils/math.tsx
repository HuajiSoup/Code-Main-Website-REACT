// Math.random => [0, 1)

export function rand(a: number, b: number) {
    return Math.random() * (a - b) + b;
}

export function randint(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function clamp(min: number, x: number, max: number) {
    return x < max ? x > min ? x : min : max;
}