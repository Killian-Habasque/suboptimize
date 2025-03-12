
export function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export function capitalizeFirstLetter(string: string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}
