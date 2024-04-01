export const sluggifyString = (text: string): string => {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-_]/g, "")
        .replace(/\s+/g, "-");
};
