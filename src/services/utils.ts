
export function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export function capitalizeFirstLetter(string: string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const convertToSlug = (text: string): string => {
    const normalizedText = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const slug = normalizedText
        .toLowerCase()               
        .trim()                   
        .replace(/\s+/g, '-')       
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')      
        .replace(/^-+|-+$/g, ''); 

    return slug;
};
