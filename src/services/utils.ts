
export function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export function capitalizeFirstLetter(string: string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function buildUrlWithParams(base: string, params: URLSearchParams, key: string, value?: string) {
    const newParams = new URLSearchParams(params.toString());
    if (value) {
        newParams.set(key, value);
    } else {
        newParams.delete(key);
    }
    const paramString = newParams.toString();
    return paramString ? `${base}?${paramString}` : base;
}