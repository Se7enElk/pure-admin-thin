/**
 * Format timestamp to localized date-time string
 * @param timestamp Unix timestamp in seconds
 * @returns Formatted date-time string in zh-CN locale
 */
export const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    });
};
