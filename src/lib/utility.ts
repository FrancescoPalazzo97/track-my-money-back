export function round(num: number, decimali: number) {
    return Math.round(num * Math.pow(10, decimali)) / Math.pow(10, decimali);
};
