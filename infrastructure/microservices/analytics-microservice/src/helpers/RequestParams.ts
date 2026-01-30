export const getParamAsString = (
    param: string | string[] | undefined
): string | null => {
    if (!param) return null;
    return Array.isArray(param) ? param[0] : param;
};

export const parseId = (
    param: string | string[] | undefined
): number | null => {
    const s = getParamAsString(param);
    if (!s) return null;

    const n = Number.parseInt(s, 10);
    return Number.isFinite(n) ? n : null;
};
