export function parseOptionalInt(param: unknown): number | undefined {
    if (param === undefined){
        return undefined;
    }

    const n = parseInt(param as string, 10);
    return Number.isNaN(n) ? undefined : n;
}