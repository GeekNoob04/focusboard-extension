/* global chrome */
import { useEffect, useState } from "react";

function SettingsSidebar({ isOpen, onClose, setBgColor, setBgImage }) {
    // passed via props
    const presetColors = [
        // Light / default tones
        "#e8edfc", // soft blue (default)
        "#f5f5f5", // pure neutral
        "#fff3e0", // warm cream
        "#e0f7fa", // aqua tint
        "#ede7f6", // lilac
        "#ffe0e0", // light pink

        // Calm pastel shades
        "#fce4ec", // pink blush
        "#e3f2fd", // pastel blue
        "#f3e5f5", // lavender haze
        "#e8f5e9", // soft green
        "#fff8e1", // pale yellow
        "#edeef7", // lavender gray
        "#eaf4fc", // sky tone

        // Muted professional tones
        "#d7ccc8", // beige gray
        "#cfd8dc", // cool gray
        "#fbe9e7", // peach tint
        "#f0f4c3", // light lime
        "#ffe082", // light gold
        "#c8e6c9", // mellow green

        // Slightly darker options (for contrast)
        "#b3e5fc", // soft cyan
        "#bbdefb", // light indigo
        "#ffccbc", // coral tint
        "#dcedc8", // olive pastel
        "#ffcdd2", // pink coral
    ];

    const [selectedColor, setSelectedColor] = useState("#e8edfc");
    useEffect(() => {
        chrome.storage.sync.get(["bgColor"], (data) => {
            if (data.bgColor) setSelectedColor(data.bgColor);
        });
    }, []);
    const handleColorSelect = (color) => {
        setSelectedColor(color);
        setBgColor(color);
        setBgImage("");
        chrome.storage.sync.set({ bgColor: color, bgImage: "" });
    };
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imgData = reader.result;
                setBgImage(imgData);
                setSelectedColor("");
                chrome.storage.sync.set({ bgImage: imgData });
            };
            reader.readAsDataURL(file); // convert image into a string URL
        }
    };
    const handleResetBackground = () => {
        chrome.storage.sync.remove(["bgColor", "bgImage"], () => {
            setBgColor("#e8edfc");
            setBgImage("");
        });
    };
    return (
        <div
            className={`fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
                isOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
            <div className="flex justify-between items-center p-4 border-b">
                <h2 className="font-semibold text-[#5062f0] text-lg">
                    Settings
                </h2>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-800"
                >
                    ✕
                </button>
            </div>
            <div className="p-4">
                <h3 className="font-medium mb-2">Background Color</h3>
                <div className="grid grid-cols-4 gap-2">
                    {presetColors.map((color) => (
                        <div
                            key={color}
                            className={`w-8 h-8 rounded-full cursor-pointer border ${
                                color === selectedColor
                                    ? "ring-2 ring-[#5062f0]"
                                    : ""
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => handleColorSelect(color)}
                        ></div>
                    ))}
                </div>
            </div>
            <div className="p-4 border-t">
                <h3 className="font-medium mb-2">Custom Background</h3>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Upload a custom background image
                </p>
            </div>
            <div className="p-4 border-t">
                <button
                    onClick={handleResetBackground}
                    className="w-full bg-[#5062f0] text-white py-2 rounded-xl hover:bg-[#3b4ad4] transition"
                >
                    Reset to Default
                </button>
            </div>
        </div>
    );
}
export default SettingsSidebar;
