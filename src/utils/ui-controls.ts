export function repeat(repeatCount: number): ReadonlyArray<number> {
    if (repeatCount < 0 || !Number.isInteger(repeatCount)) {
        throw new Error('Repeat number should be positive integer');
    }
    return Array.from({ length: repeatCount }, (val, index) => index);
}

export function getRandom(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
}

export function unwrap<T>(value: unknown, assertion: string): T {
    if (typeof value === 'undefined' || value === null) {
        throw new Error(assertion);
    }
    return <T>value;
}
