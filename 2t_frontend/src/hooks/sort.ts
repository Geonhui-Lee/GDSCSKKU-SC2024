export function reverseObjectKeys<T>(obj: Record<string, T>): Record<string, T> {
    const newObject: Record<string, T> = {};
    const keys = Object.keys(obj).reverse();
    keys.forEach(key => {
        newObject[key] = obj[key];
    });
    return newObject;
}