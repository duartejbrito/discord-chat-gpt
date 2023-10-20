export function logMessage(message: string) {
    console.log(`[${new Date().toLocaleString()}] ${message}`);
}

export function splitStringByLimit(str: string, limit: number) {
    let result = [];
    let index = 0;

    while (index < str.length) {
        result.push(str.substring(index, limit));
        index += limit;
    }

    return result;
}