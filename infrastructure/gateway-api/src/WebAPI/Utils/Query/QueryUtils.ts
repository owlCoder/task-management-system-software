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

/**
 * Parses optional string query parameter.
 * @param {unknown} param - value of the query parameter. 
 * @returns number if parameter is string, otherwise undefined.
 */
export function parseOptionalString(param: unknown): string | undefined {
    return typeof param === "string" ? param : undefined;
}

/**
 * Parses optional int array query parameter.
 * @param {unknown} param - value of the query parameter. 
 * @returns number[] if integers are split by ',', otherwise [].
 */
export function parseOptionalIntArray(param: unknown): number[] {
    if(!param || typeof param !== "string"){
        return [];
    }

    return param.split(",").map((x) => parseInt(x.trim(), 10)).filter((n) => Number.isFinite(n) && n > 0);
}