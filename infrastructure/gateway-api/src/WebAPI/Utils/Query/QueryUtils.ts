/**
 * Parses optional int query parameters.
 * @param {unknown} param - value of the query parameter. 
 * @returns number if parameter is int, otherwise undefined.
 */
export function parseOptionalInt(param: unknown): number | undefined {
    if (param === undefined){
        return undefined;
    }

    const intParam = parseInt(param as string, 10);
    return !Number.isNaN(intParam) ? intParam : undefined;
}