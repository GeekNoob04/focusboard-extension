export default function isDarkColor(hexColor) {
    if (!hexColor || !hexColor.startsWith("#")) return false;

    const c = hexColor.substring(1);
    const rgb = parseInt(c, 16);

    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = rgb & 0xff;

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness < 128;
}
