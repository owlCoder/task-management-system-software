export const formatDateRS = (value: string | Date): string => {
    const date = value instanceof Date ? value : new Date(value);

    if (isNaN(date.getTime())) return String(value);

    return date.toLocaleDateString("sr-RS", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};
