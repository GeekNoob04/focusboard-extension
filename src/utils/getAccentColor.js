import isDarkColor from "./isDarkColor";

export default function getAccentColor(bgColor) {
    if (!bgColor || !bgColor.startsWith("#")) return "#5062f0";

    if (isDarkColor(bgColor)) return "#ffffff";

    const colorMap = {
        "#e8edfc": "#5062f0",
        "#f5f5f5": "#4a4a4a",
        "#fff3e0": "#e67e22",
        "#e0f7fa": "#0097a7",
        "#ede7f6": "#6c63ff",
        "#ffe0e0": "#e53935",
        "#d1ffd6": "#2e7d32",

        "#fce4ec": "#c2185b",
        "#e3f2fd": "#1976d2",
        "#f3e5f5": "#8e24aa",
        "#e8f5e9": "#43a047",
        "#fff8e1": "#fbc02d",
        "#edeef7": "#5c6bc0",
        "#eaf4fc": "#1976d2",

        "#d7ccc8": "#5d4037",
        "#cfd8dc": "#37474f",
        "#fbe9e7": "#d84315",
        "#f0f4c3": "#827717",
        "#ffe082": "#f57f17",
        "#c8e6c9": "#388e3c",

        "#b3e5fc": "#0288d1",
        "#bbdefb": "#1565c0",
        "#ffccbc": "#f4511e",
        "#dcedc8": "#558b2f",
        "#ffcdd2": "#e57373",
    };

    return colorMap[bgColor] || "#5062f0";
}
