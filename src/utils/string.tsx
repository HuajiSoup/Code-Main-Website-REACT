export function replaceAllWith(str: string, reg: string | RegExp, func: (s: string) => string) {
    const matches = str.match(reg);
    matches?.forEach(res => {
        str = str.replace(res, func(res));
    });
    return str;
}