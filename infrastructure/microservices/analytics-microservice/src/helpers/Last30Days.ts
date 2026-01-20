
export const buildLast30DaysMap = (): Map<string, number> => {
    const map = new Map<string, number>();

    const start = new Date();
    start.setDate(start.getDate() - 29);
    start.setHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);

        const key = d.toISOString().slice(0, 10);
        map.set(key, 0);
    }

    return map;
};
