export const formatNumber = (number: number, fraction?: number) => {
    return number.toLocaleString('en-EN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: fraction || 2
    });
};